import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';

import Status from './components/Status'
import MessageList from './components/MessageList'
import { createTextMessage, createImageMessage, createLocationMessage } from './utils/MessageUtils'

export default function App() {

  // initialize state with some data
  const [messages, setMessages] = useState([
    createImageMessage('https://unsplash.it/300/300'),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
      })
    ])

  const handlePressMessage = () => {}

  const renderMessageList = () => {
    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
      </View>
      )
  }

  const renderInputMethodEditor = ()=> {
    return (
      <View style={styles.inputMethodEditor}></View>
      )
  }

  const renderToolbar = ()=> {
    return (
      <View style={styles.toolbar}></View>
      )
  }


  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderInputMethodEditor()}
      {renderToolbar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
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
