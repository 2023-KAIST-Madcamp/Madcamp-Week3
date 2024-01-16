import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo'
import Avatar from './Avatar'

function PostItem({item}) {
  return (
    <View style={styles.container}>
      {/* <View style={styles.headerContainer}>
        <View style={styles.headerUserContainer}>
            <Avatar imgSource={item.user.imgSource} size={40}/>

          <Text style={styles.headerUsername}>{item.user.username}</Text>
        </View>
      </View> */}
      <Image 
        source={item.imgSource}
        style={styles.postImage}
      />
      <View style={styles.actionContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerUserContainer}>
            <Avatar imgSource={item.user.imgSource} size={40}/>
          <Text style={styles.headerUsername}>{item.user.username}</Text>
        </View>
      </View>
        <View style={styles.actionLeftContainer}>
            
        <Entypo name="heart" size={20}  style={[styles.actionItem, {color: 'red'}]}/>  
        <Text style={styles.like}>100 likes</Text>
         
        </View>
      </View>
      <Text style={styles.postCreated}>4 days ago</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: '50'
  },
  headerUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUsername: {
    marginLeft: 6,
    color: 'white'
  },
  postImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.2 / 1,
    resizeMode: 'stretch',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  actionLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionContainerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionItem: {
    width: 25,
    height: 25,
    marginHorizontal: 10
  },
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  like: {
    fontWeight: 'bold',
    color: 'white'
  },
  username: {
    fontWeight: 'bold',
    color: 'white'
  },
  captionContainer: {
    marginTop: 3,
    color: 'white'
  },
  commentCount: {
    marginLeft: 20,
    marginTop: 10,
    color: '#606060',
  },
  postCreated: {
    marginLeft: 20,
    marginTop: 0,
    color: '#606060',
    marginBottom: 30
  }
})

export default PostItem;