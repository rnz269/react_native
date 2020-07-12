import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

export default function NavigationBar({title, leftText, onPressLeftText}) {

return (
	<View style={styles.container}>
		<TouchableOpacity style={styles.leftText} onPress={onPressLeftText}>
			<Text>{leftText}</Text>
		</TouchableOpacity>

		<Text style={styles.title}>{title}</Text>
	</View>
	)

}

const styles = StyleSheet.create({
	container: {
		height: 40,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(0,0,0,0.1)',
		// don't need flexDirection row since leftText
		// has position: absolute -> ignores container's flex
		alignItems: 'center',
		justifyContent: 'center',
	},

	leftText: {
		position: 'absolute',
		left: 20,
		// the following three ensure vertical centering
		top: 0,
		bottom: 0,
		justifyContent: 'center',
	}, 

	title: {
		fontWeight: '500',
	}
})

NavigationBar.propTypes = {
	title: PropTypes.string,
	leftText: PropTypes.string,
	onPressLeftText: PropTypes.func,
}

NavigationBar.defaultProps = {
	title: 'test',
	leftText: 'close',
	onPressLeftText: ()=> {}
} 
