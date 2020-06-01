import React, {useState, useRef} from "react"
import {View, Text, StyleSheet, TextInput} from "react-native"
import PropTypes from 'prop-types'

import TimerButton from "./TimerButton"

export default function TimerForm({id, title, project, onSubmit, toggleOpen}) {
	// load in to form input the current value from props
	// exception to anti-pattern since prop is only seed data for internal controlled component
	const [titleInput, setTitleInput] = useState(title)
	const [projectInput, setProjectInput] = useState(project)

	const titleRef = useRef(null)
	const projectRef = useRef(null)

	const handleChangeText = (name, text) => {
		name === "title" ? setTitleInput(text) : setProjectInput(text)
	}

// supercharge passed down cb with TimerForm's id, titleInput, projectInput data
	const handleSubmit = () => {
		onSubmit(id, titleInput, projectInput)
	}

	const submitText = id ? 'Update' : 'Create'

	return (
		<View style={styles.formContainer}>

			<View style={styles.attributeContainer}>
				<Text onPress={()=> titleRef.current.focus()} style={styles.textInputTitle}>Title</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						ref={titleRef}
						style={styles.textInput}
						clearButtonMode="always"
						value={titleInput}
						onChangeText={text => handleChangeText("title", text)}
						onSubmitEditing={()=> projectRef.current.focus()}
					/>
				</View>

			</View>

			<View style={styles.attributeContainer}>
				<Text onPress={()=> projectRef.current.focus()} style={styles.textInputTitle}>Project</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						ref={projectRef}
						style={styles.textInput}
						clearButtonMode="always"
						value={projectInput}
						onChangeText={text => handleChangeText("project", text)}
						onSubmitEditing={handleSubmit}
					/>
				</View>

			</View>

			<View style={styles.buttonGroup}>
				<TimerButton small color="#21BA45" title={submitText} onPress={handleSubmit}/>
				<TimerButton small color="#D82828" title="Cancel" onPress={toggleOpen}/>
			</View>

		</View>
		)
}

TimerForm.propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
	project: PropTypes.string,
	onSubmit: PropTypes.func.isRequired,
	toggleOpen: PropTypes.func.isRequired,
}

TimerForm.defaultProps = {
	id: null,
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
		marginVertical: 8,
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