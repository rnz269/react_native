// Dependencies
import React, { memo } from 'react';
import { Animated, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import PuzzlePropType from '../../validators/PuzzlePropType';
// Components
import Draggable from '../Draggable';
// Custom hooks: defines Animated Values array
import useBoard from './hooks';
// Utils
import calculateItemStyle from './helpers/calculateStyles';
import { handleTouchStart, handleTouchMove, handleTouchEnd } from './helpers/handlers';
import styles from './styles';

function Board({ puzzle, teardown, image, previousMove, onMoveSquare, onTransitionIn, onTransitionOut }) {
  const { animatedValues, transitionState, State, containerStyle } = useBoard(
    puzzle,
    onTransitionIn,
    previousMove,
    teardown,
    onTransitionOut,
  );
  const renderSquare = (square, index) => {
    const { size, empty } = puzzle;
    if (square === empty) return null; // if square empty, render nothing
    // call util function to compute styles
    const [itemStyle, imageStyle] = calculateItemStyle(square, size, animatedValues);
    // Animated.View is our responder owning interaction lock, ...handlers are function props
    return (
      <Draggable
        key={square}
        enabled={transitionState === State.DidTransitionIn}
        onTouchStart={() => handleTouchStart(animatedValues, square)}
        onTouchMove={(offset) => handleTouchMove(puzzle, animatedValues, square, index, offset)}
        onTouchEnd={(offset) => handleTouchEnd(onMoveSquare, puzzle, animatedValues, square, index, offset)}
      >
        {({ handlers, dragging }) => {
          return (
            <Animated.View {...handlers} style={[itemStyle, { zIndex: dragging ? 1 : 0 }]}>
              <Image source={image} style={imageStyle} />
            </Animated.View>
          );
        }}
      </Draggable>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {transitionState !== State.DidTransitionOut && puzzle.board.map(renderSquare)}
    </View>
  );
}

Board.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  teardown: PropTypes.bool.isRequired,
  image: Image.propTypes.source,
  previousMove: PropTypes.number,
  onMoveSquare: PropTypes.func.isRequired,
  onTransitionIn: PropTypes.func.isRequired,
  onTransitionOut: PropTypes.func.isRequired,
};

Board.defaultProps = {
  image: null,
  previousMove: null,
};

export default memo(Board);
