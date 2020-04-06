import React from "react"
import {TouchableOpacity, Text, StyleSheet, ColorPropType} from "react-native"
import PropTypes from 'prop-types'


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
		minWidth: 100,
		marginTop: 10,
		borderWidth: 2,
		borderRadius: 3,
	},
	small: {
		fontSize: 14,
		padding: 5
	},
	large: {
		fontSize: 16,
		padding: 10,
	},
	buttonText: {
		textAlign: 'center',
		fontWeight: 'bold',
	},
})

TimerButton.propTypes = {
	color: ColorPropType.isRequired,
	title: PropTypes.string.isRequired,
	small: PropTypes.bool,
	onPress: PropTypes.func.isRequired,
}

TimerButton.defaultProps = {
	small: false,
}