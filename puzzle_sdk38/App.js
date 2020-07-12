import { LinearGradient } from 'expo-linear-gradient';

import { Platform, SafeAreaView, StatusBar, UIManager } from 'react-native';
import React from 'react';
import useApp from './useApp';
import styles from './styles';

import Start from './screens/Start';
import Game from './screens/Game';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BACKGROUND_COLORS = ['#1B1D34', '#2A2A38'];

export default function App() {
  const { size, handleStartGame, handleChangeSize, puzzle, image, handleGameChange, handleQuit } = useApp();

  return (
    <LinearGradient style={styles.background} colors={BACKGROUND_COLORS}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {!puzzle && <Start size={size} onStartGame={handleStartGame} onChangeSize={handleChangeSize} />}
        {puzzle && <Game puzzle={puzzle} image={image} onChange={handleGameChange} onQuit={handleQuit} />}
      </SafeAreaView>
    </LinearGradient>
  );
}
