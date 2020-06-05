import React, {useState, useEffect} from 'react';
import { StyleSheet, ImageBackground, Text, View, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar } from 'react-native';

import SearchInput from "./components/SearchInput"
import getImageForWeather from './utils/getImageForWeather'

import { fetchLocationId, fetchWeather } from "./utils/api"


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

// update user input, so it's accessible to tapAPI
  const handleUpdateInput = input => {
    setUserInput(input)
  }  

// follows immediately after userInput has updated. Here, we set loading to true.
  useEffect(()=> {
    setLoading(true)
  }, [userInput])


// follows immediately after loading has updated. Within, we ensure loading has updated to true.
// useEffect hook can't have async callback: useEffect(async()=>{},[])
// therefore, must define an async function within and then call it. Done below:
  useEffect(()=> {
    // updated 6.5.20: alternatively, could call tapAPI here and define async TapAPI outside of useEffect
    // define async function
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
     // call function
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
