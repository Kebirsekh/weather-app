import { View, Text } from 'react-native'
import React from 'react'
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/WEATHERAPP/SCREEN/HomeScreen';
 import { LogBox } from 'react-native';


const Stack=createNativeStackNavigator();

LogBox.ignoreLogs([
   'Non-serializable value were found in the navigation state'
 ]);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='HomeScreen' options={{headerShown:false}} component={HomeScreen}/>
      </Stack.Navigator>

    </NavigationContainer>
   
   
  )
}

export default App;