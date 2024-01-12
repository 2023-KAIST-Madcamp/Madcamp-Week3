from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from flask import Flask, request
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
        user_list = list(user_collection.find({'name': data['name']}))
        print(len(uesr_list))

        
        return 'Data received and updated in MongoDB!'

if __name__ == '__main__':
    app.run(debug=True)