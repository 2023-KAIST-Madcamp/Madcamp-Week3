import { View, Text, StyleSheet , ScrollView, TouchableOpacity, Image} from 'react-native';
import React , {useState, useEffect} from 'react';
import PostItem from './PostItem';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';

function Posts() {
  const navigation = useNavigation();
  const [postlist, setPostlist] = useState([])

  // const postList = [
  //   {
  //     imgSource: require('../assets/blog1.png'),
  //     caption: 'Grateful for this beautiful life and the amazing people in it.',
  //     user: {
  //       imgSource: 'http://k.kakaocdn.net/dn/cXX1XZ/btrKzgMeyWQ/Q3hKcvlZ6oPaKK9CSIj3u1/img_640x640.jpg',
  //       username: 'Shopia',
  //       isOwn: false,
  //       isHasStory: true
  //     },
  //   },
  //   {
  //     imgSource: require('../assets/blog2.png'),
  //     caption: 'Grateful for this beautiful life and the amazing people in it.',
  //     user: {
  //       imgSource: 'http://k.kakaocdn.net/dn/cXX1XZ/btrKzgMeyWQ/Q3hKcvlZ6oPaKK9CSIj3u1/img_640x640.jpg',
  //       username: 'Alexander',
  //       isOwn: false,
  //       isHasStory: true
  //     },
  //   },
  //   {
  //     imgSource: require('../assets/blog3.png'),
  //     caption: 'Grateful for this beautiful life and the amazing people in it.',
  //     user: {
  //       imgSource: 'http://k.kakaocdn.net/dn/cXX1XZ/btrKzgMeyWQ/Q3hKcvlZ6oPaKK9CSIj3u1/img_640x640.jpg',
  //       username: 'Shopia',
  //       isOwn: false,
  //       isHasStory: true
  //     },
  //   }
  // ]

  const handleWrite = () => {
    navigation.navigate('NewPost')
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
      setPostlist(responseData.velogs_to_show)
      console.log(responseData)
      console.log(responseData.velogs_to_show)
      if (uploadResponse.ok) {
        console.log('Velog Fetched successfully');
      } else {
        console.error('Failed to get velog from backend:', uploadResponse.status, uploadResponse.statusText);
      }
    } catch (error) {
      console.error('Error getting velog:', error);
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
        postlist.map((v, i) => {
          return(
            // <PostItem key={i} item={v}/>
            <ScrollView style={styles.container}>
            <Text style={styles.title}>{v.title}</Text>
            {v.sections.map((section, index) => (
              <Section key={index} type={section.type} content={section.content} />
            ))}
          </ScrollView>

          )
        })
      }
    </View>
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
});