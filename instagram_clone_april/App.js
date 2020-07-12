// import dependencies
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants'

// import from other project files
import Feed from "./screens/Feed"

// ios version is a string, android is a number
const PlatformVersion = Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : Platform.Version

export default function App() {

  return (
    <View style={styles.container}>
      <Feed style={styles.feed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
    marginTop: Platform.OS === 'android' || PlatformVersion < 11 ? Constants.statusBarHeight : 0,
  }
})
