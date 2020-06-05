import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Alert, TouchableHighlight, Image, BackHandler } from 'react-native';

import Status from './components/Status'
import MessageList from './components/MessageList'
import Toolbar from './components/Toolbar'
import ImageGrid from './components/ImageGrid'
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
  const [fullScreenImageId, setFullScreenImageId] = useState(null)

  // keep track of whether Toolbar textInput is in focus
  const [isFocused, setIsFocused] = useState(false)

  // ON COMPONENT MOUNT
  useEffect(()=> {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    // remove listener at unmount
    return ()=> {BackHandler.removeEventListener('hardwareBackPress', handleBackPress)}
  }, [])



  // EVENT HANDLER FUNCTIONS
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
        setIsFocused(false)
        default:
        break
    }

  }

  const dismissFullScreenImage = () => {
    setFullScreenImageId(null)
  }

  // for Android's hardware back button
  // we return true so we don't exit the app. 
  // false exits the app, which we want to do if not in a full screen image
  const handleBackPress = () => {
    if (fullScreenImageId) {
      setFullScreenImageId(null)
      return true
    }
    return false
  }

  const sendText = text => {
    setMessages(prevMessages => {
      // store new message first in order to render at bottom
      const newMessages = [createTextMessage(text), ...prevMessages]
      return newMessages
    })
  }

  const handleChangeFocus = (focus) => {
    setIsFocused(focus)
  }

  const handlePressToolbarCamera = () => {
    setIsFocused(false)
  }

  const handlePressToolbarLocation = () => {
    setIsFocused(false)
    // the navigator api below takes a cb function param, 
    // called w/ coordinates object: position
    navigator.geolocation.getCurrentPosition((position)=> {
      setMessages([createLocationMessage(position.coords), ...messages])
    })
  }

  // RENDER SECTION FUNCTIONS
  const renderMessageList = () => {
    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
      </View>
      )
  }

  const renderInputMethodEditor = ()=> {
    return (
      <View style={styles.inputMethodEditor}>
        <ImageGrid />
      </View>
      )
  }

  const renderToolbar = ()=> {
    return (
      <View style={styles.toolbar}>
        <Toolbar 
          isFocused={isFocused} 
          onSubmit={sendText} 
          onChangeFocus={handleChangeFocus} 
          onPressCamera={handlePressToolbarCamera} 
          onPressLocation={handlePressToolbarLocation}/>
      </View>
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
      {renderToolbar()}
      {renderInputMethodEditor()}
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
