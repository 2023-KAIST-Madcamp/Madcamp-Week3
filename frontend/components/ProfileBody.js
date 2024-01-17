import React, {useState, useEffect} from 'react';
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
    const [followerArray, setFollowerArray] = useState([])
    useEffect(() => {
      const getFriendsFromBackend = async () => {
        const uploadEndpoint = 'http://' + global.address + ':5000/showfriends';
        const requestData = {
    
          user_id: userData["user_id"],

      };
        try {
          const uploadResponse = await fetch(uploadEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
          const responseData = await uploadResponse.json(); // Parse JSON response
          console.log(responseData)
          setFollowerArray(responseData.friendslist)
          if (uploadResponse.ok) {
            console.log('Friends List Fetched successfully');
            console.log(responseData)
          } else {
            console.error('Failed to get friendslist from backend:', uploadResponse.status, uploadResponse.statusText);
          }
        } catch (error) {
          console.error('Error getting friendslist:', error);
        }
      }
    
      getFriendsFromBackend();
    
    }, []); // Provide an empty dependency array
    const navigation = useNavigation();

    const handleFriends = () => {
      navigation.navigate('FriendsList')
     }
  
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
        <TouchableOpacity onPress={handleFriends} style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>{followerArray.length - 1}</Text>
          <Text style={{color: 'white'}}>Friends</Text>
        </TouchableOpacity>
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
    const apiUrl = 'http://' + global.address + ':5000/addfriends'; // Replace with your backend API endpoint

    // Create an object with the necessary data
    const requestData = {
      user_id: userData['user_id'],
      code: friendName,
    };

    // Send a POST request to the backend
    fetch(apiUrl, {
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
          <TouchableOpacity onPress={handleAddFriend} style={{ width: '100%'}}>
            <View
              style={{
                width: '100%',
                height: 35,
                borderRadius: 5,
                borderColor: '#DEDEDE',
                borderWidth: 1,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    letterSpacing: 1,
                    opacity: 0.8,
                    color: 'white'
                  }}>Add Friend</Text>
            </View>
          </TouchableOpacity>
           
        </View>
    </>
  );
};