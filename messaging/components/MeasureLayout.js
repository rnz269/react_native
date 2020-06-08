import React, {useState, useEffect} from 'react'
import {View, StyleSheet, Platform} from 'react-native'
import PropTypes from 'prop-types'
import Constants from 'expo-constants'

export default function MeasureLayout({children}) {
	// want to define layout here to call children(layout)
	// can measure view dimensions with onLayout prop, store in state
	// event contains x, y, height, width
	const [layout, setLayout] = useState()

	const handleLayout = event => {
		const {nativeEvent: {layout}} = event

		const newLayout = {...layout}
		newLayout.y = newLayout.y + (Platform.OS === 'android' ? Constants.statusBarHeight : 0)
		setLayout(newLayout)
	}

	// onLayout prop calls handler every time dimensions update
	if (!layout) {
		return (
			<View onLayout={handleLayout} style={styles.container} />
		)
	}

	return children(layout)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	}
})

MeasureLayout.propTypes = {
	children: PropTypes.func.isRequired,
}