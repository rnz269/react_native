import React, {useState, useCallback} from 'react'
import {View, Platform} from 'react-native'
import Constants from 'expo-constants'

// Want to measure anything below our status bar (everything, in case of ios)
// Use this 'availableSpace' to transition btw height when keyboard is visible vs. not visible
// need to do this since keyboard doesn't take up space on our ui, so don't want to display underneath it
// event contains x, y, height, width
const initialState = {
	width: 0,
	height: 0,
	x: 0,
	y: 0,
}

const useComponentSize = (initial = initialState) => {
	const [layout, setLayout] = useState(initial)

	const onLayout = useCallback(event => {
		console.log(event)
		const newLayout = {...event.nativeEvent.layout}
		newLayout.y = newLayout.y + (Platform.OS === 'android' ? Constants.statusBarHeight : 0)
		setLayout(newLayout)
	}, [])

	return [layout, onLayout]
}

export default useComponentSize