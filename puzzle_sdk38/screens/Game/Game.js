import { ActivityIndicator, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import useGame from './hooks';

import Board from '../../components/Board';
import Button from '../../components/Button';
import PuzzlePropType from '../../validators/PuzzlePropType';
import Preview from '../../components/Preview';
import Stats from '../../components/Stats';

import styles from './styles';

export default function Game({ puzzle, image, onChange, onQuit }) {
  const {
    moves,
    transitionState,
    elapsed,
    previousMove,
    handlePressSquare,
    handleBoardTransitionIn,
    handleBoardTransitionOut,
    handlePressQuit,
    State,
  } = useGame(puzzle, image, onChange, onQuit);
  return (
    transitionState &&
    transitionState !== State.WillTransitionOut && (
      <View style={styles.container}>
        {transitionState === State.LoadingImage && <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.5)" />}
        {transitionState !== State.LoadingImage && (
          <View style={styles.centered}>
            <View style={styles.header}>
              <Preview image={image} boardSize={puzzle.size} />
              <Stats time={elapsed} moves={moves} />
            </View>
            <Board
              puzzle={puzzle}
              teardown={transitionState === State.RequestTransitionOut}
              image={image}
              previousMove={previousMove}
              onMoveSquare={handlePressSquare}
              onTransitionIn={handleBoardTransitionIn}
              onTransitionOut={handleBoardTransitionOut}
            />
            <Button title="Quit" onPress={handlePressQuit} />
          </View>
        )}
      </View>
    )
  );
}

Game.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  image: Image.propTypes.source,
  onChange: PropTypes.func.isRequired,
  onQuit: PropTypes.func.isRequired,
};

Game.defaultProps = {
  image: null,
};
