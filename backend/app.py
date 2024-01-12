from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from flask_cors import CORS
from flask import Flask, request, jsonify
import json
import requests
import certifi

app = Flask(__name__)
CORS(app)
ca = certifi.where()

client = MongoClient('mongodb+srv://dlgudwls8184:NeTSWJRhf3bF7yIe@cluster0.escpqml.mongodb.net/', tlsCAFile = ca)

db = client['DevToday']

user_collection = db['User']

@app.route('/login', methods=['POST'])
def index():
    # Perform MongoDB operations here using 'collection'
    if request.method == 'POST':
        data = request.json  # Get the JSON data sent from React Native
        print(data)




        
        user_list = list(user_collection.find({'kakaoid': data['kakaoid']}))
        print(user_list)
        if(len(user_list) != 0):
            print("이미 존재하는 계정 -> 로그인")
            print(user_list[0]['_id'])
            return jsonify({'User_id' : str(user_list[0]['_id'])})
        else:
            print("새로운 계정 -> 등록")
            result = user_collection.insert_one({"kakaoid": data['kakaoid'], "name": data['name']})
            return jsonify({'user_id' : str(result.inserted_id)})

@app.route('/user', methods=['POST'])
def receive_token():
    if request.method == 'POST':
        data = request.get_json()
        grant_type = data.get('grant_type')
        client_id = data.get('client_id')
        redirect_uri = data.get('redirect_uri')
        code = data.get('code')

        print(data)
        grant_type = data['grant_type']
        client_id = data['client_id']
        redirect_uri = data['redirect_uri']
        code = data['code']
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


        print(type(response.text))

        json_response = json.loads(response.text)

        app_username = json_response['properties']['nickname']
        app_profile_pic = json_response['properties']['profile_image']

        return jsonify("Got kakao id")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)