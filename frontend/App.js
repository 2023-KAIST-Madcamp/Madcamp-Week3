// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraApp from './components/CameraApp'
import Login from './components/Login';

const Stack = createNativeStackNavigator();


function App() {
  return (
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name = "Login" component={Login} options={{ headerShown: false }}/>
          <Stack.Screen name = "CameraApp" component={CameraApp} options={{ headerShown: false }}/>


        </Stack.Navigator>
      </NavigationContainer>

  );
}

export default App;