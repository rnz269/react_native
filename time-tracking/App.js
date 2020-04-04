import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import ToggleableTimerForm from "./components/ToggleableTimerForm"
import EditableTimer from "./components/EditableTimer"

export default function App() {
  return (
    <View style={styles.appContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Timers</Text>
      </View>
      <ScrollView style={styles.timerList}>
        <ToggleableTimerForm />
        <EditableTimer 
          id={1}
          title="Mow the lawn"
          project="House Chores"
          elapsed={600}
          isRunning={false}
          editFormOpen={true} 
        />  
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',    
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D6D7DA",  
  },
  timerList: {
    paddingBottom: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  }
});
