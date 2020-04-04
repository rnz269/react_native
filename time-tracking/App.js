import React, {useState} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import ToggleableTimerForm from "./components/ToggleableTimerForm"
import EditableTimer from "./components/EditableTimer"

export default function App() {
  const [timers, setTimers] = useState([])

  const createTimer = () => {
    // append to editable timer array of objects
    // [timer1, timer2, timer3], where timer1 = {id, title, project, elapsed, isRunning, editFormOpen}
    // wait... a timer is a component. We know in the render method, we can simply have an array of components
    // so how to get to array of components? start with array of data -> map each datum to a component
    // so createTimer should simply append an object with props id, title, project, etc. to array of objects
    // which should be simple -> access prev state, load into a new state var, then add new object
  }


  return (
    <View style={styles.appContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Timers</Text>
      </View>
      <ScrollView style={styles.timerList}>
        <ToggleableTimerForm isOpen={false} handleSubmit={createTimer}/>
        <EditableTimer 
          id={1}
          title="Mow the lawn"
          project="House Chores"
          elapsed={6000000}
          isRunning={false}
          editFormOpen={false} 
        />
          <EditableTimer 
          id={1}
          title="Move that bus"
          project="Become Superman"
          elapsed={12000000}
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
