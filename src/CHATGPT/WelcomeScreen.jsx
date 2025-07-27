/* eslint-disable react-native/no-inline-styles */
import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';


const WelcomeScreen = () => {
    const navigation=useNavigation();
  return (
    <SafeAreaView className='flex-1 justify-around bg-white'>
        <View className='space-y-2'>
            <Text style={{fontSize:wp(15)}} className='text-center font-bold text-gray-700'>Jarvis</Text>
            <Text style={{fontSize:wp(5)}} className='text-center tracking-wider text-gray-600 font-semibold'>
                The Future is here,powered by AI.</Text>

        </View>
        <View className='flex-row justify-center'>
            <Image source={require('../../assets/bot.png')} style={{width:wp(95) ,height:wp(95)}}/>

        </View>
        <TouchableOpacity onPress={()=> navigation.navigate("Home")}   className='bg-emerald-600 mx-5 p-5 rounded-3xl'>
            <Text style={{fontSize:wp(8)}}className='text-center font-bold text-white text-2xl' >Get Started</Text>
        </TouchableOpacity>

    </SafeAreaView>
    
    
  ) 
}

export default WelcomeScreen;