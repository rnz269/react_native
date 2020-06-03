import React, {useState, useEffect} from 'react';
import { AsyncStorage, Platform, StyleSheet, View, Modal } from 'react-native';
import Constants from 'expo-constants';

// imports from other files
import Feed from './screens/Feed'
import Comments from './screens/Comments'

const ASYNC_STORAGE_COMMENTS_KEY = 'ASYNC_STORAGE_COMMENTS_KEY2'

export default function App() {

  // boolean whether to show or hide modal
  const [modal, setModal] = useState(false)
  // determines what the selected item is, if there is one
  const [selectedItemId, setSelectedItemId] = useState(null)
  // all comments are stored in an object. object contains key and value for each image
  // where key is image id and value is array of comments for that image
  const [commentsForItem, setCommentsForItem] = useState({})

  // when component mounts, retrieve comments data from asyncStorage
  useEffect(()=> {
    async function loadData() {
      try {
        const commentsForItem = await AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY)

        setCommentsForItem(commentsForItem ? JSON.parse(commentsForItem) : {})
      } catch (e) {
          console.log('Failed to load comments')
      }
    }
    loadData()
  }, [])

  const openCommentScreen = (id) => {
    setSelectedItemId(id)
    setModal(true)
  }

  const closeCommentScreen = (id) => {
    setSelectedItemId(null)
    setModal(false)
  }


  const onSubmitComment = comment => {
    setCommentsForItem(prevCommentsForItem => {
    // comments array for the item in question prior to submission
      const comments = prevCommentsForItem[selectedItemId] || []
    // get all the properties from previous state object into a new state object
      const newCommentsForItem = {...prevCommentsForItem}
    // overwrite the array belonging to item in question
      newCommentsForItem[selectedItemId] = [...comments, comment]
    // return new state object
      return newCommentsForItem
    })
  }

  useEffect(()=> {
    async function saveData() {
    // write new state object to asyncStorage
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_COMMENTS_KEY, JSON.stringify(commentsForItem))
    } catch(e) {
      console.log('Failed to save comment for', selectedItemId)
      }
    }
    saveData()
  }, [commentsForItem])


  return (
    <View style={styles.container}>
      <Feed commentsForItem={commentsForItem} onPressComments={openCommentScreen} style={styles.feed} />
      <Modal visible={modal} animationType="slide" onRequestClose={closeCommentScreen}>
        <Comments style={styles.comments} onSubmitComment={onSubmitComment} comments={commentsForItem[selectedItemId] || []} onClose={closeCommentScreen} />
      </Modal>
    </View>
  )
}

const platformVersion = 
  Platform.OS === 'ios'
  ? parseInt(Platform.Version, 10)
  : Platform.Version;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
    marginTop: Platform.OS === 'android' || platformVersion < 11 
    ? Constants.statusBarHeight
    : 0,
  },
  comments: {
    flex: 1,
    marginTop: Platform.OS === 'ios' && platformVersion < 11 
    ? Constants.statusBarHeight
    : 0,
  }
});
