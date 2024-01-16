import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import React from 'react';
import GalleryItem from './GalleryItem';

export default function Gallery() {
  const GalleryList = [
    {
      imgSource: require('../assets/blog1.png'),
      caption: 'Grateful for this beautiful life and the amazing people in it.',
      user: {
        imgSource: 'http://k.kakaocdn.net/dn/cXX1XZ/btrKzgMeyWQ/Q3hKcvlZ6oPaKK9CSIj3u1/img_640x640.jpg',
        username: 'Shopia',
        isOwn: false,
        isHasStory: true
      },
    },
    {
      imgSource: require('../assets/blog2.png'),
      caption: 'Grateful for this beautiful life and the amazing people in it.',
      user: {
        imgSource: 'http://k.kakaocdn.net/dn/cXX1XZ/btrKzgMeyWQ/Q3hKcvlZ6oPaKK9CSIj3u1/img_640x640.jpg',
        username: 'Alexander',
        isOwn: false,
        isHasStory: true
      },
    },
    {
      imgSource: require('../assets/blog3.png'),
      caption: 'Grateful for this beautiful life and the amazing people in it.',
      user: {
        imgSource: 'http://k.kakaocdn.net/dn/cXX1XZ/btrKzgMeyWQ/Q3hKcvlZ6oPaKK9CSIj3u1/img_640x640.jpg',
        username: 'Shopia',
        isOwn: false,
        isHasStory: true
      },
    },    {
        imgSource: require('../assets/blog3.png'),
        caption: 'Grateful for this beautiful life and the amazing people in it.',
        user: {
          imgSource: 'http://k.kakaocdn.net/dn/cXX1XZ/btrKzgMeyWQ/Q3hKcvlZ6oPaKK9CSIj3u1/img_640x640.jpg',
          username: 'Shopia',
          isOwn: false,
          isHasStory: true
        },
      }
  ]
  return (
    <ScrollView
    showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
    <View style={styles.gridContainer}>
      {GalleryList.map((item, index) => (
        <GalleryItem key={index} item={item} />
      ))}
    </View>
  </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
      },
      gridContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        overflow: 'visible'
        
      },
})

