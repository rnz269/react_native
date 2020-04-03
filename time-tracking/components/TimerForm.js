import React from "react"
import {View, Text, StyleSheet, TextInput} from "react-native"

import TimerButton from "./TimerButton"

export default function TimerForm({id, title, project}) {
	const submitText = id ? 'Update' : 'Create'

	return (
		<View style={styles.formContainer}>
			<View style={styles.attributeContainer}>
				<Text style={styles.textInputTitle}>Title</Text>
				<View style={styles.textInputContainer}>
					<TextInput
						style={styles.textInput}
						clearButtonMode="always"
						defaultValue={title}
					/>
				</View>
			</View>

			<View style={styles.attributeContainer}>
				<Text style={styles.textInputTitle}>Project</Text>
				<View style={styles.textInputContainer}>
					<TextInput
						style={styles.textInput}
						clearButtonMode="always"
						defaultValue={project}
					/>
				</View>
			</View>

			<View style={styles.buttonGroup}>
				<TimerButton small color="#21BA45" title={submitText} />
				<TimerButton small color="#D82828" title="Cancel" />
			</View>
		</View>
		)
}

const styles = StyleSheet.create({
	formContainer: {
		backgroundColor: "white",
		borderColor: "#D6D7DA",
		borderWidth: 2,
		borderRadius: 10,
		padding: 15,
		margin: 15,
		marginBottom: 0,
	},

	attributeContainer: {
		marginVertical: 8
	},

	textInputContainer: {
		borderColor: "#D6D7DA",
		borderRadius: 2,
		borderWidth: 1,
		marginBottom: 5,
	},

	textInputTitle: {
		fontWeight: "bold",
		fontSize: 14,
		marginBottom: 5,
	},

	textInput: {
		height: 30,
		padding: 5,
	},


	buttonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
})