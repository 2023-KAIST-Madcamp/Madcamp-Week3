from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
app = Flask(__name__)

client = MongoClient('mongodb+srv://dlgudwls8184:NeTSWJRhf3bF7yIe@cluster0.escpqml.mongodb.net/')

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

if __name__ == '__main__':
    app.run(debug=True)