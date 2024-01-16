import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useData } from '../context/DataContext';

const BlogEditor = () => {
  const [blogTitle, setBlogTitle] = useState('');
  const [textInputs, setTextInputs] = useState([]);
  const [images, setImages] = useState([]); // State to store image URIs
  const [sections, setSections] = useState([])
  const [posts, setPosts] = useState([])
  const {userData} = useData()

  const addTextInput = () => {
    const newTextInputs = [...textInputs, ''];
    setTextInputs(newTextInputs);

    const newTextSection = {
      type: 'text',
      content: '', // You can set the default content to an empty string or whatever you prefer
    };

    setSections([...sections, newTextSection]);
  };
  // console.log("This is the sections array")
  // console.log(sections)

  const handleTextChange = (index, newText) => {
    const updatedSections = [...sections];
    updatedSections[index].content = newText;
    setSections(updatedSections);
  };
  // console.log("This is the images array")
  // console.log(images)

const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {

      console.error('Permission to access media library was denied');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    // console.log(result);
    const base64Image = await FileSystem.readAsStringAsync(result.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  
    if (!result.canceled) {
      const newImages = [...images, base64Image];
      setImages(newImages);

      const newImageSection = {
        type: 'image',
        content: base64Image,
      };

      setSections([...sections, newImageSection]);
    }
  };

  const sendToBackend = async() => {
    const newPost = {
      user_id: userData["user_id"],
      tags: [],
      title: blogTitle,
      sections: sections,
    };
    const uploadEndpoint = 'http://' + global.address + ':5000/createvelog';

    try {
      const uploadResponse = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      const responseData = await uploadResponse.json(); // Parse JSON response
      // setBitimage(responseData.uri); // Assuming setBitimage is a function that sets the image URI
    
      if (uploadResponse.ok) {
        console.log('Image uploaded successfully');
      } else {
        console.error('Failed to upload image:', uploadResponse.status, uploadResponse.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    // Optional: You can clear the form after submitting
    setBlogTitle('');
    setTextInputs([]);
    setImages([]);
    setSections([]);
  }
  // console.log("This is the posts")
  // console.log(posts)
  const Section = ({key, type, content }) => {
    switch (type) {
      case 'text':
        return (         
        <View key={key}>
        <TextInput
          value={content}
          onChangeText={(newText) => handleTextChange(key, newText)}
        />
      </View>
        )
      case 'image':
        return <Image source={{ uri: content }} style={styles.image} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Enter Blog Title"
        value={blogTitle}
        onChangeText={setBlogTitle}
      />

      {sections.map((text, index) => (
        <View key={index}>
          <TextInput
            style={styles.textInput}
            placeholder={`Enter Text ${index + 1}`}
            value={text}
            onChangeText={(newText) => handleTextChange(index, newText)}
          />
        </View>
      ))}
      {/* {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))} */}
      <Text>PREVIEW</Text>
       {sections.map((section, index) => (
        <Section key={index} type={section.type} content={section.content} />
      ))}
    <View style={styles.buttonContainer}>
      <Button title="Add Text" onPress={addTextInput} />
      <Button title="Add Image" onPress={pickImage} />
      <Button title="Submit Blog" onPress={sendToBackend} />
    </View>

  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd', // Border color
    borderRadius: 10, // Border radius
    padding: 10,
    marginBottom: 10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default BlogEditor;