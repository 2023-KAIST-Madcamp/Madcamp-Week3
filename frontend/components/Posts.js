import { View, Text, StyleSheet , ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import PostItem from './PostItem';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';

function Posts() {
  const navigation = useNavigation();

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

  const handleWrite = () => {
    navigation.navigate('NewPost')
 }
  return (
    <ScrollView
    showsVerticalScrollIndicator={false}>
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        position: 'relative',
        backgroundColor: 'black'
      }}>
      <TouchableOpacity onPress={handleWrite}>
        <Entypo name="new-message"  size={20} color={'white'} style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 275, backgroundColor: 'black'}} />
      </TouchableOpacity>
    </View>
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