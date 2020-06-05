import React from 'react'
import { Text, StyleSheet, TouchableOpacity} from 'react-native'

import PropTypes from 'prop-types'

export default function ToolbarButton({title, onPress}) {



	return (
		<TouchableOpacity onPress={onPress}>
			<Text style={styles.button}>{title}</Text>
		</TouchableOpacity>

	)

}

const styles = StyleSheet.create({
	button: {
		top: -2,
		marginRight: 12,
		fontSize: 20,
		color: 'gray',
	}
})

ToolbarButton.propTypes = {
	title: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
}
