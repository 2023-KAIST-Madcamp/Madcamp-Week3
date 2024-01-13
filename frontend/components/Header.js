import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'

export default function Header({navigation}) {

  const handleClick = ()=> {
    navigation.navigate('Profile') 
  }

    return (
        <View style={styles.container}>
          <Image 
            source={require('../assets/devtoday_logo.png')}
            style={styles.logo}
          />
            <TouchableOpacity onPress={handleClick} style={styles.actionContainer}>
            <Entypo
                name="user"
                size={20}
                style={styles.actionItem}
              />
            </TouchableOpacity>
        </View>
      );
    }


    const styles = StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 50,
          paddingHorizontal: 20,
          backgroundColor: '#121212'
        },
        logo: {
          width: 120,
          height: 50,
          
        },
        actionContainer: {
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
        actionItem: {
          width: 27,
          height: 27,
          marginLeft: 160,
          color: '#F1EC40'
          
        }
      })
      