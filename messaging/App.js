import React, {useState} from 'react';
import { StyleSheet, View, Alert, TouchableHighlight, Image } from 'react-native';

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

  // keep track of which image is pressed
  // if image is pressed: a) if state is 0, then we'll set to id
  // b) if state is nonzero, then we'll set to 0
  const [fullScreenImageId, setFullScreenImageId] = useState(null)
  const dismissFullScreenImage = () => {
    setFullScreenImageId(null)
  }

  const handlePressMessage = ({id, type}) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const newMessages = messages.filter(message => message.id !== id)
                setMessages(newMessages)
              }
            }
          ],
        )
        break

      case 'image':
        setFullScreenImageId(id)

        default:
        break
    }

  }

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

  const renderFullScreenImage = () => {
    if (fullScreenImageId) {
        const imageSelected = messages.find(message => message.id === fullScreenImageId)
        
      return (
        <TouchableHighlight onPress={dismissFullScreenImage} style={styles.fullscreenOverlay}>
          <Image style={styles.fullscreenImage} source={{uri: imageSelected.uri}}/>
        </TouchableHighlight>
      )
    }
  }


  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderInputMethodEditor()}
      {renderToolbar()}
      {renderFullScreenImage()}
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
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  }
});
