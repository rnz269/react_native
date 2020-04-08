// import dependencies
import React from 'react';
import { StyleSheet, Text, View, useState } from 'react-native';
import Constants from 'expo-constants'

// import from other project files
import CardList from "./components/CardList"
import {fetchImages, getImageFromId} from "./utils/api"

export default function App() {
  const data = [
  {
    id: 1,
    fullname:"Rahul Nallappa", 
    linkText:"", 
    onPressLinkText:()=>console.log("link pressed - RN"),
    image: {uri: 'https://unsplash.it/600/600'},
  },
    {
    id: 2,
    fullname:"Nick Dunlap", 
    linkText:"", 
    onPressLinkText:()=>console.log("link pressed - ND"),
    image: {uri: 'https://unsplash.it/600/600'},
  },
    {
    id: 3,
    fullname:"Naveen Nallappa", 
    linkText:"", 
    onPressLinkText:()=>console.log("link pressed - NN"),
    image: {uri: 'https://unsplash.it/600/600'},
  },

  ]


  return (
    <View style={styles.container}>
      <CardList 
        data={data}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
});
