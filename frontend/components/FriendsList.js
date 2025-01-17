import React, { Component, useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native'
import { useData } from '../context/DataContext';
import Avatar from './Avatar';
export default function FriendsList() {

  const { userData } = useData()
  const [followerArray, setFollowerArray] = useState([])

  const deleteFriend = async (friend_id) => {
    const uploadEndpoint = 'http://' + global.address + ':5000/deletefriend';
    const requestData = {
      user_id: userData['user_id'],
      target_id: friend_id
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
      console.log(responseData.isthumbedup)
      if (uploadResponse.ok) {
        console.log('deleted successfully');
      } else {
        console.error('Failed to delete:', uploadResponse.status, uploadResponse.statusText);
      }
    } catch (error) {
      console.error('Error delete :', error);
    }
  }

  const handleDelete = (friend_id) => {
    deleteFriend(friend_id)
    Alert.alert('Friend deleted', 'Friend deleted successfully.');
  }

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
        console.log("This is the friends list")
        console.log(responseData.friendslist)
        setFollowerArray(responseData.friendslist)
        if (uploadResponse.ok) {
          console.log('Friends List Fetched successfully');
        } else {
          console.error('Failed to get friendslist from backend:', uploadResponse.status, uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error getting friendslist:', error);
      }
    }

    getFriendsFromBackend();

  }, []); // Provide an empty dependency array
  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
    <Text style={styles.header}>Friends</Text>
    {
      followerArray.map((item, index) => {
        if (item._id !== userData['user_id']) {
          return (
            <View key={item.id} style={styles.container}>
              <Text style={styles.text}>
                {item.name}
              </Text>
              <View style={styles.headerUserContainer}>
                <Avatar imgSource={item.thumbnail_image_url} size={40} />
                <Text style={styles.headerUsername}>{item.nickname}</Text>
                <TouchableOpacity style={styles.deleteButton} onPressOut={() => handleDelete(item._id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      })
    }
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 3,
    backgroundColor: 'black',
    alignItems: 'center',
    borderColor: 'white'
  },
  text: {
    color: 'white'
  },
  header: {
    marginTop: 40,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  headerUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUsername: {
    marginLeft: 6,
    color: 'white'
  },
  deleteButton: {
    height: 30,
    backgroundColor: 'red',
    marginLeft: 100, // Push the button to the far right
    padding: 5,
  },
  buttonText: {
    color: 'white',
  },
})