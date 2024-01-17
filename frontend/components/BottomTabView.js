import React, {useEffect,useState} from 'react';
import {useData} from '../context/DataContext'
import {View, Text, ScrollView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Entypo from 'react-native-vector-icons/Entypo'
import Avatar from './Avatar';
import { useNavigation } from '@react-navigation/native';

import './global';

const BottomTabView = () => {
  const Tab = createMaterialTopTabNavigator();
  const [todayimage, setTodayimage] = useState([])
  const {userData} = useData()
  const [postlist, setPostlist] = useState([])
  const navigation = useNavigation();

  const imagesInSection = postlist.map(post => ({
    _id: post._id,
    images: post.sections.filter(section => section.type === "image")
  }));
  const [isLiked, setIsLiked] = useState(false);

const handleThumbs = () => {
  setIsLiked(!isLiked);
  // Add your logic for handling the like/unlike action here
};
const handleDetails = (i) => {
  navigation.navigate('Details', {key: i})
 }
  
  useEffect(() => {
    const getVelogFromBackend = async () => {
      const uploadEndpoint = 'http://' + global.address + ':5000/myvelogs';
      const requestData = {
        user_id: userData["user_id"],
        tags: [],
        sortby: "time",
        isdescending: true
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
        console.log("This is the data from showvelogs in the home screen")
        console.log(responseData)
        setPostlist(responseData.velogs_to_show)
        if (uploadResponse.ok) {
          console.log('These are my velogs');
        } else {
          console.error('Failed to get velog from backend:', uploadResponse.status, uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error getting Velogs :', error);
      }
    }
  
    getVelogFromBackend();
  
  }, []); // Provide an empty dependency array
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
          backgroundColor: 'black'
        }}>
        {

      

postlist.map((v, i) => {
  
  return(
    <TouchableOpacity style={styles.container} onPress={() => handleDetails(i)}>
    <View style={styles.headerContainer}>
      <View style={styles.headerUserContainer}>
          {/* <Avatar imgSource={item.author.thumbnail_image_url} size={40}/> */}

        {/* <Text style={styles.headerUsername}>hi</Text> */}
      </View>
    </View>
    {/* <Image 
      source={{uri: imagesInSection[i].images[0].content}}
      style={styles.postImage}
    /> */}
    {imagesInSection[i].images.length !== 0 &&
        <Image
          source={{ uri: imagesInSection[i].images[0].content }}
          style={styles.postImage}
        />
      }
    <View style={styles.actionContainer}>
    <View style={styles.headerContainer}>
      <View style={styles.headerUserContainer}>
          {/* <Avatar imgSource={{uri: userData["thumbnail_image_url"]}} size={40}/> */}
        <Text style={styles.headerUsername}>{userData["nickname"]}</Text>
      </View>
    </View>
      <View style={styles.actionLeftContainer}>
            <Entypo name="thumbs-up" size={20}   style={[
      styles.actionItem,
      { color: isLiked ? 'yellow' : 'white' },
    ]}/>  
      <Text style={styles.like}>100 likes</Text>
       
      </View>
    </View>
    <Text style={styles.postCreated}>{v.time}</Text>
  </TouchableOpacity>
  )
})
}
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
          backgroundColor:'black'
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
    tabBarOptions={{
      style: {
        backgroundColor: 'black', // Set the background color here
      }}}
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'black',
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          height: 1.5,
        },
        tabBarIcon: ({focused, colour}) => {
          let iconName;
          if (route.name === 'Code') {
            iconName = focused ? 'code' : 'code';
            colour = focused ? 'white' : 'yellow';
          } else if (route.name === "Gallery") {
            iconName = focused ? 'folder-images' : 'folder-images';
            colour = focused ? 'white' : 'yellow';
          }
           else {
            iconName = focused ? 'location' : 'location';
            colour = focused ? 'white' : 'yellow';
          }

          return <Entypo name={iconName} color={colour} size={22} />;
        },
      })}>
      <Tab.Screen name="Code" component={Code} style={{backgroundColor: 'black'}} />
      <Tab.Screen name="Gallery" component={Gallery} style={{backgroundColor: 'black'}}/>
      <Tab.Screen name="MyLocations" component={MyLocations} style={{backgroundColor: 'black'}}/>
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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  container: {
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: '50',
    backgroundColor: 'black'
  },
  headerUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUsername: {
    marginLeft: 6,
    color: 'white'
  },
  postImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.2 / 1,
    resizeMode: 'stretch',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  actionLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionContainerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionItem: {
    width: 25,
    height: 25,
    marginHorizontal: 10
  },
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  like: {
    fontWeight: 'bold',
    color: 'white'
  },
  username: {
    fontWeight: 'bold',
    color: 'white'
  },
  captionContainer: {
    marginTop: 3,
    color: 'white'
  },
  commentCount: {
    marginLeft: 20,
    marginTop: 10,
    color: '#606060',
  },
  postCreated: {
    marginLeft: 20,
    marginTop: 0,
    color: '#606060',
    marginBottom: 30
  }
});