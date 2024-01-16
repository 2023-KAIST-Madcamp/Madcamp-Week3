import React, {useEffect,useState} from 'react';
import {useData} from '../context/DataContext'
import {View, Text, ScrollView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Entypo from 'react-native-vector-icons/Entypo'
import './global';

const BottomTabView = () => {
  const Tab = createMaterialTopTabNavigator();
  const [todayimage, setTodayimage] = useState([])
  const {userData} = useData()
  

  useEffect(() => {
    const getImageFromBackend = async () => {
      const uploadEndpoint = 'http://' + global.address + ':5000/mytodays';
      const requestData = {
        user_id: userData["user_id"]
      };
      console.log("mytodays 들어옴")
      try {
        console.log(requestData)
        console.log(JSON.stringify(requestData))
        const uploadResponse = await fetch(uploadEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        const responseData = await uploadResponse.json(); // Parse JSON response
        console.log(responseData)
        setTodayimage(responseData.mytodays)
  
        if (uploadResponse.ok) {
          console.log('Image Fetched successfully');
        } else {
          console.error('Failed to get image from backend:', uploadResponse.status, uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error getting image:', error);
      }
    }
  
    getImageFromBackend();
  
  }, []); // Provide an empty dependency array



  let squares = [];
  let numberOfSquare = 7;

  for (let index = 0; index < numberOfSquare; index++) {
    squares.push(
      <View key={index}>
        <View
          style={{
            width: 130,
            height: 150,
            marginVertical: 0.5,
            backgroundColor: 'white',
            opacity: 0.8,
          }}></View>
      </View>,
    );
  }

  const Code = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            flexWrap: 'wrap',
            flexDirection: 'row',
            paddingVertical: 5,
            justifyContent: 'space-between',
          }}>
          {squares}
        </View>
      </ScrollView>
    );
  };
  const Gallery = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          height: '100%',
        }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>            
                    {todayimage.map((data, index) => {
              console.log(data.image)
              return (
                // <View key={index}>
                  // <View
                  //   style={{
                  //     flexDirection: 'row',
                  //     flexWrap: 'wrap',
                  //     justifyContent: 'space-between',
                  //     width: '100%',
                  //   }}>
                    <TouchableOpacity
                      key={data._id}
                      style={{ paddingBottom: 2, width: '50%' }}>
                      <Image
                        source={{ uri: data.image}}
                        style={{ width: '100%', height: 150 }}
                      />
                    </TouchableOpacity>
                  // {/* </View> */}
                // </View>
              );
            })}
        </View>
      </ScrollView>
    );
  };
  function MyLocations() {
    const {userData} = useData()
    const [mylocation, setMylocation] = useState([])
    const [friendsLocation, setFriendsLocation] = useState([])

    useEffect(() => {
        const getLocation= async () => {
          // Your Flask backend endpoint for handling image uploads
          const apiUrl = 'http://' + global.address + ':5000/mytodays'; // Replace with your backend API endpoint
      
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
            
            console.log("The return value from mytodays in ProfilePage")
            console.log(responseData)
            
            
    
            if (uploadResponse.ok) {
              console.log('Got mytodays information successfully');
              setFriendsLocation(responseData.mytodays);
    
            } else {
              console.error('Couldnt get mytodays info:', uploadResponse.status, uploadResponse.statusText);
            }
          } catch (error) {
            console.error('Error getting mytodays info:', error);
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
                        source={{ uri: friend.image}}
                        style={{ width: 40, height: 40 , resizeMode: 'contain', borderRadius: 50}}
                        />
                        </Marker>
                    ))}
                </MapView>
                )}
        </View>
       )
}

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          backgroundColor: 'black',
          height: 1.5,
        },
        tabBarIcon: ({focused, colour}) => {
          let iconName;
          if (route.name === 'Code') {
            iconName = focused ? 'code' : 'code';
            colour = focused ? 'black' : 'gray';
          } else if (route.name === "Gallery") {
            iconName = focused ? 'folder-images' : 'folder-images';
            colour = focused ? 'black' : 'gray';
          }
           else {
            iconName = focused ? 'location' : 'location';
            colour = focused ? 'black' : 'gray';
          }

          return <Entypo name={iconName} color={colour} size={22} />;
        },
      })}>
      <Tab.Screen name="Code" component={Code} />
      <Tab.Screen name="Gallery" component={Gallery} />
      <Tab.Screen name="MyLocations" component={MyLocations} />
    </Tab.Navigator>
  );
};

export default BottomTabView;

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