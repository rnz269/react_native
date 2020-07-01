import {useState, useEffect} from 'react'
import {Keyboard, Platform} from 'react-native'
const INITIAL_ANIMATION_DURATION = 250

// component keeps track of current keyboard visibility & height
const useKeyboardState = (layout) => {
	// if our layout argument is null, immediately return to avoid exception
	if (!layout) return {}
// want to define keyboardInfo here to call children(keyboardInfo)
// content height is a function of keyboard height, layout.y
	const [contentHeight, setContentHeight] = useState(layout.height)
	const [keyboardHeight, setKeyboardHeight] = useState(0)
	const [keyboardVisible, setKeyboardVisible] = useState(false)
	const [keyboardWillShow, setKeyboardWillShow] = useState(false)
	const [keyboardWillHide, setKeyboardWillHide] = useState(false)
	const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(INITIAL_ANIMATION_DURATION)
	
	useEffect(()=> {

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

	// event is an obj. with properties duration, easing, startCoordinates/endCoordinates
	// endCoordinates is an obj with height, width, screenX, screenY
	// these refer to start and end coordinates of keyboard
	const measureEvent = (event) => {
		const { endCoordinates: {height, screenY},
				duration = INITIAL_ANIMATION_DURATION
			} = event
		setContentHeight(screenY - layout.y)
		setKeyboardHeight(height)
		setKeyboardAnimationDuration(duration)
	}

	return {containerHeight: layout.height, contentHeight, keyboardHeight, keyboardVisible, keyboardWillShow, keyboardWillHide, keyboardAnimationDuration}
}

export default useKeyboardState