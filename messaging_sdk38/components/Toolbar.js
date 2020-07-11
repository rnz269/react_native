import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

import ToolbarButton from "./ToolbarButton";

export default function Toolbar({
  isFocused,
  onChangeFocus,
  onSubmit,
  onPressCamera,
  onPressLocation,
}) {
  const [text, setText] = useState("");
  const textRef = useRef(null);

  // on render and every time isFocused changes
  // useRef necessary for parent to control focus, which we
  // need because a tap of camera should hide keyboard (blur)
  useEffect(() => {
    if (isFocused) {
      textRef.current.focus();
    } else {
      textRef.current.blur();
    }
  }, [isFocused]);

  const handleChangeText = (value) => {
    setText(value);
  };

  const handleSubmitEditing = () => {
    if (!text) {
      return;
    }
    onSubmit(text);
    setText("");
  };

  return (
    <View style={styles.container}>
      <ToolbarButton title={"📷"} onPress={onPressCamera} />
      <ToolbarButton title={"📍"} onPress={onPressLocation} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          ref={textRef}
          value={text}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          placeholder="Type something!"
          underlineColorAndroid={"transparent"}
          blurOnSubmit={false}
          onFocus={() => onChangeFocus(true)}
          onBlur={() => onChangeFocus(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 16,
    backgroundColor: "white",
  },

  inputContainer: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
  },

  input: {
    fontSize: 18,
  },
});

Toolbar.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  onChangeFocus: PropTypes.func,
  onSubmit: PropTypes.func,
  onPressCamera: PropTypes.func,
  onPressLocation: PropTypes.func,
};

Toolbar.defaultProps = {
  onChangeFocus: () => {},
  onSubmit: () => {},
  onPressCamera: () => {},
  onPressLocation: () => {},
};
