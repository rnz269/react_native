import React from 'react';
import { StyleSheet, ImageBackground, Text, View, KeyboardAvoidingView, Platform } from 'react-native';

import SearchInput from "./components/SearchInput"
import getImageForWeather from './utils/getImageForWeather'


export default function App() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ImageBackground 
        source={getImageForWeather('Clear')} 
        style={styles.imageContainer} 
        imageStyle={styles.image}
      >
        <View style={styles.detailsContainer}>
          <Text style={[styles.largeText, styles.textStyle]}>San Francisco</Text>
          <Text style={[styles.smallText, styles.textStyle]}>Light Cloud</Text>
          <Text style={[styles.largeText, styles.textStyle]}>13°</Text>
          <SearchInput placeholder="Search any city" />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
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
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});
