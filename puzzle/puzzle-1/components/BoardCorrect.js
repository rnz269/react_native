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
  const squareScale = useRef(null)
  const squareTop = useRef(null)
  const squareLeft = useRef(null)

  // runs after mount -- init animatedValues array of objects, one obj. per tile
  // we're not performing animations here; we're setting up init positions for tiles to live
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
      setTransitionState(State.WillTransitionIn)
  }, [])

  // useEffect will rerun after each render phase w/ change in transitionState
  useEffect(()=> {
    // willTransitionIn => rerender => all pieces displayed => this side effect
    if (transitionState === State.WillTransitionIn) {
      setTransitionState(State.DidTransitionIn)
      onTransitionIn()
    }
  }, [transitionState])

  useEffect(()=> {
    async function update() {
      // previousMove contains a square. let's get this square's index
      const squareIndex = getIndex(puzzle, previousMove)
      // update the position of said square
      const test = await updateSquarePosition(puzzle, previousMove, squareIndex)
    }
    // don't update on first render, as useEffect does
    if (previousMove !== null) {
      update()
    }
  }, [puzzle])

  // style objects for size of container, items
  const containerSize = calculateContainerSize()
  const containerStyle = {
    width: containerSize,
    height: containerSize,
  }

  // upon initial touch, magnify to 1.1x size
  const handleTouchStart = square => {
    Animated.spring(animatedValues.current[square].scale, {
      toValue: 1.1,
      friction: 20,
      tension: 200,
      useNativeDriver: true,
    }).start()
  }

  // square and index provided by renderSquare, while offset provided by Draggable
  // what we're trying to do is make the square follow the finger (finger = top,left)
  const handleTouchMove = (square, index, {top, left}) => {
    const {size} = puzzle
    const itemSize = calculateItemSize(size)
    const move = availableMove(puzzle, square)
    // Calculate tile's initial position based on index in puzzle's board []. rename return vars
    const {top: initialTop, left: initialLeft} = calculateItemPosition(size, index)
    // furthest box should be able to move is one item's size in any direction
    const distance = itemSize + itemMargin

    // clamp ensures item isn't moved past borders, or over filled tile. leaves obj. as is unless < min or > max
    // clamp accepts 3 args. we provide top (finger's offset dy), min, max
    // so if move === 'up', min is -size, max is 0 => can move up one tile, can't move down
    const clampedTop = clamp (
      top,
      move === 'up' ? -distance : 0,
      move === 'down' ? distance : 0
    )
    const clampedLeft = clamp (
      left,
      move === 'left' ? -distance : 0,
      move === 'right' ? distance : 0
    )
    // setValue is a function exposed on the new Animated.Value() instance, allowing external
    // code to control the internal value of instance w/o triggering animations of interim states
    // ~ setValue starts animation -> jump to specific value, which is better than .spring for slow devices
    animatedValues.current[square].top.setValue (
      initialTop + clampedTop
    )
    animatedValues.current[square].left.setValue (
      initialLeft + clampedLeft,
    )
  }

    // updates position of square on board (back to old, or in to new)
    const updateSquarePosition = (puzzle, square, index) => {
      const {size} = puzzle
      const {top, left} = calculateItemPosition(size, index)
      const animations = [
        Animated.spring(animatedValues.current[square].top, {
          toValue: top,
          friction: 20,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.spring(animatedValues.current[square].left, {
          toValue: left,
          friction: 20,
          tension: 200,
          useNativeDriver: true,
        }),
      ]
      // Animated.Parallel lets you know when when both events have completed
      // Animated.parallel takes [] of animations & returns an obj. w/ start(callback) method
      // callback called when EVERY animation in [] has completed
      // to make updateSquarePosition easier to use, making it return promise
      return new Promise(resolve => Animated.parallel(animations).start(resolve))
    }

    // scale piece back to orig. size, detect whether endpt. > threshold, reposition accordingly
    const handleTouchEnd = (square, index, {top, left}) => {
      const { size } = puzzle
      // bring scale back down to 1
      Animated.spring(animatedValues.current[square].scale, {
        toValue: 1,
        friction: 20,
        tension: 200,
        useNativeDriver: true
      }).start()

      // calculate threshold
      const itemSize = calculateItemSize(size)
      const threshold = itemSize/2

      // only 1 of these directions will be nonzero, due to handleTouchMove's clamp, so fine to +
      const displacement = Math.abs(top+left)

      if (displacement > threshold) {
        // triggers new puzzle state w/ new move. doesn't actually move it into new place, though
        // new puzzle state will be passed back down, recognized in useEffect, which calls
        // updateSquarePosition with the new puzzle state
        onMoveSquare(square)
      } else {
        // move piece back to original spot pre-drag
        updateSquarePosition(puzzle, square, index)
      }
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
      ],
    }
    // full picture put into a square would show only top left part of picture
    // however, we can push the image up and over w/ translate to show specific subset
    const imageStyle = {
      // position absolute so we can fit exactly where we want within parent
      position: 'absolute',
      // make the image take up the space of the entire grid
      width: itemSize * size + (itemMargin * size - 1),
      height: itemSize * size + (itemMargin * size - 1),
      // for translateY, - pushes up, positive pushes down
      // translateX and Y shows a specific subset of the image
      transform: [
        {
          translateX: -Math.floor(square % size) * (itemSize + itemMargin),
        },
        {
          translateY: -Math.floor(square / size) * (itemSize + itemMargin)
        },
      ],
    }
    // offset => handleTouchMove(square, index, offset)... offset comes from Draggable on call
    // square and index comes from renderSquare (Board)
    // below is just one tile. 
    // Draggable provides PanResponder and offset, children use these to render UI
    return (
      <Draggable
        key={square}
        enabled={transitionState === State.DidTransitionIn}
        onTouchStart={()=> handleTouchStart(square)}
        onTouchMove={offset => handleTouchMove(square, index, offset)}
        onTouchEnd={offset => handleTouchEnd(square, index, offset)}
      >
        {({ handlers, dragging }) => {
        return (
          <Animated.View {...handlers} style={[itemStyle, {zIndex: dragging ? 1 : 0}]}>
            <Image source={image} style={imageStyle}/>
          </Animated.View>
        )
        }}
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