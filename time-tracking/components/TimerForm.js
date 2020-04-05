import React, {useState} from "react"
import {View, Text, StyleSheet, TextInput} from "react-native"

import TimerButton from "./TimerButton"

export default function TimerForm({id, title, project, onSubmit, toggleOpen}) {
	// load in to form input the current value from props
	// exception to anti-pattern since prop is only seed data for internal controlled component
	const [titleInput, setTitleInput] = useState(title)
	const [projectInput, setProjectInput] = useState(project)

	const handleChangeText = (name, text) => {
		name === "title" ? setTitleInput(text) : setProjectInput(text)
	}

	const handleSubmit = () => {
		toggleOpen()
		onSubmit(id, titleInput, projectInput)
	}

	const submitText = id ? 'Update' : 'Create'

	return (
		<View style={styles.formContainer}>

			<View style={styles.attributeContainer}>
				<Text style={styles.textInputTitle}>Title</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						style={styles.textInput}
						clearButtonMode="always"
						value={titleInput}
						onChangeText={text => handleChangeText("title", text)}
					/>
				</View>

			</View>

			<View style={styles.attributeContainer}>
				<Text style={styles.textInputTitle}>Project</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						style={styles.textInput}
						clearButtonMode="always"
						value={projectInput}
						onChangeText={text => handleChangeText("project", text)}
					/>
				</View>

			</View>

			<View style={styles.buttonGroup}>
				<TimerButton small color="#21BA45" title={submitText} onPress={handleSubmit} id={id} titleInput={titleInput} projectInput={projectInput}/>
				<TimerButton small color="#D82828" title="Cancel" onPress={toggleOpen}/>
			</View>

		</View>
		)
}

TimerForm.defaultProps = {
	id: false,
	title: "",
	project: "",
}

const styles = StyleSheet.create({
	formContainer: {
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