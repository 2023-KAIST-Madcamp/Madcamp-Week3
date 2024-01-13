import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapPage() {
    return (
        <View style={styles.mapcontainer}>
            <MapView style={styles.map}
              initialRegion={{
                latitude: 36.3721,
                longitude: 127.3604,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
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