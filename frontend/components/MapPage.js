import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapPage({navigation}) {
    return (
        <View style={styles.mapcontainer}>
            <MapView style={styles.map}
             />
            </View>
    )
}
const styles = StyleSheet.create({
    mapcontainer: {
        backgroundColor: 'white'
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });