import React, {useEffect,useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'
import { useData } from '../context/DataContext';

const BottomTabView = () => {
  const Tab = createMaterialTopTabNavigator();
  const [todayimage, setTodayimage] = useState([])
  const {userData} = useData()

  useEffect(() => {
    const getImageFromBackend = async () => {
      const uploadEndpoint = 'http://192.249.31.81:5000/mytodays';
      const requestData = {
        user_id: userData["user_id"]
      };
      console.log("mytodays 들어옴")
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
        <View>
            {todayimage.map((data, index) => {
              return (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <TouchableOpacity
                      key={data._id}
                      style={{ paddingBottom: 2, width: '33%' }}>
                      <Image
                        source={{ uri: `data:image/png;base64,${data.image}`}}
                        style={{ width: '100%', height: 150 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    );
  };
  // const Tags = () => {
  //   return (
  //     <ScrollView
  //       showsVerticalScrollIndicator={false}
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //       }}>
  //       <View
  //         style={{
  //           width: '100%',
  //           height: '100%',
  //           backgroundColor: 'black',
  //           flexWrap: 'wrap',
  //           flexDirection: 'row',
  //           paddingVertical: 5,
  //           justifyContent: 'space-between',
  //         }}>
  //         {squares}
  //       </View>
  //     </ScrollView>
  //   );
  // };

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
          if (route.name === 'Posts') {
            iconName = focused ? 'code' : 'code';
            colour = focused ? 'black' : 'gray';
          } else {
            iconName = focused ? 'folder-images' : 'folder-images';
            colour = focused ? 'black' : 'gray';
          }
            // } else if (route.name === 'Tags') {
          //   iconName = focused ? 'ios-person' : 'ios-person-outline';
          //   colour = focused ? 'black' : 'gray';
          // }

          return <Entypo name={iconName} color={colour} size={22} />;
        },
      })}>
      <Tab.Screen name="Code" component={Code} />
      <Tab.Screen name="Gallery" component={Gallery} />
      {/* <Tab.Screen name="Tags" component={Tags} /> */}
    </Tab.Navigator>
  );
};

export default BottomTabView;