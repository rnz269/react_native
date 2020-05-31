import React from "react"
import {View, Text, StyleSheet} from "react-native"
import PropTypes from 'prop-types'

import TimerButton from "./TimerButton"
import 	{millisecondsToHuman} from '../utils/TimerUtils'

export default function Timer({title, project, elapsed, isRunning, editTimer, toggleTimer, removeTimer}) {
	const elapsedString = millisecondsToHuman(elapsed)

// id is defined within this Timer file. No need for handleRemoveTimer to accept an argument from child.
// so no need to pass id downward for the remove function to execute. when child calls this callback function, 
// parent can receive args passed to the function AND parents still have access to their own state & props.
// ended up moving handle functions up one level, since EditableTimer has id, too.


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
				<TimerButton small color="blue" title="Remove" onPress={removeTimer}/>
			</View>
			
			<View>
				{isRunning 
					? <TimerButton color="red" title="Stop" onPress={toggleTimer} />
					: <TimerButton color="green" title="Start" onPress={toggleTimer} />
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

Timer.propTypes = {
	title: PropTypes.string.isRequired,
	project: PropTypes.string.isRequired,
	elapsed: PropTypes.number.isRequired,
	isRunning: PropTypes.bool.isRequired,
	editTimer: PropTypes.func.isRequired,
	toggleTimer: PropTypes.func.isRequired,
	removeTimer: PropTypes.func.isRequired,
}