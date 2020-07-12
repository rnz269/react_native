import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { calculateItemPosition, calculateContainerSize } from '../../../utils/grid';
import { getIndex } from '../../../utils/puzzle';
import { updateSquarePosition } from '../../../utils/handlers';

// define finite state machine
const State = {
  WillTransitionIn: 'WillTransitionIn',
  DidTransitionIn: 'DidTransitionIn',
  DidTransitionOut: 'DidTransitionOut',
};

const useBoard = (puzzle, onTransitionIn, previousMove) => {
  const animatedValues = useRef(null);
  const squareScale = useRef(null);
  const squareTop = useRef(null);
  const squareLeft = useRef(null);

  // runs only once, before anything else in Board (acts like constructor)
  // useRef returns an obj w/ a current property pointing to useRef's arg (false)
  const hasBeenCalled = useRef(false);

  if (!hasBeenCalled.current) {
    // destructure
    const { size, board } = puzzle;
    const temp = [];

    // board is our array describing current board state e.g. [0,3,2,1,4,5,7,8,6]
    // where first three indices span top row left to right
    board.forEach((square, index) => {
      // pass in size (3x3) and index of square (0), computes top & left of tile in grid
      const { top, left } = calculateItemPosition(size, index);
      // useRef can't be init in useEffect, and is required for Animated values
      // in functional components. So, we init useRef outside, use them here:
      squareScale.current = new Animated.Value(1);
      squareTop.current = new Animated.Value(top);
      squareLeft.current = new Animated.Value(left);

      temp[square] = {
        scale: squareScale.current,
        top: squareTop.current,
        left: squareLeft.current,
      };
    });

    animatedValues.current = temp;
    hasBeenCalled.current = true;
  }

  const [transitionState, setTransitionState] = useState(State.WillTransitionIn);

  // useEffect will rerun after each render phase w/ change in transitionState
  useEffect(() => {
    if (transitionState === State.WillTransitionIn) {
      setTransitionState(State.DidTransitionIn);
      onTransitionIn();
    }
  }, [transitionState, onTransitionIn]);

  // after board state has updated, we run this effect to physically move pieces on board
  useEffect(() => {
    // previousMove contains a square. let's get this square's updated index & update position
    async function update() {
      const squareIndex = getIndex(puzzle, previousMove);
      await updateSquarePosition(puzzle, animatedValues, previousMove, squareIndex);
    }
    // don't update on first render, as useEffect usually does
    if (previousMove !== null) {
      update();
    }
  }, [puzzle, animatedValues, previousMove]);

  // style objects for size of container, items
  const containerSize = calculateContainerSize();
  const containerStyle = {
    width: containerSize,
    height: containerSize,
  };

  return { animatedValues, transitionState, State, containerStyle };
};

export default useBoard;
