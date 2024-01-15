import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import { useData } from '../context/DataContext';

export const ProfileBody = ({
  name,
  accountName,
  post,
  followers,
}) => {
    const { userData } = useData(); // Get setUserData    console.log("This is the userdata in the profile page")
    console.log(userData)

  
  return (
    <View>
      {accountName ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
          </View>
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: 20,
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            source={{uri: userData["thumbnail_image_url"]}}
            style={{
              resizeMode: 'cover',
              width: 80,
              height: 80,
              borderRadius: 100,
            }}
          />
          <Text
            style={{
              paddingVertical: 5,
              fontWeight: 'bold',
              color: 'white'
            }}>
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>{userData["nickname"]}</Text>
          <Text style={{color: 'white'}}>{userData["kakao_id"]}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>20</Text>
          <Text style={{color: 'white'}}>Friends</Text>
        </View>
      </View>
    </View>
  );
};

export const ProfileButtons = ({id, name, accountName, profileImage}) => {
  const navigation = useNavigation();
  const [follow, setFollow] = useState(follow);
  const [friendName, setFriendName] = useState('');
  const {userData} = useData()

  const handleAddFriend = () => {
    // Your backend endpoint for adding friends
    const addFriendEndpoint = 'http://143.248.192.190:5000/addfriends';

    // Create an object with the necessary data
    const requestData = {
      user_id: userData['user_id'],
      code: friendName,
    };

    // Send a POST request to the backend
    fetch(addFriendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the response from the backend if needed
        console.log(responseData);
      })
      .catch((error) => {
        console.error('Error adding friend:', error);
      });
  };

  return (
    <>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingVertical: 5,
          }}>
             <TextInput
            placeholder="Add Friends"
            placeholderTextColor="#909090"
            onChangeText={(text) => setFriendName(text)}
            style={{
              width: '94%',
              backgroundColor: '#EBEBEB',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              padding: 4,
              paddingLeft: 20,
              marginBottom: 10
            }}
          />
          <TouchableOpacity onPress={handleAddFriend}>
        <View
          style={{
            width: '100%',
            height: 35,
            borderRadius: 5,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Text style={{ color: 'white' }}>Add Friend</Text>
        </View>
      </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.push('EditProfile', {
                  name: name,
                  accountName: accountName,
                  profileImage: profileImage,
                })
              }
              style={{
                width: '100%',
              }}>
              <View
                style={{
                  width: '100%',
                  height: 35,
                  borderRadius: 5,
                  borderColor: '#DEDEDE',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    letterSpacing: 1,
                    opacity: 0.8,
                    color: 'white'
                  }}>
                  Edit Profile
                </Text>
              </View>
            </TouchableOpacity>    
        </View>
    </>
  );
};