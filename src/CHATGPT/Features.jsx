/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image } from 'react-native'
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Features = () => {
  return (
    <View style={{height:hp(60)}} className='space-y-4'>
      <Text style={{fontSize:wp(7)}} className='font-semibold text-gray-700'>Features</Text>
      <View  style={{marginBottom:10 }} className='bg-emerald-400 p-4 rounded-3xl space-y-2'>
        <View className='flex-row items-center space-x-1'>
          <Image source={require('../../assets/CHATGPT.png')} style={{height:hp(5),width:hp(5)}}/>
          <Text style={{fontSize:wp(5.5)}} className='font-semibold text-gray-700 '> ChatGPT</Text>
        </View>
        <Text style={{fontSize:wp(4)}} className='text-gray-700 font-medium'>ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics.</Text>
      </View>

      <View style={{marginBottom:10 }} className='bg-cyan-400 p-5 rounded-3xl space-y-4'>
        <View className='flex-row items-center space-x-1'>
          <Image source={require('../../assets/dalle.jpg')} style={{height:hp(5),width:hp(5)}}/>
          <Text style={{fontSize:wp(5.5)}} className='font-semibold text-gray-700 '> DALL-E</Text>
        </View>
        <Text style={{fontSize:wp(4)}} className='text-gray-700 font-medium'>DALL-E can generate imaginative and diverse images form textual descriptions, expanding the boundaries of visual creativity.</Text>
      </View>

      <View className='bg-purple-400 p-4 rounded-3xl space-y-4'>
        <View className='flex-row items-center space-x-1'>
          <Image source={require('../../assets/smartai.jpg')} style={{height:hp(4),width:hp(4)}}/>
          <Text style={{fontSize:wp(5.5)}} className='font-semibold text-gray-700 '>Smart AI</Text>
        </View>
        <Text style={{fontSize:wp(4)}} className='text-gray-700 font-medium'>A powerful voices assistant with the abilities of ChatGPT and Dall-E, providing you the best of both worlds.</Text>
      </View>
    </View>
  )
}

export default Features;