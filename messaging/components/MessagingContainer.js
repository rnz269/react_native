import React, {useEffect} from 'react'
import {SafeAreaView, BackHandler, LayoutAnimation, Platform, UIManager, View} from 'react-native'
import PropTypes from 'prop-types'

export const INPUT_METHOD = {
	NONE: 'NONE', // don't show any IME
	KEYBOARD: 'KEYBOARD', // text input is focused, so keyboard should be visible
	CUSTOM: 'CUSTOM', // show our custom IME: our image picker
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function MessagingContainer({containerHeight, contentHeight, keyboardHeight, keyboardVisible, keyboardWillShow, keyboardWillHide, keyboardAnimationDuration, inputMethod, onChangeInputMethod, renderInputMethodEditor, children}) {
	// on component mount, add BackHandler event listener
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

	// parent is dictating state of keyboard.
	// when keyboard prop changes, we must make changes in this component
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

	// Determining outer container's height
	// if IM is keyboard OR keyboard is appearing, we'll use contentHeight
	const useContentHeight = inputMethod === INPUT_METHOD.KEYBOARD || keyboardWillShow
	const containerStyle = {
		height: useContentHeight ? contentHeight : containerHeight
	}
	
	// Determining inner container's height
	// if IM is custom AND keyboard isn't appearing, we'll use keyboardHeight
	const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow
	const inputStyle = {
		height: showCustomInput ? keyboardHeight || 250 : 0
	}

	return (
		<View style={containerStyle}>
			{children}
			<View style={inputStyle}>{renderInputMethodEditor()}</View>
		</View>
	)
}

MessagingContainer.propTypes = {
	// from keyboardState
	containerHeight: PropTypes.number.isRequired,
	contentHeight: PropTypes.number.isRequired,
	keyboardHeight: PropTypes.number.isRequired,
	keyboardVisible: PropTypes.bool.isRequired,
	keyboardWillShow: PropTypes.bool.isRequired,
	keyboardWillHide: PropTypes.bool.isRequired,
	keyboardAnimationDuration: PropTypes.number.isRequired,

	// managing the IME type
	inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
	onChangeInputMethod: PropTypes.func,

	// rendering content
	children: PropTypes.node,
	renderInputMethodEditor: PropTypes.func.isRequired,
}

MessagingContainer.defaultProps = {
	children: null,
	onChangeInputMethod: ()=> {},
}