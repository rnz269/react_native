import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import ToggleableTimerForm from "./components/ToggleableTimerForm"
import EditableTimer from "./components/EditableTimer"

import {newTimer} from "./utils/TimerUtils"

export default function App() {
  // state
  const [timers, setTimers] = useState([])
  const [utc, setUTC] = useState(0)

  // CONSTANT TIME INTERVAL
  const SECOND = 1000

  // increment time function, checks every second which timers are running, increments them
  useEffect(()=>{
    setTimeout(()=> {
      setUTC(utc => utc + 1)

      setTimers(prevTimers => {
        const newTimers = [...prevTimers]
        const incrementTimers = newTimers.map(timer => {
          if (timer.isRunning) timer.elapsed += SECOND
          return (timer)
        })
        return incrementTimers
      })

    }, SECOND)
  }, [utc])

// append to our array of timer objects a new timer or update an existing timer
  const createOrUpdateTimer = (id, titleInput, projectInput) => {
    // if id already exists, we're updating
    if (id) {
      setTimers(prevTimers => {
        const newTimers = [...prevTimers]
        const timerChanged = newTimers.find(timer => timer.id === id)
        timerChanged.title = titleInput
        timerChanged.project = projectInput
        return newTimers
      })
    }
  // else if id doesn't exist, we're creating
    else {
      const addedTimer = newTimer({title:titleInput, project: projectInput})
      setTimers(prevTimers => {
        const newTimers = [...prevTimers, addedTimer]
        return newTimers
      })
    }
  }

  // start/stop timer running
  const toggleTimer = id => {
    setTimers(prevTimers => {
      const newTimers = [...prevTimers]
      const timerToggled = newTimers.find(timer => timer.id === id)
      timerToggled.isRunning = !timerToggled.isRunning
      return newTimers
    })
  }

  // remove timer from display
  const removeTimer = id => {
    setTimers(prevTimers => {
      const newTimers = [...prevTimers]
      const filteredTimers = newTimers.filter(timer => timer.id !== id)
      return filteredTimers
    })
  }

  // map our array of timer objects from state to an array of Editable Timer components, supplementing with button behaviors
  const timerComponents = timers.map(timer => <EditableTimer key={timer.id} toggleTimer={toggleTimer} removeTimer={removeTimer} onSubmit={createOrUpdateTimer} { ...timer} />)
       
  return (
    <View style={styles.appContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Timers</Text>
      </View>
      <ScrollView style={styles.timerList}>
        <ToggleableTimerForm onSubmit={createOrUpdateTimer}/>
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
