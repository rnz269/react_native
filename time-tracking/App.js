import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import ToggleableTimerForm from "./components/ToggleableTimerForm"
import EditableTimer from "./components/EditableTimer"

import {newTimer} from "./utils/TimerUtils"

export default function App() {
  const [timers, setTimers] = useState([])

  const createOrUpdateTimer = (id, titleInput, projectInput) => {
   /* append to editable timer array of objects
    [timer1, timer2, timer3], where timer1 = {id, title, project, elapsed, isRunning, editFormOpen}
    wait... a timer is a component. We know in the render method, we can simply have an array of components
    so how to get to array of components? start with array of data -> map each datum to a component
    so createTimer should simply append an object with props id, title, project, etc. to array of objects
    which should be simple -> access prev state, load into a new state var, then add new object */

    // if id exists, we're updating
    if (id) {
      setTimers(prevTimers => {
        const newTimers = [...prevTimers]
        // cycle through array to find id match
        const timerChanged = newTimers.find(timer => timer.id === id)
        timerChanged.title = titleInput
        timerChanged.project = projectInput
        return newTimers
      })
    }
    // if id doesn't exist, we're creating
    const addedTimer = newTimer({title:titleInput, project: projectInput})
    setTimers(prevTimers => {
      const newTimers = [...prevTimers, addedTimer]
      return newTimers
    })
  }

  const timerComponents = timers.map(timer => <EditableTimer key={timer.id} handleSubmit={createOrUpdateTimer} { ...timer} />)
       
  return (
    <View style={styles.appContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Timers</Text>
      </View>
      <ScrollView style={styles.timerList}>
        <ToggleableTimerForm handleSubmit={createOrUpdateTimer}/>
        {timerComponents}
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
