/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from './Features';
import { dummyMessages } from './constant/index2';
import { PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Voice from '@react-native-voice/voice';

const HomeScreen = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [recording, setRecording] = useState(false); // Fixed typo: recoding -> recording
  const [speaking, setSpeaking] = useState(true);
  const [result, setResult] = useState('');

  const speechStartHandler = e => {
    console.log('Speech start handler');
  };
  
  const speechEndHandler = e => {
    setRecording(false);
    console.log('Speech end handler');
  };
  
  const speechResultsHandler = e => {
    console.log('Voice event:', e);
    const text = e.value[0];
    setResult(text);
  };

  const speechErrorHandler = e => {
    console.log('speech error handler', e);
    setRecording(false); // Stop recording on error
  };

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      // Check permissions first
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Microphone permission is required for voice recording.');
        return;
      }

      // Check if Voice is available before starting
      const isAvailable = await Voice.isAvailable();
      if (!isAvailable) {
        Alert.alert('Error', 'Voice recognition is not available on this device');
        return;
      }

      // Stop any existing recording first
      try {
        await Voice.stop();
        await Voice.cancel();
      } catch (e) {
        // Ignore errors from stopping non-existent recording
      }

      setRecording(true);
      console.log("Recording started...");
      
      // Clear previous result
      setResult('');
      
      // Add a small delay before starting
      setTimeout(async () => {
        try {
          await Voice.start('en-US');
        } catch (error) {
          console.log('Voice start error:', error);
          setRecording(false);
          Alert.alert('Error', 'Failed to start voice recording: ' + error.message);
        }
      }, 100);
      
    } catch (error) {
      console.log('Start recording error:', error);
      setRecording(false);
      Alert.alert('Error', 'Failed to start voice recording: ' + error.message);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      console.log("Recording stopped");
    } catch (error) {
      console.log('Stop recording error:', error);
      setRecording(false);
    }
  };

  const clear = () => {
    setMessages([]);
    setResult('');
  };

  const stopSpeaking = () => {
    setSpeaking(false);
    // If you're using TTS, stop it here
    // Tts.stop(); // Uncomment if using react-native-tts
  };

  useEffect(() => {
    // Initialize Voice with proper setup
    const initializeVoice = async () => {
      try {
        // Check if Voice is available
        const isAvailable = await Voice.isAvailable();
        console.log('Voice available:', isAvailable);
        
        if (isAvailable) {
          // Set up event handlers
          Voice.onSpeechStart = speechStartHandler;
          Voice.onSpeechEnd = speechEndHandler;
          Voice.onSpeechResults = speechResultsHandler;
          Voice.onSpeechError = speechErrorHandler;
        } else {
          console.log('Voice recognition not available on this device');
          Alert.alert('Error', 'Voice recognition is not available on this device');
        }
      } catch (error) {
        console.log('Voice initialization error:', error);
      }
    };

    initializeVoice();

    return () => {
      // Cleanup
      Voice.destroy().then(() => {
        Voice.removeAllListeners();
      }).catch(error => {
        console.log('Cleanup error:', error);
      });
    };
  }, []);

  // Add result to messages when speech recognition completes
  useEffect(() => {
    if (result && result.trim()) {
      const newMessage = { role: 'user', content: result };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setResult(''); // Clear result after adding to messages
    }
  }, [result]);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* Bot Image */}
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/bot.png')}
            style={{ height: hp(25), width: hp(25) }}
          />
        </View>

        {/* Messages or Features */}
        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text
              style={{ fontSize: wp(7) }}
              className="text-gray-700 font-semibold ml-1"
            >
              Assistant
            </Text>
            <View
              style={{ height: hp(54), borderRadius: 20 }}
              className="bg-neutral-200 rounded-3xl p-4"
            >
              <ScrollView
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content.includes('https')) {
                      // AI image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="p-1 flex rounded-2xl bg-emerald-200 rounded-tl-none">
                            <Image
                              source={{ uri: message.content }}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{ height: wp(75), width: wp(97) }}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      // Text response
                      return (
                        <View
                          key={index}
                          style={{ width: wp(70), marginBottom: 15 }}
                          className="bg-emerald-200 rounded-xl p-2 rounded-tl-none"
                        >
                          <Text>{message.content}</Text>
                        </View>
                      );
                    }
                  } else {
                    // User input
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{
                            maxWidth: wp(70),
                            marginBottom: 15,
                            borderRadius: 20,
                          }}
                          className="bg-white rounded-3xl p-2 rounded-tr-none"
                        >
                          <Text>{message.content}</Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        {/* Recording, Clear and Stop buttons */}
        <View className="flex justify-center items-center">
          {recording ? (
            <TouchableOpacity onPress={stopRecording}> {/* Fixed: onClick -> onPress */}
              <Image
                className="rounded-full"
                source={require('../../assets/animation.gif')}
                style={{ width: hp(10), height: hp(10), marginBottom: 29 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              <Image
                className="rounded-full"
                source={require('../../assets/voice-record.png')}
                style={{ width: hp(9), height: hp(9), marginBottom: 30 }}
              />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-3xl p-4 absolute right-10"
            >
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}

          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-500 rounded-3xl p-4 absolute left-10"
            >
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;