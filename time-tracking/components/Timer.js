import React from "react"
import {View, Text, StyleSheet} from "react-native"

import TimerButton from "./TimerButton"
import 	{millisecondsToHuman} from '../utils/TimerUtils'

export default function Timer({id, title, project, elapsed, isRunning, editFormOpen, editTimer, toggleTimer, removeTimer}) {
	const elapsedString = millisecondsToHuman(elapsed)
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
				<TimerButton small color="blue" title="Remove" onPress={removeTimer} id={id}/>
			</View>
			
			<View>
				<TimerButton id={id} color="green" title="Start" onPress={toggleTimer} />
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