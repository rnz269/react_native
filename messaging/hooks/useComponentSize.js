// NOT USED
import {useState, useCallback} from 'react'
import {View, Platform} from 'react-native'
import Constants from 'expo-constants'

// Want to measure anything below our status bar (everything, in case of ios)
// Use this 'availableSpace' to transition btw height when keyboard is visible vs. not visible
// need to do this since keyboard doesn't take up space on our ui, so don't want to display underneath it
// event contains x, y, height, width

const useComponentSize = () => {
	const [layout, setLayout] = useState(null)

	const onLayout = useCallback(event => {
		const newLayout = {...event.nativeEvent.layout}
		newLayout.y = newLayout.y + (Platform.OS === 'android' ? Constants.statusBarHeight : 0)
		setLayout(newLayout)
	}, [])

	return [layout, onLayout]
}

export default useComponentSize