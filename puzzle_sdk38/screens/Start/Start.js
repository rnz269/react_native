import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import useStart from './hooks';

import Button from '../../components/Button';
import Logo from '../../components/Logo';
import Toggle from '../../components/Toggle';
import styles from './styles';

export default function Start({ onChangeSize, onStartGame, size }) {
  const { transitionState, State, toggleOpacity, buttonOpacity, handlePressStart, BOARD_SIZES } = useStart(onStartGame);

  return (
    transitionState !== State.WillTransitionOut && (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Logo />
        </View>
        {transitionState !== State.Launching && (
          <Animated.View style={{ opacity: toggleOpacity }}>
            <Toggle options={BOARD_SIZES} value={size} onChange={onChangeSize} />
          </Animated.View>
        )}
        {transitionState !== State.Launching && (
          <Animated.View style={{ opacity: buttonOpacity }}>
            <Button title="Start Game" onPress={handlePressStart} />
          </Animated.View>
        )}
      </View>
    )
  );
}

Start.propTypes = {
  onChangeSize: PropTypes.func.isRequired,
  onStartGame: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
};
