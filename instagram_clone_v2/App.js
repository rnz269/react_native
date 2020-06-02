import React, {useState} from 'react';
import { Platform, StyleSheet, View, Modal } from 'react-native';
import Constants from 'expo-constants';

// imports from other files
import Feed from './screens/Feed'
import Comments from './screens/Comments'

export default function App() {

  const [modal, setModal] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [commentsForItem, setCommentsForItem] = useState({})

  const openCommentScreen = (id) => {
    setSelectedItemId(id)
    setModal(true)
  }

  const closeCommentScreen = (id) => {
    setSelectedItemId(null)
    setModal(false)
  }


  const onSubmitComment = (comment) => {
    setCommentsForItem(prevCommentsForItem => {
    // comments array for the item in question prior to submission
      const comments = prevCommentsForItem[selectedItemId] || []
      const newCommentsForItem = {...prevCommentsForItem}
      newCommentsForItem[selectedItemId] = [...comments, comment]
      return newCommentsForItem
    })
  }


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
