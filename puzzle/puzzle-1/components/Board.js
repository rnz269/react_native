// Dependencies
import React, {useState, useEffect, useRef} from 'react'
import { Animated, Image, StyleSheet, View,Dimensions, Easing } from 'react-native'
import PropTypes from 'prop-types'
import PuzzlePropType from '../validators/PuzzlePropType'
// Components
import Draggable from './Draggable'
// Custom hooks: defines Animated Values array
import useBoardSetup from '../hooks/useBoardSetup'
// Utils
import { availableMove, getIndex } from '../utils/puzzle'
import { calculateContainerSize, calculateItemSize, itemMargin, calculateItemPosition } from '../utils/grid'
import clamp from '../utils/clamp'
import calculateItemStyle from '../utils/calculateStyles'
import {updateSquarePosition, handleTouchStart, handleTouchMove, handleTouchEnd} from '../utils/handlers'

// define finite state machine
const State = {
  WillTransitionIn: 'WillTransitionIn',
  DidTransitionIn: 'DidTransitionIn',
  DidTransitionOut: 'DidTransitionOut',
};

export default function Board ({puzzle, teardown, image, previousMove, onMoveSquare, onTransitionIn, onTransitionOut}) {
  // runs before first render, returns [obj] where each obj has properties: scale, top, left -- all animated values
  const animatedValues = useBoardSetup(puzzle)
  const [transitionState, setTransitionState] = useState(State.WillTransitionIn)

  // useEffect will rerun after each render phase w/ change in transitionState
  useEffect(()=> {
    if (transitionState === State.WillTransitionIn) {
      setTransitionState(State.DidTransitionIn)
      onTransitionIn()
    }
  }, [transitionState])

  // after board state has updated, we run this effect to physically move pieces on board
  useEffect(()=> {
    async function update() {
      // previousMove contains a square. let's get this square's updated index
      const squareIndex = getIndex(puzzle, previousMove)
      // update the position of said square
      await updateSquarePosition(puzzle, animatedValues, previousMove, squareIndex)
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

  const renderSquare = (square, index) => {
    const {size, empty} = puzzle
    if (square === empty) return null // if square empty, render nothing
    // call util function to compute styles
    const [itemStyle, imageStyle] = calculateItemStyle(square, size, animatedValues)

    return (
      <Draggable
        key={square}
        enabled={transitionState === State.DidTransitionIn}
        onTouchStart={()=> handleTouchStart(animatedValues, square)}
        onTouchMove={offset => handleTouchMove(puzzle, animatedValues, square, index, offset)}
        onTouchEnd={offset => handleTouchEnd(onMoveSquare, puzzle, animatedValues, square, index, offset)}
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

  /* BOARD COMPONENT RETURN */
    return (
      <View style={[styles.container, containerStyle]}>
        {transitionState !== State.DidTransitionOut && (
            puzzle.board.map(renderSquare)
        )}
      </View>
    )
}

/* BOARD COMPONENT STYLES, PROPTYPES, DEFAULT PROPS */
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
})

  Board.propTypes = {
    puzzle: PuzzlePropType.isRequired,
    teardown: PropTypes.bool.isRequired,
    image: Image.propTypes.source,
    previousMove: PropTypes.number,
    onMoveSquare: PropTypes.func.isRequired,
    onTransitionIn: PropTypes.func.isRequired,
    onTransitionOut: PropTypes.func.isRequired,
  }

  Board.defaultProps = {
    image: null,
    previousMove: null,
  }