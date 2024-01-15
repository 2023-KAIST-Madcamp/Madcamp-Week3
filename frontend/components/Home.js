import React, { Component, useState, useEffect } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import  Header  from './Header'
import MapPage from './MapPage'
import { Entypo } from '@expo/vector-icons';
import Posts from './Posts'
import SearchContent from './SearchContent'
import { useData } from '../context/DataContext'

export default function Home({navigation}) {
  const [activeTab, setActiveTab] = useState(1);
  const [image, setImage] = useState(null);
  const { userData } = useData(); 

  const getData = data => {
    setImage(data);
  };

  console.log("This is the user data")
  console.log(userData)
  console.log(userData["thumbnail_image_url"])

  const handleTabPress = (tabNumber) => {
    setActiveTab(tabNumber);
  };
    return (
      <View style={{flex: 1}}>
        <Header navigation={navigation}/>      
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
        <TouchableOpacity
          style={[styles.tab, activeTab === 3 && styles.activeTab]}
          onPress={() => handleTabPress(3)}
        >
        <Entypo size={20} name="location" style={{color: 'yellow'}}/>        
        </TouchableOpacity>
      </View>
                {/* <Stories /> */}
                {activeTab === 1 && <Posts />}
                {activeTab === 2 && <SearchContent data={getData} navigation={navigation} />}
                {activeTab === 3 && <MapPage />}
            </View>
      </View>
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
      
  }
});