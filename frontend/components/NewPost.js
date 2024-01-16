import React, { Component, useState } from 'react'
import { Text, View , ScrollView, TouchableOpacity, StyleSheet} from 'react-native'
import { useData } from '../context/DataContext';
import Entypo from 'react-native-vector-icons/Entypo'

export default function NewPost({navigation}) {

    const [activeTab, setActiveTab] = useState(1);
    const { userData } = useData(); 
    const handleTabPress = (tabNumber) => {
        setActiveTab(tabNumber);
      };

      const addNewPost = () => {
        if (newPostTitle.trim() === '' ||
            newPostContent.trim() === '') {
            setError('Title and content cannot be empty');
            return;
        } else {
            setError('');
        }
 
        const id = posts.length + 1;
        const newPost =
        {
            id, title: newPostTitle,
            content: newPostContent
        };
        setPosts([...posts, newPost]);
        setNewPostTitle('');
        setNewPostContent('');
    };
      

    return (
        <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{flex: 1}}>
                        <View style={styles.tabsContainer}>
                    <TouchableOpacity
                    style={[styles.tab, activeTab === 1 && styles.activeTab]}
                    onPress={() => handleTabPress(1)}
                    >
                    <Entypo name="code" size={20} style={{color: 'yellow'}}/>        
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[styles.tab, activeTab === 2 && styles.activeTab]}
                    onPress={() => handleTabPress(2)}
                    >
                    <Entypo size={20} name="folder-images" style={{color: 'yellow'}}/>        
                    </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formContainer}>
                {error !== '' &&
                    <Text style={styles.errorText}>
                        {error}
                    </Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Enter Title"
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter Content"
                    value={newPostContent}
                    onChangeText={setNewPostContent}
                    multiline={true}
                />
                <Button title="Add New Post"
                    onPress={() => addNewPost()} />
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212'
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: '#121212',
  
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#121212'
    },
    activeTab: {
        backgroundColor: '#121212'
    },
    tabText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#E3E3E3'
    },
    contenttab: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white',
        
    },
    formContainer: {
      padding: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 20,
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
  },
  textArea: {
      height: 100,
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
      marginBottom: 10,
  },
  });