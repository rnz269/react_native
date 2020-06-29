import React, {useState, useEffect} from 'react'
import {View, StyleSheet, Platform} from 'react-native'
import PropTypes from 'prop-types'
import Constants from 'expo-constants'

// Want to measure anything below our status bar (everything, in case of ios)
// Use this 'availableSpace' to transition btw height when keyboard is visible vs. not visible
// need to do this since keyboard doesn't take up space on our ui, so don't want to display underneath it
export default function MeasureLayout({children}) {
	// want to define layout here to call children(layout)
	// can measure view dimensions with onLayout prop, store in state
	// event contains x, y, height, width
	const [layout, setLayout] = useState()

	const handleLayout = event => {
		const {nativeEvent: {layout}} = event
		console.log(layout)
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