import React from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import SearchBox from './SearchBox';
import { Entypo } from '@expo/vector-icons';

export default function SearchContent({props,  navigation}) {

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

  const handleCamera = () => {
    navigation.navigate('CameraApp')
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => handleCamera()}>
        <Entypo name="camera"  size={20} color={'white'} style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 275, backgroundColor: 'black'}} />
      </TouchableOpacity>
    <View>
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
