import React from "react"
import {TouchableOpacity, Text, StyleSheet} from "react-native"

export default function TimerButton({color, title, small, onPress}) {
	return (
		<TouchableOpacity
			style={[styles.button, {borderColor: color}]}
			onPress={onPress}
		>
			<Text
				style={[
					styles.buttonText,
					small ? styles.small: styles.large, 
					{color}
				]}
			>
			{title}
			</Text>
		</TouchableOpacity>
		)
}

const styles = StyleSheet.create({
	button: {
		marginTop: 10,
		minWidth: 100,
		borderWidth: 2,
		borderRadius: 3,
	},
	buttonText: {},
	small: {},
	large: {},
})