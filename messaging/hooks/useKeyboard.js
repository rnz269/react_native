import {useState, useEffect, useCallback, useRef} from 'react'
import {View, Platform, Keyboard} from 'react-native'
import Constants from 'expo-constants'
const INITIAL_ANIMATION_DURATION = 250

// Want to measure anything below our status bar (everything, in case of ios)
// Use this 'availableSpace' to transition btw height when keyboard is visible vs. not visible
// need to do this since keyboard doesn't take up space on our ui, so don't want to display underneath it
// event contains x, y, height, width

const useKeyboard = () => {
	const [layout, setLayout] = useState(null)

/* Other method: create a ref, have measureEvent use layoutRef.current.y
	const layoutRef = useRef(layout)
	const setLayout = (value) => {
		layoutRef.current = value
		_setLayout(value) // change state to return [layout, _setLayout]
	}
*/
	// keyboardState
	const [contentHeight, setContentHeight] = useState(null)
	const [keyboardHeight, setKeyboardHeight] = useState(0)
	const [keyboardVisible, setKeyboardVisible] = useState(false)
	const [keyboardWillShow, setKeyboardWillShow] = useState(false)
	const [keyboardWillHide, setKeyboardWillHide] = useState(false)
	const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(INITIAL_ANIMATION_DURATION)

	const onLayout = useCallback(event => {
		const newLayout = {...event.nativeEvent.layout}
		newLayout.y = newLayout.y + (Platform.OS === 'android' ? Constants.statusBarHeight : 0)
		setLayout(newLayout)
		setContentHeight(newLayout.height)
	}, [])

	useEffect(()=> {
		const keyboardWillShowHandler = (event) => {
			setKeyboardWillShow(true)
			measureEvent(event)
		}

		const keyboardDidShowHandler = (event) => {
			setKeyboardWillShow(false)
			setKeyboardVisible(true)
			measureEvent(event)
		}

		const keyboardWillHideHandler = (event) => {
			setKeyboardWillHide(true)
			measureEvent(event)
		}

		const keyboardDidHideHandler = () => {
			setKeyboardWillHide(false)
			setKeyboardVisible(false)
		}

		const measureEvent = (event) => {
			const { endCoordinates: {height, screenY},
					duration = INITIAL_ANIMATION_DURATION
				} = event

			setContentHeight(screenY - layout.y)
			setKeyboardHeight(height)
			setKeyboardAnimationDuration(duration)
		}
		let subscriptions = []
		if (Platform.OS === 'ios') {
			subscriptions = [
				Keyboard.addListener('keyboardWillShow', keyboardWillShowHandler),
				Keyboard.addListener('keyboardWillHide', keyboardWillHideHandler),
				Keyboard.addListener('keyboardDidShow', keyboardDidShowHandler),
				Keyboard.addListener('keyboardDidHide', keyboardDidHideHandler)
			]
		} else {
			subscriptions = [
				Keyboard.addListener('keyboardDidShow', keyboardDidShowHandler),
				Keyboard.addListener('keyboardDidHide', keyboardDidHideHandler)
			]
		}
		return ()=> subscriptions.forEach(subscription => subscription.remove())
	}, [layout])

	return {layout: layout, onLayout, contentHeight, keyboardHeight, keyboardVisible, keyboardWillShow, keyboardWillHide, keyboardAnimationDuration}
}

export default useKeyboard