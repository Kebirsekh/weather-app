import { View, Text } from 'react-native';

import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from './src/CHATGPT/HomeScreen';
import WelcomeScreen from './src/CHATGPT/WelcomeScreen';
import './global.css';



const Stack=createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer  >
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Welcome'>
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen name='Welcome'component={WelcomeScreen}/>

        
        
      </Stack.Navigator>
      

    </NavigationContainer>
    
    
  )
}

export default App;