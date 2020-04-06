import React, {useState} from "react"
import {StyleSheet, Text, View} from "react-native"

import TimerForm from "./TimerForm"
import TimerButton from "./TimerButton"

export default function ToggleableTimerForm({onSubmit}) {
	const [isOpen, setIsOpen] = useState(false)
	const toggleOpen = () => {
		setIsOpen(prevIsOpen => !prevIsOpen)
	}

	if (!isOpen) {
	return (
		<View style={styles.buttonContainer}>
			<TimerButton color="black" title="+" onPress={toggleOpen}/>
		</View>
		)
	}
	return (
		<View>
			<TimerForm onSubmit={onSubmit} toggleOpen={toggleOpen}/>
		</View>
	)
}

const styles = StyleSheet.create({
	buttonContainer: {
		marginVertical: 10,
		marginHorizontal: 15,
	}
})

