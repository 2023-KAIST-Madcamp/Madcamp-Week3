from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from flask_cors import CORS
from flask import Flask, request, jsonify, url_for, send_from_directory
from bson.json_util import dumps
from werkzeug.utils import secure_filename
import os
import json
import requests
import certifi
from datetime import datetime, timedelta
import base64
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)
ca = certifi.where()

client = MongoClient('mongodb+srv://dlgudwls8184:NeTSWJRhf3bF7yIe@cluster0.escpqml.mongodb.net/', tlsCAFile = ca)

db = client['DevToday']

user_collection = db['User']

velog_collection = db['Velog']
velog_rec_collection = db['Velog_Recommended']
today_collection = db['Today']

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        grant_type = data.get('grant_type')
        client_id = data.get('client_id')
        redirect_uri = data.get('redirect_uri')
        code = data.get('code')

        print(data)
        print(grant_type)
        
        # Perform actions with the received access token (e.g., store it in the database)
        # Example: Store the access token in the database
        # Your code here...

        token_response = requests.post(
            f'https://kauth.kakao.com/oauth/token',
            data={
                'grant_type': 'authorization_code',
                'client_id': client_id,
                'redirect_uri': redirect_uri,
                'code': code
            },
            headers={"content-type": "application/x-www-form-urlencoded"}
        )

        kakao_token = token_response.json()
        print(kakao_token)

        headers= {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer ' + str(kakao_token['access_token'])
        }


        user_url = "https://kapi.kakao.com/v2/user/me"

        response = requests.request("GET", user_url, headers=headers)
        print("This is the response")
        print(response.text)
        json_response = response.json()
        kakao_id = json_response.get('id')  # 카카오 아이디 가져오기
        profile = json_response.get('kakao_account').get('profile')  # 프로필 정보 가져오기
        nickname = profile['nickname']
        thumbnail_image_url = profile['thumbnail_image_url']
        print(kakao_id)
        print(nickname)
        print(thumbnail_image_url)
        finduser = user_collection.find_one({'kakao_id' : kakao_id})
        

        if(finduser):
            print("존재하는 아이디 -> 로그인 절차 실행")
            return {'user_id' : str(finduser['_id']), 'kakao_id' : str(finduser['kakao_id']), 'nickname' : str(finduser['nickname']), 'code' : str(finduser['kakao_id']), 'thumbnail_image_url' : str(finduser['thumbnail_image_url'])}
        
        else:
            print("존재하지 않는 아이디 -> db에 등록 실행")
            result = user_collection.insert_one({"kakao_id": kakao_id, "nickname": nickname, 'code' : str(kakao_id), "thumbnail_image_url" : thumbnail_image_url, "friends" : [], "location": "", "online" : False})
            new_result = user_collection.update_one({'_id' : result.inserted_id}, {'$push': {'friends': str(result.inserted_id)}})
            return {'user_id' : str(result.inserted_id), 'kakao_id' : str(kakao_id), 'nickname' : str(nickname), 'code' : str(kakao_id), 'thumbnail_image_url' : str(thumbnail_image_url)}

@app.route('/showvelogs', methods=['POST'])
def showVelogs():
    if request.method == 'POST':
        data = request.get_json()
        tags_to_find = data['tags']
        sortby = data['sortby']
        isdescending = data['isdescending']
        if tags_to_find:
            velogs_to_show = velog_collection.find({'tags': {'$all': tags_to_find}})
        else:
            velogs_to_show = velog_collection.find()
        if sortby == 'time':
            sorted_velogs_to_show = sorted(velogs_to_show, key=lambda doc: doc['time'], reverse = isdescending)
        elif sortby == 'thumbs':
            def getrecentthumbs(doc):
                doc1 = velog_rec_collection.find({'velog_id' : str(doc['_id'])})
                score = 0
                current = datetime.now()
                for document in doc1:
                    stored_time = datetime.strptime(document['time'], "%Y-%m-%d %H:%M:%S")
                    if current - stored_time < timedelta(hours=12):
                        score += 10
                    elif current - stored_time < timedelta(days=1):
                        score += 5
                    elif current - stored_time < timedelta(days=3):
                        score += 2
                print(score)
                return score

            sorted_velogs_to_show = sorted(velogs_to_show, key=lambda doc: getrecentthumbs(doc), reverse = isdescending)
        else:
            return {'velogs_to_show' : None}
        for doc in sorted_velogs_to_show:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
            author = user_collection.find_one({'_id' : ObjectId(doc['user_id'])})
            author['_id'] = str(author['_id'])
            doc['author'] = author
        return {'velogs_to_show' : sorted_velogs_to_show}
    
@app.route('/showvelog', methods=['POST'])
def showVelog():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data['user_id']
        velog_id = data['velog_id']
        velog = velog_collection.find_one({'_id' : ObjectId(velog_id)})
        isthumbedup = True if velog_rec_collection.find_one({'user_id' : user_id, 'velog_id' : velog_id}) else False
        velog['_id'] = str(velog['_id'])
        author = user_collection.find_one({'_id' : ObjectId(velog['user_id'])})
        author['_id'] = str(author['_id'])
        return {'velog' : velog, 'isthumbedup' : isthumbedup, 'author' : author}
    
@app.route('/showtodays', methods=['GET'])
def showTodays():
    if request.method == 'GET':
        todays_to_show = today_collection.find()
        sorted_todays_to_show = sorted(todays_to_show, key=lambda doc: doc['time'], reverse = True)
        for doc in sorted_todays_to_show:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        return {'todays_to_show' : sorted_todays_to_show}
    
@app.route('/createvelog', methods=['POST'])
def createVelog():
    if request.method == 'POST':
        data = request.get_json()
        title = data['title']
        user_id = data['user_id']
        sections = data['sections']
        tags = data['tags']
        current = datetime.now()
        result = velog_collection.insert_one({"title": title, "user_id": user_id, 'sections' : sections, "tags" : tags, "time": current.strftime("%Y-%m-%d %H:%M:%S"), "thumbs" : 0})
        url = []
        index = 0
        for section in sections:
            if section['type'] == 'image':
                new_url = save_image(section['content'], 'uploads/velogs/' + str(result.inserted_id) + str(index) +'.png')
                section['content'] = new_url
            index += 1
        print(sections)
        result = velog_collection.update_one({'_id': result.inserted_id}, {'$set': {'sections': sections}})
        if result:
            return {'issucessful' : True}
        else:
            return {'issucessful' : False}

@app.route('/createtoday', methods=['POST'])
def createToday():
    if request.method == 'POST':
        print("createToday 들어옴")
        data = request.get_json()
        user_id = data['user_id']
        image = data['image']
        location = data['location']
        print(location)
        current = datetime.now()

        result = today_collection.insert_one({"user_id": user_id, "image" : "", "location" : location, "time": current.strftime("%Y-%m-%d %H:%M:%S")})
        url = save_image(image, 'uploads/todays/' + str(result.inserted_id) + '.png')
        print(url)
        result = today_collection.update_one({'_id': result.inserted_id}, {'$set': {'image': url}})
        result = user_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'location': location}})
        if result:
            return {'issucessful' : True}
        else:
            return {'issucessful' : False}
    
@app.route('/showfriends', methods=['POST'])
def showFriends():
    if request.method == 'POST':
        data = request.get_json()
        user_id = ObjectId(data['user_id'])
        user = user_collection.find_one({'_id' : user_id})
        print(user)
        friendsidlist = user['friends']
        print("this is friendsidlist")
        print(friendsidlist)
        cursor = user_collection.find({'_id' : {'$in' : list(map(ObjectId, friendsidlist))}})
        friendslist = list(cursor)
        for doc in friendslist:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        print(friendslist)
        return {'friendslist' : friendslist}

@app.route('/addfriends', methods=['POST'])
def addFriends():
    if request.method == 'POST':
        data = request.get_json()
        user_id = ObjectId(data['user_id'])
        user_code = data['code']
        findfriend = user_collection.find_one({'code' : user_code})
        if(findfriend):
            friendid = findfriend['_id']
            print(friendid)
            result = user_collection.update_one({'_id': user_id}, {'$push': {'friends': str(friendid)}})
            print(result)
            return {'issucessful' : True}
        else:
            return {'issucessful' : False}
        
@app.route('/deletefriend', methods=['POST'])
def deleteFriend():
    if request.method == 'POST':
        data = request.get_json()
        user_id = ObjectId(data['user_id'])
        target_id = data['target_id']
        print("user_id" + str(user_id))
        print("target_id" + target_id)
        result = user_collection.update_one({'_id': user_id}, {'$pull': {'friends': target_id}})
        return {'issucessful' : True}
        
@app.route('/myvelogs', methods=['POST'])
def myVelogs():
    if request.method == 'POST':
        data = request.get_json()
        print("myvelogs 들어옴")
        user_id = data['user_id']
        tags_to_find = data['tags']
        isdescending = data['isdescending']
        if tags_to_find:
            velogs_to_show = velog_collection.find({'tags': {'$all': tags_to_find}, 'user_id' : user_id})
        else:
            velogs_to_show = velog_collection.find({'user_id' : user_id})
        sorted_velogs_to_show = sorted(velogs_to_show, key=lambda doc: doc['time'], reverse = isdescending)
        for doc in sorted_velogs_to_show:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        return {'velogs_to_show' : sorted_velogs_to_show}
    
@app.route('/givethumb', methods=['POST'])
def giveThumb():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data['user_id']
        velog_id = data['velog_id']
        thumbed = velog_rec_collection.find_one({'user_id' : user_id, 'velog_id' : velog_id})
        if thumbed:
            upordown = -1
            velog_rec_collection.delete_one({'velog_id' : velog_id, 'user_id' : user_id})
            print('yesthumb -> nothumb')
        else:
            upordown = 1
            current_time = datetime.now()
            velog_rec_collection.insert_one({'velog_id' : velog_id, 'user_id' : user_id, 'time' : current_time.strftime("%Y-%m-%d %H:%M:%S")})
            print('nothumb -> yesthumb')
        old_thumbs = velog_collection.find_one({'_id' : ObjectId(velog_id)})['thumbs']
        result = velog_collection.update_one({'_id': ObjectId(velog_id)}, {'$set': {'thumbs': old_thumbs + upordown}})
        if thumbed: return {'isthumbedup' : False}
        else : return {'isthumbedup' : True}

@app.route('/mytodays', methods=['POST'])
def myTodays():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data['user_id']
        print("mytodays 들어옴")
        mytodays = list(today_collection.find({'user_id' : user_id}))
        sorted_mytodays = sorted(mytodays, key=lambda doc: doc['time'], reverse = True)
        for doc in sorted_mytodays:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        print(len(sorted_mytodays))
        return {'mytodays' : sorted_mytodays}

@app.route('/showmap', methods=['POST'])
def showMap():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data['user_id']
        print("showmap 들어옴")
        print(user_id)
        me = user_collection.find_one({'_id' : ObjectId(user_id)})
        friends_id = me['friends']
        friends = list(map(lambda x : user_collection.find_one({'_id' : ObjectId(x)}), friends_id))
        for doc in friends:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        print(friends)
        return {'friends' : friends}

    
# @app.route('/showmap', methods=['POST'])
# def showMap():
#     if request.method == 'POST':
#         data = request.get_json()
#         user_id = data['user_id']
#         print("showmap 들어옴")
#         me = user_collection.find_one({'_id' : ObjectId(user_id)})
#         friends_id = me['friends']
#         friends = list(map(lambda x : user_collection.find_one({'_id' : ObjectId(x)}), friends_id))
#         for doc in friends:
#             if '_id' in doc:
#                 doc['_id'] = str(doc['_id'])
#         print(friends)
#         return {'friends' : friends}
    
@app.route('/uploads/todays/<filename>')
def get_image_todays(filename):
    return send_from_directory('uploads/todays', filename)

@app.route('/uploads/velogs/<filename>')
def get_image_velogs(filename):
    return send_from_directory('uploads/velogs', filename)

def save_image(base64_string, image_path):
    
    # base64 문자열을 바이트로 디코딩합니다.
    image_data = base64.b64decode(base64_string)
    
    # BytesIO 객체를 통해 이미지 데이터를 이미지 파일로 변환합니다.
    image = Image.open(BytesIO(image_data))
    
    # 이미지를 파일 시스템에 저장합니다.
    image.save(image_path)
    
    # 저장된 이미지의 URL을 생성합니다. (예: 웹 서버의 URL)
    image_url = f'http://192.249.31.81:5000/{image_path}'
    
    return image_url
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)