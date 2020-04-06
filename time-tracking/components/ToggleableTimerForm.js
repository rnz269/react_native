import React, {useState} from "react"
import {StyleSheet, Text, View} from "react-native"
import PropTypes from 'prop-types'

import TimerForm from "./TimerForm"
import TimerButton from "./TimerButton"

export default function ToggleableTimerForm({onSubmit}) {
	const [isOpen, setIsOpen] = useState(false)

	const toggleOpen = () => {
		setIsOpen(prevIsOpen => !prevIsOpen)
	}

// supercharge passed down cb with ToggleableTimerForm's toggleOpen method (to close form upon creation)
	const handleSubmit = (id, title, project) => {
		onSubmit(id, title, project)
		toggleOpen()
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
			<TimerForm onSubmit={handleSubmit} toggleOpen={toggleOpen}/>
		</View>
	)
}

const styles = StyleSheet.create({
	buttonContainer: {
		marginVertical: 10,
		marginHorizontal: 15,
	}
})

ToggleableTimerForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
}
