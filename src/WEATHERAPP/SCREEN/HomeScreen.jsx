
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { theme } from '../Theme';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import {
  fetchLocations,
  fetchWeatherForecast,
} from '../API/Weather';
import { weatherImages } from '../Contain/DemoContain';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../API/asyncStorage';

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = loc => {
    // console.log('location', loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: 7,
    }).then(data => {
      setWeather(data);
      setLoading(false);
      storeData('city',loc.name)
      // console.log('got location:', data);
    });
  };

  const handleSearch = value => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then(data => {
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity=await getData('city');
    let cityName='KOLKATA';
    if(myCity) cityName=myCity;
    fetchWeatherForecast({
      cityName,
      days: 7,
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 800), []);

  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" />
      <Image
        blurRadius={65}
        source={require('../../../assets/bg.png')}
        className="absolute h-full w-full"
      />

      {loading ? (
        <View className="flex-1 flex-row items-center justify-center">
          <Text className="text-white text-4xl">Loading...</Text>
          <Progress.CircleSnail thickness={8} size={120} color={['#0bb3b2']} />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          {/* Search */}
          <View style={{ height: '8%' }} className="mx-4 relative z-50 top-12">
            <View
              className="flex-row justify-end items-center rounded-3xl"
              style={{
                backgroundColor: showSearch ? theme.bgWhite(0.3) : 'transparent',
              }}
            >
              {showSearch && (
                <TextInput
                 style={{ 
                    fontSize: 23, 
                     borderRadius: 30,      
                    paddingHorizontal: 20,   
                   }}
                  onChangeText={handleTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor={'lightgray'}
                  className="pl-7 h-16 px-2 flex-1 text-base text-white"
                />
              )}

              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{ backgroundColor: theme.bgWhite(0.4) }}
                className="rounded-full p-3 m-2"
              >
                <MagnifyingGlassIcon size={'25'} color={'white'} />
              </TouchableOpacity>
            </View>

            {locations.length > 0 && showSearch && (
              <View className="absolute w-full bg-gray-300 top-20 rounded-3xl">
                {locations.map((loc, index) => {
                  const showBorder = index + 1 !== locations.length;
                  const borderClass = showBorder
                    ? 'border-b-4 border-b-gray-400'
                    : '';
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      className={
                        'flex-row items-center border-0 p-2 px-5 mb-1 ' + borderClass
                      }
                    >
                      <MapPinIcon size="25" color="green" />
                      <Text
                        className="text-black text-lg ml-2"
                        style={{ fontSize: 22, margin: 4 }}
                      >
                        {loc?.name}  , {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Weather Info */}
          <View className="mx-4 flex justify-center flex-1 mb-1">
            {location?.name && (
              <Text className="text-white text-center text-3xl font-bold mb-20">
                {location?.name},
                <Text className="text-xl font-semibold text-gray-300">
                  {' ' + location?.country}
                </Text>
              </Text>
            )}

            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text] ||
                   require('../../../assets/sun.png') ||
                   require('../../../assets/partlycloudy.png')||
                   require('../../../assets/moderaterain.png') ||
                    require('../../../assets/heavyrain.png')||
                    require('../../../assets/cloud.png')
                }
                className="w-52 h-52"
              />
            </View>

            <View className="space-y-3 top-7">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>

            <View className="flex-row justify-between mx-4 top-32">
              <View className="flex-row space-x-3 items-center">
                <Image
                  source={require('../../../assets/wind.png')}
                  className="h-10 w-10"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph} km/h
                </Text>
              </View>
              <View className="flex-row space-x-3 items-center">
                <Image
                  source={require('../../../assets/drop.png')}
                  className="h-10 w-10"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-3 items-center">
                <Image
                  source={require('../../../assets/sun.png')}
                  className="h-10 w-10"
                />
                <Text className="text-white font-semibold text-base">
                  {weather?.forecast?.forecastday?.[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>

          {/* Forecast Next Days */}
          <View className="mb-8 space-y-3">
            <View className="flex-row items-center mx-6 space-x-2 mb-2">
              <CalendarDaysIcon size="23" color="white" />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.length > 0 &&
                weather.forecast.forecastday.map((item, index) => {
                  const date = new Date(item.date);
                  const options = { weekday: 'long' };
                  const dayName = date.toLocaleDateString('en-US', options);
                  return (
                    <View
                      key={index}
                      className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                      style={{ backgroundColor: theme.bgWhite(0.15) }}
                    >
                      <Image
                        source={
                          weatherImages[item?.day?.condition?.text] ||
                          require('../../../assets/sun.png') ||
                          require('../../../assets/partlycloudy.png') ||
                          require('../../../assets/moderaterain.png') ||
                          require('../../../assets/heavyrain.png')||
                          require('../../../assets/cloud.png')
                        }
                        className="h-11 w-11"
                      />
                      <Text className="text-white">{dayName}</Text>
                      <Text className="text-white text-xl font-semibold">
                        {item?.day?.avgtemp_c} &#176;
                      </Text>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomeScreen;
