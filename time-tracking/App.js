import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import ToggleableTimerForm from "./components/ToggleableTimerForm"
import EditableTimer from "./components/EditableTimer"

export default function App() {
  return (
    <View style={styles.appContainer}>
      <ToggleableTimerForm />
      <EditableTimer />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
