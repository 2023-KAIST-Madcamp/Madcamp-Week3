import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View , Text, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { useData } from '../context/DataContext';
import * as Location from 'expo-location';

export default function MapPage() {

  const {userData} = useData()
  const [mylocation, setMylocation] = useState([])
  const [friendsLocation, setFriendsLocation] = useState([])


  // const markers = famous.famous.map((item, index) => ({
  //   id: index + 1,
  //   coordinate: { latitude: item.coordinate.latitude, longitude: item.coordinate.longitude },
  //   title: item.title,
  //   // Add other properties as needed from famous.famous
  // }));

  console.log(userData['user_id'])

  useEffect(() => {
    const getLocation= async () => {
      // Your Flask backend endpoint for handling image uploads
      const apiUrl = 'http://' + global.address + ':5000/showmap'; // Replace with your backend API endpoint
  
        const requestData = {
          user_id: userData["user_id"],
        };
    
      try {
        const uploadResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await uploadResponse.json(); // Parse JSON response
        
        console.log("The return value from showmap in MapPage")
        console.log(responseData)
        console.log(responseData.friends[0].location[0])
        
        

        if (uploadResponse.ok) {
          console.log('Got friends information successfully');
          setFriendsLocation(responseData.friends);

        } else {
          console.error('Couldnt get friends info:', uploadResponse.status, uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error getting friends info:', error);
      }
    };

    getLocation()
  },[])

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let res = await Location.getCurrentPositionAsync({});
      console.log(res)

      
      
    })();
  }, []);

  
  // const markers =  {
    
  //   coordinate: {latitude: friendsLocation.friends[0].location[0], longitude: friendsLocation.friends[0].location[1] },
  //   title: friendsLocation.friends[0].nickname
  //   // Add other properties as needed from famous.famous
  // }



    return (
        <View style={styles.mapcontainer}>
 {friendsLocation.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 36.3721,
            longitude: 127.3604,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {friendsLocation.map((friend, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: friend.location[0],
                longitude: friend.location[1],
              }}
              title={friend.nickname}
            >
               <Image
                source={{ uri: friend.thumbnail_image_url }}
                style={{ width: 40, height: 40 , resizeMode: 'contain', borderRadius: 50}}
              />
              </Marker>
          ))}
        </MapView>
      )}
            </View>
    )
}
const styles = StyleSheet.create({
    mapcontainer: {
        backgroundColor: 'white'
    },
    map: {
      width: '100%',
      height: '100%',
      filter: 'grayscale(100%)'
    },
  });