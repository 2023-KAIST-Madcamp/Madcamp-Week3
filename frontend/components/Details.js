import React, { Component, useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity , Image} from 'react-native'
import { useRoute } from '@react-navigation/native';

export default function Details() {
    const route = useRoute();
    const { key } = route.params;
    const [post, setPost] = useState()
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
  
    // Now you can use title and sections in your Details screen
    useEffect(() => {
        const getVelogFromBackend = async () => {
          const uploadEndpoint = 'http://' + global.address + ':5000/showvelogs';
          const requestData = {
            tags: [],
            sortby: "time",
            isdescending: true
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
            console.log(responseData.velogs_to_show[key])
            setPost(responseData.velogs_to_show[key])
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
    
    return (
        <ScrollView style={styles.container}>
        <Text style={styles.title}>{post.title}</Text>
         {post.sections.map((section, index) => (
          <Section key={index} type={section.type} content={section.content} />
        ))}
    </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      backgroundColor: 'white'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center'
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      marginBottom: 10,
    },
    content: {
      fontSize: 16,
      lineHeight: 24,
    },
  });