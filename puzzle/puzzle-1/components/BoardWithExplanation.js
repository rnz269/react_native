import {
  Animated,
  Image,
  StyleSheet,
  View,
  Dimensions,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import React, {useState, useEffect, useRef} from 'react';

import { availableMove, getIndex } from '../utils/puzzle';
import {
  calculateContainerSize,
  calculateItemSize,
  itemMargin,
  calculateItemPosition,
} from '../utils/grid';
import Draggable from './Draggable';
import PuzzlePropType from '../validators/PuzzlePropType';
import clamp from '../utils/clamp';

const State = {
  SetupInstanceVariables: 'SetupInstanceVariables',
  WillTransitionIn: 'WillTransitionIn',
  DidTransitionIn: 'DidTransitionIn',
  DidTransitionOut: 'DidTransitionOut',
};

export default function Board ({puzzle, teardown, image, previousMove, onMoveSquare, onTransitionIn, onTransitionOut}) {

  const [transitionState, setTransitionState] = useState(State.SetupInstanceVariables)

  // useRefs, and all hooks, should be init in function body (not in useEffect or event handlers)
  // useRef is used to persist these values across renders. like class instance variables.
  const animatedValues = useRef(null)
  // can probably get rid of the following three, as they're only used to init animatedValues
  const squareScale = useRef(null)
  const squareTop = useRef(null)
  const squareLeft = useRef(null)

  useEffect(()=> {
      const temp = []
      const {size, board} = puzzle
    // board is our array describing current board state e.g. [0,3,2,1,4,5,7,8,6]
    // where first three indices span top row left to right
      board.forEach((square, index) => {
          // pass in size (3x3) and index of square (0), computes top & left of tile in grid
          const {top, left} = calculateItemPosition(size, index)
          // useRef can't be init in useEffect, and is required for Animated values
          // in functional components. So, we init useRef outside, use them here:
          squareScale.current = new Animated.Value(1)
          squareTop.current = new Animated.Value(top)
          squareLeft.current = new Animated.Value(left)
 
          temp[square] = {
            scale: squareScale.current,
            top: squareTop.current,
            left: squareLeft.current,
          }
        })
      animatedValues.current = temp
      // will fix later to first do WillTransitionIn
      setTransitionState(State.DidTransitionIn)
      onTransitionIn()
  }, [])

  // style objects for size of container, items
  const containerSize = calculateContainerSize()
  const containerStyle = {
    width: containerSize,
    height: containerSize,
  }

  const handleTouchStart = square => {
    Animated.spring(animatedValues.current[square].scale, {
      toValue: 1.1,
      friction: 20,
      tension: 200,
      useNativeDriver: true,
    }).start()
  }

  // square and index provided by renderSquare, while offset provided by Draggable
  const handleTouchMove = (square, index, {top, left}) => {
    const {size} = puzzle
    const itemSize = calculateItemSize(size)
    const move = availableMove(puzzle, square)
    // renaming top as initialTop, left as initialLeft
    const {top: initialTop, left: initialLeft} = calculateItemPosition(size, index)

    const distance = itemSize + itemMargin

    // don't let item go against rules, or go past board container
    // clamp accepts three arguments. we provide top (current top position), min, max
    // so if move === 'up', min is -size, max is 0
    const clampedTop = clamp (
      top,
      move === 'up' ? -distance : 0
      move === 'down' ? distance : 0
    )
    const clampedLeft = clamp (
      left,
      move === 'left' ? -distance : 0
      move === 'right' ? distance : 0
    )
    // setValue is a function exposed on the new Animated.Value() instance, allowing external
    // code to control the internal value of instance w/o triggering animations of interim states
    animatedValues[square].top.setValue (
      initialTop + clampedTop
    )
    animatedValues[square].left.setValue (
      initialLeft + clampedLeft,
    )
  }

  const renderSquare = (square, index) => {
    const {size, empty} = puzzle
    // if our square is the empty square, then render nothing
    if (square === empty) return null
    // calculate item size
    const itemSize = calculateItemSize(size)
    const itemStyle = {
      // position absolute so we can fit exactly where we want within parent
      position: 'absolute',
      width: itemSize,
      height: itemSize,
      overflow: 'hidden',
      // animatedValues tells us where square should position within parent grid based on index
      transform: [
        { translateX: animatedValues.current[square].left },
        { translateY: animatedValues.current[square].top },
        { scale: animatedValues.current[square].scale },
      ]
    }

    // full picture put into a square would show only top left part of picture
    // however, we can push the image up and over w/ translate to show specific subset
    const imageStyle = {
      // position absolute so we can fit exactly where we want within parent
      position: 'absolute',
      // make the image take up the space of the entire grid
      width: itemSize * size + (itemMargin * (size-1)),
      height: itemSize * size + (itemMargin * (size-1)),
      // for translateY, - pushes up, positive pushes down
      // translateX and Y shows a specific subset of the image
      transform: [
        { translateX: -Math.floor(square % size) * (itemSize + itemMargin) },
        { translateY: -Math.floor(square / size) * (itemSize + itemMargin) },
      ]
    }

    return (
      <Draggable
        key={square}
        enabled={transitionState === State.DidTransitionIn}
        onTouchStart={()=> handleTouchStart(square)}
        onTouchMove={offset => handleTouchMove(square, index, offset)}
        onTouchEnd={offset => handleTouchEnd(square, index, offset)}
      >
        {({ handlers, dragging }) => (
        <Animated.View {...handlers} style={[itemStyle, {zIndex: dragging ? 1 : 0}]}>
          <Image source={image} style={imageStyle}/>
        </Animated.View>
        )}
      </Draggable>
    )
  }

    return (
      <View style={[styles.container, containerStyle]}>
        {transitionState !== State.DidTransitionOut && (
          transitionState !== State.SetupInstanceVariables && (
            puzzle.board.map(renderSquare)
          )
        )}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#1F1E2A',
  },
  title: {
    fontSize: 24,
    color: '#69B8FF',
  },
});

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