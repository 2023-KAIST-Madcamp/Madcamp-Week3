import React, { Component } from 'react'
import { Text, View , StyleSheet, Image} from 'react-native'

export default function GalleryItem({item}) {

    return (
        <View style={styles.container}>
        
        <Image 
          source={item.imgSource}
          style={styles.postImage}
        />
        
      </View>
    )


}


const styles = StyleSheet.create({
    container: {
      backgroundColor: 'black'
    },
   
    postImage: {
      width: '30%',
      height: 100,
      aspectRatio: 1 / 1,
      resizeMode: 'stretch',
      
    },
    
  })
  