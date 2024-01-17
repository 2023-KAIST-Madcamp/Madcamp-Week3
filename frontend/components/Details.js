import React, { Component, useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import Entypo from 'react-native-vector-icons/Entypo'
import Avatar from './Avatar'

export default function Details() {
  const route = useRoute();
  const { key } = route.params;
  const [post, setPost] = useState()
  const { userData } = useData()
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedatFirst, setisLikedatFirst] = useState(false);
  console.log("this is key")
  console.log(key)

  const Section = ({ type, content }) => {
    switch (type) {
      case 'text':
        return <Text style={styles.content}>{content}</Text>;
      case 'image':
        return <Image source={{ uri: content }} style={styles.image} />;
      default:
        return null;
    }
  };

  const giveThumb = async () => {
    const uploadEndpoint = 'http://' + global.address + ':5000/givethumb';
    const requestData = {
      user_id: userData['user_id'],
      velog_id: key
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
      console.log(responseData.isthumbedup)
      if (uploadResponse.ok) {
        console.log('givethumb successfully');
        setIsLiked(responseData.isthumbedup)
        console.log(post.velog.thumbs)
      } else {
        console.error('Failed to givethumb from backend:', uploadResponse.status, uploadResponse.statusText);
      }
    } catch (error) {
      console.error('Error givethumb :', error);
    }
  }

  // Now you can use title and sections in your Details screen
  useEffect(() => {
    const getVelogFromBackend = async () => {
      const uploadEndpoint = 'http://' + global.address + ':5000/showvelog';
      const requestData = {
        user_id: userData['user_id'],
        velog_id: key
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
        setPost(responseData)
        setIsLiked(responseData.isthumbedup)
        setisLikedatFirst(responseData.isthumbedup)
        if (uploadResponse.ok) {
          console.log('Velog Fetched successfully');
        } else {
          console.error('Failed to get velog from backend:', uploadResponse.status, uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error getting Velogs :', error);
      }
    }

    getVelogFromBackend();

  }, []); // Provide an empty dependency array

  if (!post) {
    // You can render a loading indicator while waiting for the post state to be initialized
    return <Text>Loading...</Text>;
  }

  const handleThumbs = () => {
    giveThumb();
    // Add your logic for handling the like/unlike action here
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.velog.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Avatar imgSource={post.author.thumbnail_image_url} size={50} />
        <Text style={styles.nickname}>{post.author.nickname}</Text>
      </View>
      {post.velog.sections.map((section, index) => (
        <Section key={index} type={section.type} content={section.content} />
      ))}
      <TouchableOpacity onPress={handleThumbs}>
        <Entypo name="thumbs-up" size={30} style={[
          styles.actionItem,
          { color: isLiked ? 'yellow' : 'white' },
        ]} />
        <Text style={styles.like}>{post.velog.thumbs + (isLiked ? 1 : -1) * (isLiked == isLikedatFirst ? 0 : 1)} likes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    borderWidth: 1,
    backgroundColor: 'black'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 20,
    textAlign: 'center',
    color: 'white',
  },
  nickname: {
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 30,
    paddingBottom: 30,
    textAlign: 'center',
    color: 'white',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  profile: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
    marginBottom: 20,
  },
  like: {
    fontSize: 10,
    marginBottom: 50,
    color: 'white',
  },
});