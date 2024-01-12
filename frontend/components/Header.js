import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'

export default function Header() {

    return (
        <View style={styles.container}>
          <Image 
            source={require('../assets/devtoday_logo.png')}
            style={styles.logo}
          />
            <View style={styles.actionContainer}>
            <Entypo
                name="user"
                size={20}
                style={styles.actionItem}
              />
            </View>
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
      