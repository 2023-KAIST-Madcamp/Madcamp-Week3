// In App.js in a new project
import { DataProvider } from './context/DataContext';
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraApp from './components/CameraApp'
import Login from './components/Login';
import Home from './components/Home';
import Map from './components/MapPage';
import Profile from './components/Profile';
import Header from './components/Header';
import NewPost from './components/NewPost';
import Posts from './components/Posts';
import Details from './components/Details';
import BottomTabView from './components/BottomTabView';
import FriendsList from './components/FriendsList';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <DataProvider>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name = "Login" component={Login} options={{ headerShown: false }}/>
          <Stack.Screen name = "CameraApp" component={CameraApp} options={{ headerShown: false }}/>
          <Stack.Screen name = "Home" component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name = "Map" component={Map} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name = "Header" component={Header} options={{ headerShown: false }}/>
          <Stack.Screen name="NewPost" component={NewPost} />
          <Stack.Screen name="Posts" component={Posts} />
          <Stack.Screen name="Details" component={Details} options={{ headerShown: false }} />
          <Stack.Screen name="BottomTabView" component={BottomTabView} />
          <Stack.Screen name="FriendsList" component={FriendsList} />


        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}

export default App;