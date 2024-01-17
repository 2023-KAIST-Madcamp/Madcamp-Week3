import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import Avatar from './Avatar'
function Posts() {
  const navigation = useNavigation();
  const [postlist, setPostlist] = useState([])
  const { userData } = useData()
  console.log(userData["user_id"])

  const handleWrite = () => {
    navigation.navigate('NewPost')
  }

  const handleDetails = (i) => {
    navigation.navigate('Details', { key: i })
  }
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
        console.log("This is the data from showvelogs in the home screen")
        console.log(responseData)
        setPostlist(responseData.velogs_to_show)
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
  const imagesInSection = postlist.map(post => ({
    _id: post._id,
    images: post.sections.filter(section => section.type === "image")
  }));

  // console.log(imagesInSection)
  // console.log("This is the fetched image")
  // console.log(imagesInSection[0].images[0].content)
  const [isLiked, setIsLiked] = useState(false);

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
          <Entypo name="new-message" size={20} color={'white'} style={{ paddingBottom: 20, paddingTop: 20, paddingLeft: 275, backgroundColor: 'black' }} />
        </TouchableOpacity>
      </View>
      {



        postlist.map((v, i) => {

          return (
            <TouchableOpacity style={styles.container} onPress={() => handleDetails(v._id)}>
              <View style={styles.headerContainer}>
                <View style={styles.headerUserContainer}>
                  {/* <Avatar imgSource={item.author.thumbnail_image_url} size={40}/> */}

                  {/* <Text style={styles.headerUsername}>hi</Text> */}
                </View>
              </View>
              {imagesInSection[i].images.length !== 0 &&
                <Image
                  source={{ uri: imagesInSection[i].images[0].content }}
                  style={styles.postImage}
                />
              }
              <View style={styles.actionContainer}>
                <View style={styles.headerContainer}>
                  <View style={styles.headerUserContainer}>
                    <Avatar imgSource={v.author.thumbnail_image_url} size={40} />
                    <Text style={styles.headerUsername}>{v.author.nickname}</Text>
                  </View>
                </View>
                <View style={styles.actionLeftContainer}>
                  <Entypo name="thumbs-up" size={20} style={[
                    styles.actionItem,
                    { color: 'white' },
                  ]} />
                  <Text style={styles.like}>{v.thumbs} likes</Text>
                </View>
              </View>
              <Text style={styles.postCreated}>{v.time}</Text>
            </TouchableOpacity>
          )
        })
      }
    </ScrollView>
  );
}


export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
});