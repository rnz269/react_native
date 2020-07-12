// NOT USED ANYMORE
import React, { useEffect } from "react";
import {
  BackHandler,
  LayoutAnimation,
  Platform,
  UIManager,
  View,
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import PropTypes from "prop-types";

export const INPUT_METHOD = {
  NONE: "NONE", // don't show any IME
  KEYBOARD: "KEYBOARD", // text input is focused, so keyboard should be visible
  CUSTOM: "CUSTOM", // show our custom IME: our image picker
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MessagingContainer({
  containerHeight,
  contentHeight,
  keyboardHeight,
  keyboardVisible,
  keyboardWillShow,
  keyboardWillHide,
  keyboardAnimationDuration,
  inputMethod,
  onChangeInputMethod,
  renderInputMethodEditor,
  children,
}) {
  // on component mount, add BackHandler event listener
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress()
    );
    return () => subscription.remove();
  }, []);

  const handleBackPress = () => {
    if (inputMethod === INPUT_METHOD.CUSTOM) {
      onChangeInputMethod(INPUT_METHOD.NONE);
      return true;
    }
    return false;
  };

  // parent is dictating state of keyboard.
  // when keyboard prop changes, we must make changes in this component
  useEffect(() => {
    if (keyboardVisible) {
      onChangeInputMethod(INPUT_METHOD.KEYBOARD);
    } else if (!keyboardVisible && inputMethod !== INPUT_METHOD.CUSTOM) {
      onChangeInputMethod(INPUT_METHOD.NONE);
    }
  }, [keyboardVisible]);

  // run this side effect upon each render
  useEffect(() => {
    const animation = LayoutAnimation.create(
      keyboardAnimationDuration,
      Platform.OS === "android"
        ? LayoutAnimation.Types.easeInEaseOut
        : LayoutAnimation.Types.keyboard,
      LayoutAnimation.Properties.opacity
    );
    LayoutAnimation.configureNext(animation);
  });

  // Determining outer container's height
  // if IM is keyboard OR keyboard is appearing, we'll use contentHeight
  // if IM isn't keyboard AND isn't appearing, we use containerHeight
  const useContentHeight =
    inputMethod === INPUT_METHOD.KEYBOARD || keyboardWillShow;
  const containerStyle = {
    height: useContentHeight ? contentHeight : containerHeight,
  };

  // Determining inner container's height (inputMethodEditor's height)
  // if IM is custom AND keyboard isn't appearing, we'll use keyboardHeight. Else, we don't want to show IME => height =0
  const showCustomInput =
    inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;

  // Determining inner container's marginTop. If either of following are true, we want marginTop of 24. Else, 0.
  // the keyboard is hidden and not transitioning up -> we want it to be 24 above bottom
  const keyboardIsHidden =
    inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;
  // the keyboard is visible and transitioning down -> we want it to stop 24 above bottom
  const keyboardIsHiding =
    inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;

  const inputStyle = {
    height: showCustomInput ? keyboardHeight || 250 : 0,
    // show extra space at bottom if device is iPhone X & keyboard not visible
    // computed above, keyboardIsHidden & keyboardIsHiding
    marginTop: isIphoneX() && (keyboardIsHidden || keyboardIsHiding) ? 24 : 0,
  };

  return (
    <View style={containerStyle}>
      {children}
      <View style={inputStyle}>{renderInputMethodEditor()}</View>
    </View>
  );
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
};

MessagingContainer.defaultProps = {
  children: null,
  onChangeInputMethod: () => {},
};
