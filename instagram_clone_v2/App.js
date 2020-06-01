import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

// imports from other files
import Card from './components/Card'

export default function App() {

  return (
    <View style={styles.container}>
      <Card 
        fullname="Rahul Nallappa"
        linkText="3 comments"
        onPressLinkText={()=> {
          console.log('Pressed link!');
        }}
        image={{uri: 'https://unsplash.it/600/600'}}
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
