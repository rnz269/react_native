import React from 'react';
import { StyleSheet, View } from 'react-native';

import Status from './components/Status'

export default function App() {
  return (
    <View style={styles.container}>
      <Status />
      <View style={styles.messageList}>
      </View>
      <View style={styles.toolbar}>
      </View>
      <View style={styles.inputMethodEditor}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
});
