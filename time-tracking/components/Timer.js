import React from "react"
import {View, Text, StyleSheet} from "react-native"

import TimerButton from "./TimerButton"
import 	{millisecondsToHuman} from '../utils/TimerUtils'

export default function Timer({id, title, project, elapsed, isRunning, editFormOpen, editTimer, toggleTimer, removeTimer}) {
	const elapsedString = millisecondsToHuman(elapsed)

// id is defined within this Timer file. No need for handleRemoveTimer to accept an argument from child.
// so no need to pass id downward for the remove function to execute. when child calls this callback function, 
// parent can receive args passed to the function AND parents still have access to their own state & props.

// supercharge passed down cb with Timer's id data
	const handleRemoveTimer = () => {
		removeTimer(id)
	}

// supercharge passed down cb with Timer's id data
	const handleToggleTimerPress = () => {
		toggleTimer(id)
	}

	return (
		<View style={styles.timerContainer}>

			<View>
				<Text style={styles.titleText}>{title}</Text>
				<Text>{project}</Text>
			</View>

			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>{elapsedString}</Text>
			</View>

			<View style={styles.buttonGroup}>
				<TimerButton small color="blue" title="Edit" onPress={editTimer}/>
				<TimerButton small color="blue" title="Remove" onPress={handleRemoveTimer} id={id}/>
			</View>
			
			<View>
				{isRunning 
					? <TimerButton id={id} color="red" title="Stop" onPress={handleToggleTimerPress} />
					: <TimerButton id={id} color="green" title="Start" onPress={handleToggleTimerPress} />
				}
			</View>

		</View>
		)
}

const styles = StyleSheet.create({
	timerContainer: {
		borderColor: "#D6D7DA",
		borderWidth: 2,
		borderRadius: 10,
		padding: 15,
		margin: 15,
		marginBottom: 0,
	},
	timeContainer: {
		marginVertical: 15,
	},
	buttonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	timeText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 26,
	},
	titleText: {
		fontWeight: 'bold',
	}
})