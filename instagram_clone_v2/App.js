import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

// imports from other files
import CardList from './components/CardList'

export default function App() {

  const items = [
    {id: 0, author: 'Bob Ross'},
    {id: 1, author: 'Chuck Norris'},
  ]

  return (
    <View style={styles.container}>
      <CardList 
        items = {items}
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
