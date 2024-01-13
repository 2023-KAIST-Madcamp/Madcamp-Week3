import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import SearchBox from './SearchBox';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


export default function SearchContent({props,  navigation}) {
  const [image, setImage] = useState(null);

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
    const uploadEndpoint = 'https://143.248.192.190/createvelog';
  
    // Convert the picked image URI to a Blob
    const response = await fetch(result.uri);
    const blob = await response.blob();
  
    // Create FormData and append the Blob
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
  
    try {
      // Send a POST request to the Flask backend
      const uploadResponse = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });
  
      // Handle the response from the backend
      if (uploadResponse.ok) {
        console.log('Image uploaded successfully');
        // You can handle further actions here, such as updating UI or navigating to another screen
      } else {
        console.error('Failed to upload image');
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
