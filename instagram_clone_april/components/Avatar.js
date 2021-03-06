import React from 'react'
import {StyleSheet, View, Text, ColorPropType} from 'react-native'
import PropTypes from 'prop-types'

export default function Avatar({initials, size, backgroundColor}) {
	// need to include style within class to access props
	const style = {
		width: size,
		height: size,
		borderRadius: size / 2,
		backgroundColor,
	}

	return (
		<View style={[styles.avatarContainer, style]}>
			<Text style={styles.text}>{initials}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	avatarContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: 'white',
	},
})

Avatar.propTypes = {
	initials: PropTypes.string.isRequired,
	size: PropTypes.number.isRequired,
	backgroundColor: ColorPropType.isRequired,
}