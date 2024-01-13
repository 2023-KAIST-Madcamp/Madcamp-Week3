from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from flask_cors import CORS
from flask import Flask, request, jsonify, url_for
from bson.json_util import dumps
from werkzeug.utils import secure_filename
import os
import json
import requests
import certifi
from datetime import datetime, timedelta

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
        return {'velogs_to_show' : sorted_velogs_to_show}
    
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
        images = data['images']
        content = data['content']
        tags = data['tags']
        current = datetime.now()
        result = velog_collection.insert_one({"title": title, "user_id": user_id, 'content' : content, "images" : images, "tags" : tags, "time": current.strftime("%Y-%m-%d %H:%M:%S"), "thumbs" : 0})
        if result:
            return {'issucessful' : True}
        else:
            return {'issucessful' : False}

@app.route('/createtoday', methods=['POST'])
def createToday():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data['user_id']
        image = data['image']
        location = data['location']
        current = datetime.now()
        result = today_collection.insert_one({"user_id": user_id, "image" : image, "location" : location, "time": current.strftime("%Y-%m-%d %H:%M:%S")})
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
        cursor = user_collection.find({'_id' : {'$in' : friendsidlist}})
        friendslist = list(cursor)
        for doc in friendslist:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        return {'friendslist' : friendslist}

@app.route('/addfriends', methods=['POST'])
def addFriends():
    if request.method == 'POST':
        data = request.get_json()
        user_id = ObjectId(data['user_id'])
        print(type(user_id))
        user_code = data['code']
        findfriend = user_collection.find_one({'code' : user_code})
        if(findfriend):
            friendid = findfriend['_id']
            print(friendid)
            result = user_collection.update_one({'_id': user_id}, {'$push': {'friends': friendid}})
            print(result)
            return {'issucessful' : True}
        else:
            return {'issucessful' : False}
        
@app.route('/myvelogs', methods=['POST'])
def myVelogs():
    if request.method == 'POST':
        data = request.get_json()
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
        else:
            upordown = 1
            current_time = datetime.now()
            velog_rec_collection.insert_one({'velog_id' : velog_id, 'user_id' : user_id, 'time' : current_time.strftime("%Y-%m-%d %H:%M:%S")})
        old_thumbs = velog_collection.find_one({'_id' : ObjectId(velog_id)})['thumbs']
        result = velog_collection.update_one({'_id': ObjectId(velog_id)}, {'$set': {'thumbs': old_thumbs + upordown}})
        if thumbed: return {'isthumbedup' : False}
        else : return {'isthumbedup' : True}

@app.route('/mytodays', methods=['POST'])
def myTodays():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data['user_id']
        mytodays = list(today_collection.find({'user_id' : user_id}))
        for doc in mytodays:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        return {'mytodays' : mytodays}
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)