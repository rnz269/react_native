import { useState, useEffect } from 'react'
import { BackHandler, Alert } from 'react-native'
import { INPUT_METHOD } from '../components/MessagingContainer'
import { createTextMessage, createImageMessage, createLocationMessage } from '../utils/MessageUtils'



const useMessaging = () => {

  /****************** STATE & SET STATE METHODS ******************/

  // initialize state with some data
  const [messages, setMessages] = useState([ 
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ])

  // keep track of which image is pressed
  const [fullScreenImageId, setFullScreenImageId] = useState(null)

  // keep track of whether Toolbar textInput is in focus
  const [isFocused, setIsFocused] = useState(false)

    // keep track of inputMethod
  const [inputMethod, setInputMethod] = useState(INPUT_METHOD.NONE)


  /****************** Effects ******************/
  useEffect(()=> {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    // remove listener at unmount
    return ()=> {BackHandler.removeEventListener('hardwareBackPress', handleBackPress)}
  }, [])
  

  /******************** Event Handler Functions ********************/
  const handleChangeInputMethod = (inputMethod) => {
    setInputMethod(inputMethod)
  }

  // fullScreenImage back to text
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

  // handles keyboard appear/disappear
  const handleChangeFocus = (focus) => {
    setIsFocused(focus)
  }

  // tap on camera button -> unfocuses keyboard, sets to custom input method
  const handlePressToolbarCamera = () => {
    setIsFocused(false)
    setInputMethod(INPUT_METHOD.CUSTOM)
  }



  // on tap of existing message
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

  // type text and hit return
  const sendText = text => {
    setMessages(prevMessages => {
      // store new message first in order to render at bottom
      const newMessages = [createTextMessage(text), ...prevMessages]
      return newMessages
    })
  }

  // select an image in input editor to send
  const sendImage = image => {
    setMessages(prevMessages => {
      // store new message first in order to render at bottom
      const newMessages = [createImageMessage(image), ...prevMessages]
      return newMessages
    })
  }

  // send location
  const handlePressToolbarLocation = () => {
    // the navigator api below takes a cb function param, 
    // called w/ coordinates object: position
    navigator.geolocation.getCurrentPosition((position)=> {
      setMessages(prevMessages => {
        const newMessages = [createLocationMessage(position.coords), ...prevMessages]
        return newMessages
      })
    })
  }

  return { messages, fullScreenImageId, isFocused, inputMethod, handleChangeInputMethod, dismissFullScreenImage, handleBackPress, handleChangeFocus, handlePressToolbarCamera, handlePressMessage, sendText, sendImage, handlePressToolbarLocation }
}

export default useMessaging