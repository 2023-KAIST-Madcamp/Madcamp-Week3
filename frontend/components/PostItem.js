import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo'
import Avatar from './Avatar'

function PostItem({item, key}) {
  console.log("This is what the post item looks likes")
  console.log(item)
  console.log(item.sections)
  // console.log(item.author.thumbnail_image_url)
  const imagesInSection = item.sections.filter(section => section.type === 'image');

  

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerUserContainer}>
            {/* <Avatar imgSource={item.author.thumbnail_image_url} size={40}/> */}

          {/* <Text style={styles.headerUsername}>hi</Text> */}
        </View>
      </View>
      <Image 
        source={{uri: imagesInSection[0].content}}
        style={styles.postImage}
      />
      <View style={styles.actionContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerUserContainer}>
            <Avatar imgSource={item.author.thumbnail_image_url} size={40}/>
          <Text style={styles.headerUsername}>{item.author.nickname}</Text>
        </View>
      </View>
        <View style={styles.actionLeftContainer}>
            
        <Entypo name="thumbs-up" size={20}  style={[styles.actionItem, {color: 'white'}]}/>  
        <Text style={styles.like}>100 likes</Text>
         
        </View>
      </View>
      <Text style={styles.postCreated}>4 days ago</Text>
    </TouchableOpacity>
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