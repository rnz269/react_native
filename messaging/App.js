import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableHighlight, Image } from 'react-native';

import Status from './components/Status'
import MessageList from './components/MessageList'
import Toolbar from './components/Toolbar'
import ImageGrid from './components/ImageGrid'

import useKeyboard from './hooks/useKeyboard'
import useMessaging from './hooks/useMessaging'

import MessagingContainer from './components/MessagingContainer'

export default function App() {

  /******************** Call Custom Hooks ********************/
  // don't render KeyboardState until we can supply it with a non-null prop
  // if {layout && (...)} is above View w/ onLayout, onLayout never fires -> no rerender
  const { messages, fullScreenImageId, isFocused, inputMethod, handleChangeInputMethod, dismissFullScreenImage, handleBackPress, handleChangeFocus, handlePressToolbarCamera, handlePressMessage, sendText, sendImage, handlePressToolbarLocation } = useMessaging()
  const { onLayout, containerStyle, inputStyle } = useKeyboard(inputMethod, handleChangeInputMethod)

  /******************** Render Section By Section ********************/
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
        <ImageGrid onPressImage={sendImage}/>
      </View>
      )
  }

  const renderToolbar = () => {
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

/******************** Component Return ********************/
  return (
    <View style={styles.container}>
      <Status />
      <View style={styles.layout} onLayout={onLayout}>
        <View style={containerStyle}>
          {renderMessageList()}
          {renderToolbar()}
          <View style={inputStyle}>
            {renderInputMethodEditor()}
          </View>
        </View>
     </View>
      {renderFullScreenImage()}
    </View>
  )
}

/******************** Styles & Documentation  ********************/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  layout: {
    flex: 1,
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
