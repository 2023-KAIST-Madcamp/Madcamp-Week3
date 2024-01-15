import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet} from 'react-native';
import SearchBox from './SearchBox';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useData } from '../context/DataContext';
import * as FileSystem from 'expo-file-system';
import {Camera} from 'expo-camera'
import * as MediaLibray from 'expo-media-library'
import * as Location from 'expo-location';


export default function SearchContent(props) {
  const [image, setImage] = useState(null);
  const { userData } = useData(); // Get setUserData from context
  const [bitimage, setBitimage] = useState(0)
  const [todayimage, setTodayimage] = useState([])

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationText, setLocationText] = useState(null)

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      setLocation(location);
      
    })();
  }, []);


 
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access media library was denied');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      sendImageToBackend(result);
    }
  };

  const takePhoto = async() => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access camera was denied');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      sendImageToBackend(result);
    }
  }

  const sendImageToBackend = async (result) => {
    // Your Flask backend endpoint for handling image uploads
    const uploadEndpoint = 'http://143.248.192.190:5000/createtoday';
    let text = ""
    text = JSON.stringify(location.coords.latitude + ', ' + location.coords.longitude);
    console.log(text)
    setLocationText(text)
  
    // const blob = await response.blob();
      // Read the image file as base64
      const base64Image = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // console.log("This is the result.assets")
      // Create an object with the necessary data
      const requestData = {

          image: base64Image,
          location: ' , ',
          user_id: userData["user_id"],
          location: locationText
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
      setBitimage(responseData.uri); // Assuming setBitimage is a function that sets the image URI
    
      if (uploadResponse.ok) {
        console.log('Image uploaded successfully');
      } else {
        console.error('Failed to upload image:', uploadResponse.status, uploadResponse.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    const getImageFromBackend = async () => {
      const uploadEndpoint = 'http://192.249.31.81:5000/showtodays';
  
      try {
        const uploadResponse = await fetch(uploadEndpoint);
        const responseData = await uploadResponse.json(); // Parse JSON response
        console.log(responseData)
        console.log(responseData)
        console.log(typeof(responseData))
        setTodayimage(responseData.todays_to_show)
  
        if (uploadResponse.ok) {
          console.log('Image Fetched successfully');
        } else {
          console.error('Failed to get image from backend:', uploadResponse.status, uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error getting image:', error);
      }
    }
  
    getImageFromBackend(); // Call the function inside useEffect
  
  }, []); // Provide an empty dependency array

  const searchData = [
    {
      id: 0,
      images: [
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        // require('../assets/test1.jpg'),
        // require('../assets/test1.jpg'),
        // require('../assets/test1.jpg'),
        // require('../assets/test1.jpg'),
      ],
    },
    // {
    //   id: 1,
    //   images: [
    //     require('../assets/test1.jpg'),
    //     require('../assets/test1.jpg'),
    //     require('../assets/test1.jpg'),
    //     require('../assets/test1.jpg'),
    //     require('../assets/test1.jpg'),
    //     require('../assets/test1.jpg'),
    //   ],
    // },
    // {
    //   id: 2,
    //   images: [
    //     require('../assets/test1.jpg'),
    //     require('../assets/test1.jpg'),
    //     require('../assets/test1.jpg'),
    //   ],
    // },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={takePhoto}>
        <Entypo name="camera"  size={20} color={'white'} style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 275, backgroundColor: 'black'}} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage}>
        <Entypo name="folder-images"  size={20} color={'white'} style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 275, backgroundColor: 'black'}} />
      </TouchableOpacity>
    <View>
    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    {/* <View style={styles.container}>
          <Image 
            style={styles.image}
            source={{uri: `data:image/png;base64,${bitimage}`}} />
      </View> */}

      {searchData.map((data, index) => {
        return (
          <View key={index}>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  width:'100%'
                }}>
                {/* {data.images.map((imageData, imgIndex) => {
                  return (
                    <TouchableOpacity
                      key={data._id}
                      style={{ paddingBottom: 2, width: '33%' }}>
                      <Image
                        source={{ uri: `data:image/png;base64,${data.image}`}}
                        style={{ width: '100%', height: 150 }}
                      />
                    </TouchableOpacity>
                  );
                })} */}
              </View>
            
          </View>
        );
      })}
    </View>
    <View>
    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    {/* <View style={styles.container}>
          <Image 
            style={styles.image}
            source={{uri: `data:image/png;base64,${bitimage}`}} />
      </View> */}

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
                        source={{ uri: `data:image/png;base64,${data.image}` }}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 200,
  },
});