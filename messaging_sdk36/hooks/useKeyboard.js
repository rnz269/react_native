import {useState, useEffect, useCallback, useRef} from 'react'
import {View, Platform, Keyboard, BackHandler, LayoutAnimation, UIManager} from 'react-native'
import {isIphoneX} from 'react-native-iphone-x-helper'
import Constants from 'expo-constants'
const INITIAL_ANIMATION_DURATION = 250

// Want to measure anything below our status bar (everything, in case of ios)
// Use this 'availableSpace' to transition btw height when keyboard is visible vs. not visible
// need to do this since keyboard doesn't take up space on our ui, so don't want to display underneath it
// event contains x, y, height, width

const useKeyboard = (inputMethod, onChangeInputMethod) => {

	/******************** MeasureLayout ********************/
	const [layout, setLayout] = useState(null)
/* Other method: create a ref, have measureEvent use layoutRef.current.y
	const layoutRef = useRef(layout)
	const setLayout = (value) => {
		layoutRef.current = value
		_setLayout(value) // change state to return [layout, _setLayout]
	}
*/
	const onLayout = useCallback(event => {
		const newLayout = {...event.nativeEvent.layout}
		newLayout.y = newLayout.y + (Platform.OS === 'android' ? Constants.statusBarHeight : 0)
		setLayout(newLayout)
		setContentHeight(newLayout.height)
	}, [])

	/******************** KeyboardState ********************/
	const [contentHeight, setContentHeight] = useState(null)
	const [keyboardHeight, setKeyboardHeight] = useState(0)
	const [keyboardVisible, setKeyboardVisible] = useState(false)
	const [keyboardWillShow, setKeyboardWillShow] = useState(false)
	const [keyboardWillHide, setKeyboardWillHide] = useState(false)
	const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(INITIAL_ANIMATION_DURATION)

	// keyboard methods
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

	/******************** MessagingContainer ********************/
	const INPUT_METHOD = {
		NONE: 'NONE', // don't show any IME
		KEYBOARD: 'KEYBOARD', // text input is focused, so keyboard should be visible
		CUSTOM: 'CUSTOM', // show our custom IME: our image picker
	}

	if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true)
	}

	useEffect(()=> {
		const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress())
		return () => subscription.remove()
	}, [])

	const handleBackPress = () => {
		if (inputMethod === INPUT_METHOD.CUSTOM) {
			onChangeInputMethod(INPUT_METHOD.NONE)
			return true
		}
		return false
	}

	// 'parent' is dictating state of keyboard.
	// when keyboard prop changes, we must make changes 'in this component'
	useEffect(()=> {
		if (keyboardVisible) {
			onChangeInputMethod(INPUT_METHOD.KEYBOARD)
		} else if (!keyboardVisible && inputMethod !== INPUT_METHOD.CUSTOM) {
			onChangeInputMethod(INPUT_METHOD.NONE)
		}
	}, [keyboardVisible])

	// run this side effect upon each render
	useEffect(()=> {
		const animation = LayoutAnimation.create (
			keyboardAnimationDuration,
			Platform.OS === 'android'
			? LayoutAnimation.Types.easeInEaseOut
			: LayoutAnimation.Types.keyboard,
			LayoutAnimation.Properties.opacity
			)
		LayoutAnimation.configureNext(animation)
	})

	const containerHeight = layout ? layout.height : 0
	// Determining outer container's height
	// if IM is keyboard OR keyboard is appearing, we'll use contentHeight
	// if IM isn't keyboard AND isn't appearing, we use containerHeight (layout.height)
	const useContentHeight = inputMethod === INPUT_METHOD.KEYBOARD || keyboardWillShow
	const containerStyle = {
		height: useContentHeight ? contentHeight : containerHeight
	}

	// Determining inner container's height (inputMethodEditor's height)
	// if IM is custom AND keyboard isn't appearing, we'll use keyboardHeight. Else, we don't want to show IME => height =0
	const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow

	// Determining inner container's marginTop. If either of following are true, we want marginTop of 24. Else, 0.
	// the keyboard is hidden and not transitioning up -> we want it to be 24 above bottom
	const keyboardIsHidden = inputMethod === INPUT_METHOD.NONE && !keyboardWillShow
	// the keyboard is visible and transitioning down -> we want it to stop 24 above bottom
	const keyboardIsHiding = inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide

	const inputStyle = {
		height: showCustomInput ? keyboardHeight || 250 : 0,
		// show extra space at bottom if device is iPhone X & keyboard not visible
		// computed above, keyboardIsHidden & keyboardIsHiding
		marginTop: isIphoneX() && (keyboardIsHidden || keyboardIsHiding) ? 24 : 0
	}

	return { onLayout, containerStyle, inputStyle }
}

export default useKeyboard