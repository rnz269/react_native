import {
  Animated,
  ColorPropType,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import React, {useState, useEffect, useRef} from 'react'

// p & d: .4, p & !d: .7, !p & d: .5, !p & !d: 1
const getValue = (pressed, disabled) => {
  const base = disabled ? 0.5 : 1
  const delta = disabled ? 0.1 : 0.3

  return pressed ? base - delta : base
}

export default function Button ({title, onPress, disabled, color, height, borderRadius, fontSize}) {
    // state
    const [pressed, setPressed] = useState(false)

    // setup animated value
    const value = useRef(new Animated.Value(getValue(false, disabled))).current

    // when either pressed or disabled changes, we want to trigger animation
    useEffect(()=> {
      Animated.timing(value, {
        toValue: getValue(pressed, disabled),
        duration: 200,
        easing: Easing.out(Easing.quad),
      }).start()
    }, [disabled, pressed])
  
    // animated value interpolation
    const animatedColor = value.interpolate({
      inputRange: [0,1],
      // 0 maps to black, 1 maps to fully colored color prop
      outputRange: ['black', color]
    })
    const animatedScale = value.interpolate({
      inputRange: [0, 1],
      // 0 maps to 0.8, 1 maps to 1
      outputRange: [0.8, 1]
    })

    // dynamic style objects based off interpolated values
    const containerStyle = {
      borderColor: animatedColor,
      borderRadius,
      height,
      transform: [{ scale: animatedScale }]
    }
    const titleStyle = {
      color: animatedColor,
      fontSize,
    }

    // handler functions
    const handlePressIn = ()=> {
      setPressed(true)
    }
    const handlePressOut = ()=> {
      setPressed(false)
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.container, containerStyle]}>
          <Animated.Text style={[styles.title, titleStyle]}>
            {title}
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }


const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1E2A',
    borderWidth: 2,
  },
  title: {
    backgroundColor: 'transparent',
    fontSize: 24,
  },
})

 Button.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    height: PropTypes.number,
    color: ColorPropType,
    fontSize: PropTypes.number,
    borderRadius: PropTypes.number,
  }

Button.defaultProps = {
    onPress: () => {},
    disabled: false,
    height: null,
    color: '#0CE1C2',
    fontSize: 24,
    borderRadius: 100,
  }
