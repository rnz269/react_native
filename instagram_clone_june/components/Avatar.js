import React from 'react';
import { StyleSheet, Text, View, ColorPropType } from 'react-native'
import PropTypes from 'prop-types'

export default function Avatar({size, backgroundColor, initials}) {
	
	const style = {
		width: size,
		height: size,
		borderRadius: size/2,
		backgroundColor,
	}

	return (
		<View style={[style, styles.container]}>
			<Text style={styles.initials}>
				{initials}
			</Text>
		</View>
		)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},

	initials: {
		color: 'white',
	}
})

Avatar.propTypes = {
	size: PropTypes.number.isRequired,
	backgroundColor: ColorPropType.isRequired,
	initials: PropTypes.string.isRequired,
}