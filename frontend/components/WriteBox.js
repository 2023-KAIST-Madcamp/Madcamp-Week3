import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const WriteBox = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        position: 'relative',
        backgroundColor: 'black'
      }}>
      <TouchableOpacity>
        <Entypo name="new-message"  size={20} color={'white'} style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 275, backgroundColor: 'black'}} />
      </TouchableOpacity>
    </View>
  );
};

export default WriteBox;