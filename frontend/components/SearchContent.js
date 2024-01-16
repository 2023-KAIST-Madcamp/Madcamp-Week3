import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useData } from '../context/DataContext';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import './global';


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
    const uploadEndpoint = 'http://' + global.address + ':5000/createtoday';
    let locationArray = []
    locationArray.push(location.coords.latitude)
    locationArray.push(location.coords.longitude)
    console.log(locationArray)
  
    // const blob = await response.blob();
      // Read the image file as base64
      const base64Image = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // console.log("This is the result.assets")
      // Create an object with the necessary data
      const requestData = {

          image: base64Image,
          user_id: userData["user_id"],
          location: locationArray
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
      const uploadEndpoint = 'http://' + global.address + ':5000/showtodays';
  
      try {
        const uploadResponse = await fetch(uploadEndpoint)
        const responseData = await uploadResponse.json(); // Parse JSON response
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
  
    getImageFromBackend();
  
  }, []); // Provide an empty dependency array

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <Entypo name="camera" size={20} color={'white'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Entypo name="folder-images" size={20} color={'white'}/>
        </TouchableOpacity>
      </View>
      
      {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10 }}>
    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
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

                    <TouchableOpacity
                      key={data._id}
                      style={{ paddingBottom: 2, width: '50%' }}>
                      <Image
                        source={{ uri : data.image }}
                        style={{ width: '100%', height: 200 }}
                      />
                    </TouchableOpacity>
                  // </View>
              );
            })}
        </View>
    {/* </View> */}

    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  image: {
    height: 200,
    width: 200,
  },
});