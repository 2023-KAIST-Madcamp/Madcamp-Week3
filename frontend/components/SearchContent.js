import React from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';

const SearchContent = props => {
  const searchData = [
    {
      id: 0,
      images: [
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
      ],
    },
    {
      id: 1,
      images: [
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
      ],
    },
    {
      id: 2,
      images: [
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
        require('../assets/tiger2.jpg'),
      ],
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
export default SearchContent;