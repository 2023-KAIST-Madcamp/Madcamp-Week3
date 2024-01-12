import { View, Text, StyleSheet , ScrollView} from 'react-native';
import React from 'react';
import PostItem from './PostItem';
import SearchBox from './SearchBox';

function Posts() {
  const postList = [
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
    }
  ]
  return (
    <ScrollView
    showsVerticalScrollIndicator={false}>
        <SearchBox />
    <View style={styles.container}>
      {
        postList.map((v, i) => {
          return(
            <PostItem key={i} item={v}/>
          )
        })
      }
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
  }
})

export default Posts;