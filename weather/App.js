import React, {useState, useEffect} from 'react';
import { StyleSheet, ImageBackground, Text, View, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar } from 'react-native';

import SearchInput from "./components/SearchInput"
import getImageForWeather from './utils/getImageForWeather'

import {fetchLocationId, fetchWeather } from "./utils/api"


export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [location, setLocation] = useState('')  
  const [temperature, setTemperature] = useState(0)
  const [weather, setWeather] = useState('')
  const [userInput, setUserInput] = useState('')

// function to update the city upon mount
  useEffect(()=> {
    handleUpdateInput('San Francisco')
  }, []) 

// update user input (temporarily city before checking validity)
  const handleUpdateInput = input => {
    setUserInput(input)
  }  

// once user input has updated, setLoading
  useEffect(()=> {
    setLoading(true)
  }, [userInput])

// once loading has been updated (ensure updated to true), run callback
// we need userInput to have updated (to use it like an argument here) and loading updated to ensure
// action is taken only when loading = true. Otherwise, loading changing to false would retrigger.
  useEffect(()=> {
      async function tapAPI() {
        if (loading) {
          try {
            const locationId = await fetchLocationId(userInput)
            const {location, weather, temperature} = await fetchWeather(locationId)
            setLoading(false)
            setError(false)
            setLocation(location)
            setWeather(weather)
            setTemperature(temperature)
          } catch (e) {
            setLoading(false)
            setError(true)
          }
        }
      }
    tapAPI()
  }, [loading])

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={getImageForWeather(weather)} 
        style={styles.imageContainer} 
        imageStyle={styles.image}
      >
        <View style={styles.detailsContainer}>
          <ActivityIndicator animating={loading} color="white" size="large" />
          {!loading && (
            <View>
            {error && (
                <Text style={[styles.smallText, styles.textStyle]}>
                  Could not load weather, please try a different city.
                </Text>
              )}

              {!error && (
              <View>
                <Text style={[styles.largeText, styles.textStyle]}>
                  {location}
                </Text>
                <Text style={[styles.smallText, styles.textStyle]}>
                  {weather}
                </Text>
                <Text style={[styles.largeText, styles.textStyle]}>
                  {`${Math.round(temperature)}°`}
                </Text>
              </View>
            )}
              <SearchInput placeholder="Search any city" onSubmit={handleUpdateInput}/>
            </View>
          )}
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
      color:'white'
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});
