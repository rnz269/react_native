import React, {useState, useEffect} from 'react'
import {Keyboard, Platform} from 'react-native'
import PropTypes from 'prop-types'
const INITIAL_ANIMATION_DURATION = 250

// component keeps track of current keyboard visibility & height
export default function KeyboardState({layout, children}) {
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
	}, [])

	useEffect(()=> {
		console.log('incoming layout prop changed!', layout)
	}, [layout])

	console.log('line 35: ', layout)
	console.log('line36: ', contentHeight)
	const keyboardWillShowHandler = (event) => {
		console.log('line 40: ', layout)
		console.log('line 41: ', contentHeight)
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
		console.log('didhide: ', layout)
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


	return children({
		containerHeight: layout.height,
		contentHeight,
		keyboardHeight,
		keyboardVisible,
		keyboardWillShow,
		keyboardWillHide,
		keyboardAnimationDuration,
	})
}

KeyboardState.propTypes = {
	layout: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
	}).isRequired,
	children: PropTypes.func.isRequired,
}