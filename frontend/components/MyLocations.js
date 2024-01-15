import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View , Text, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { useData } from '../context/DataContext';

export default function MyLocations() {
    const {userData} = useData()
    const [mylocation, setMylocation] = useState([])
    useEffect(() => {
        const getLocation= async () => {
          // Your Flask backend endpoint for handling image uploads
          const uploadEndpoint = 'http://143.248.192.190:5000/showmap';
      
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
    },
  });