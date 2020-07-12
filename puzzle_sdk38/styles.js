import { Platform, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' || parseInt(Platform.Version, 10) < 11 ? Constants.statusBarHeight : 0,
  },
});
