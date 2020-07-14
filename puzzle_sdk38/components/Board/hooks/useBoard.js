import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import { calculateItemPosition, calculateContainerSize } from '../../../utils/grid';
import { getIndex } from '../../../utils/puzzle';
import { updateSquarePosition } from '../helpers/handlers';

// define finite state machine
const State = {
  WillTransitionIn: 'WillTransitionIn',
  DidTransitionIn: 'DidTransitionIn',
  DidTransitionOut: 'DidTransitionOut',
};

const useBoard = (puzzle, onTransitionIn, previousMove, teardown, onTransitionOut) => {
  const animatedValues = useRef(null);
  const squareScale = useRef(null);
  const squareTop = useRef(null);
  const squareLeft = useRef(null);

  // runs only once, before anything else in Board (acts like constructor)
  const hasBeenCalled = useRef(false);
  if (!hasBeenCalled.current) {
    // destructure
    const { size, board } = puzzle;
    const temp = [];

    const height = Dimensions.get('window').height;

    // board is our array describing current board state e.g. [0,3,2,1,4,5,7,8,6]
    // where first three indices span top row left to right
    board.forEach((square, index) => {
      // pass in size (3x3) and index of square (0), computes top & left of tile in grid
      const { top, left } = calculateItemPosition(size, index);
      // useRef can't be init in useEffect, and is required for Animated values
      // in functional components. So, we init useRef outside, use them here:
      squareScale.current = new Animated.Value(1);
      squareTop.current = new Animated.Value(top + height);
      squareLeft.current = new Animated.Value(left);

      temp[square] = {
        scale: squareScale.current,
        top: squareTop.current, // want the puzzle pieces to render offscreen to begin
        left: squareLeft.current,
      };
    });

    animatedValues.current = temp;
    hasBeenCalled.current = true;
  }

  // define helper function for initially animating squares on the board
  const animateAllSquares = useCallback(
    (visible) => {
      const { board, size } = puzzle;

      const height = Dimensions.get('window').height;

      const animations = board.map((square, index) => {
        const { top } = calculateItemPosition(size, index);

        return Animated.timing(animatedValues.current[square].top, {
          toValue: visible ? top : top + height,
          duration: 400,
          delay: 800 * (index / board.length),
          easing: visible ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
          useNativeDriver: true,
        });
      });

      return new Promise((resolve) => Animated.parallel(animations).start(resolve));
    },
    [puzzle],
  );

  // SETUP
  // initialize transition state to WillTransitionIn
  const [transitionState, setTransitionState] = useState(State.WillTransitionIn);

  // Upon state being set to WillTransitionIn, call helper, then set state to DidTransitionIn
  useEffect(() => {
    async function setup() {
      await animateAllSquares(true);
      setTransitionState(State.DidTransitionIn);
      onTransitionIn();
    }
    if (transitionState === State.WillTransitionIn) {
      setup();
    }
  }, [transitionState, onTransitionIn, animateAllSquares]);

  // CLEANUP
  // when teardown prop changes to true, want to run effect to disappear squares and transition out
  useEffect(() => {
    async function endGame() {
      await animateAllSquares(false);
      setTransitionState(State.DidTransitionOut);
      onTransitionOut();
    }
    if (teardown) {
      endGame();
    }
  }, [teardown, onTransitionOut, animateAllSquares]);

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
