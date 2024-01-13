import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet} from 'react-native';
import SearchBox from './SearchBox';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useData } from '../context/DataContext';
import * as FileSystem from 'expo-file-system';

export default function SearchContent(props) {
  const [image, setImage] = useState(null);
  const { userData } = useData(); // Get setUserData from context
  const [bitimage, setBitimage] = useState(0)
 
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

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      sendImageToBackend(result);
    }
  };

  const sendImageToBackend = async (result) => {
    // Your Flask backend endpoint for handling image uploads
    const uploadEndpoint = 'http://143.248.192.190:5000/createtoday';
  
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
  const searchData = [
    {
      id: 0,
      images: [
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
      ],
    },
    {
      id: 1,
      images: [
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
      ],
    },
    {
      id: 2,
      images: [
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
        require('../assets/test1.jpg'),
      ],
    },
  ];

  // const handleCamera = () => {
  //   navigation.navigate('CameraApp')
  // }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={pickImage}>
        <Entypo name="camera"  size={20} color={'white'} style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 275, backgroundColor: 'black'}} />
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
                {data.images.map((imageData, imgIndex) => {
                  return (
                    <TouchableOpacity
                      key={imgIndex}
                      onPressIn={() => props.data(imageData)}
                      onPressOut={() => props.data(null)}
                      style={{paddingBottom: 2,width:'33%'}}>
                      <Image
                        source={imageData}
                        style={{width: '100%', height: 150}}
                      />
                    </TouchableOpacity>
                  );
                })}
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