import {
  Animated,
  StyleSheet,
  View,
  LayoutAnimation,
} from 'react-native'
import PropTypes from 'prop-types'
import React, {useState, useEffect, useRef} from 'react'

import Button from '../components/Button'
import Logo from '../components/Logo'
import Toggle from '../components/Toggle'
import configureTransition from '../utils/configureTransition'
import sleep from '../utils/sleep'

const State = {
  Launching: 'Launching',
  WillTransitionIn: 'WillTransitionIn',
  WillTransitionOut: 'WillTransitionOut',
}

const BOARD_SIZES = [3, 4, 5, 6]

export default function Start({onChangeSize, onStartGame, size}) {

// set initial transitionState to launching
  const [transitionState, setTransitionState] = useState(State.Launching)
  const toggleOpacity = useRef(new Animated.Value(0)).current
  const buttonOpacity = useRef(new Animated.Value(0)).current

  useEffect(()=> {
    async function triggerAnimation() {
      await sleep(500)
      await configureTransition(()=> {
        setTransitionState(State.WillTransitionIn)
      })
      // await keyword suspends progress through async function until promise resolves ^
      // so we only get here once LayoutAnimation fully completes
      Animated.timing(toggleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }).start()

      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }).start()
    }
    triggerAnimation()
  }, [])

  const handlePressStart = async () => {
    await configureTransition(()=> {
      setTransitionState(State.WillTransitionOut)
    })
    // call passed down function to start game
    onStartGame()
  }

    return (
      transitionState !== State.WillTransitionOut && (
        <View style={styles.container}>
          <View style={styles.logo}>
            <Logo />
          </View>
          {transitionState !== State.Launching && (
            <Animated.View style={{opacity: toggleOpacity}}>
              <Toggle
                options={BOARD_SIZES}
                value={size}
                onChange={onChangeSize}
              />
            </Animated.View>
          )}
          {transitionState !== State.Launching && (
          <Animated.View style={{opacity: buttonOpacity}}>
            <Button title={'Start Game'} onPress={handlePressStart} />
          </Animated.View>
          )}
        </View>
      )
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    alignSelf: 'stretch',
    paddingHorizontal: 40,
  },
})

Start.propTypes = {
  onChangeSize: PropTypes.func.isRequired,
  onStartGame: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
}

