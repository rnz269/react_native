import { Animated } from 'react-native';
import { availableMove } from '../../../utils/puzzle';
import { calculateItemSize, calculateItemPosition, itemMargin } from '../../../utils/grid';
import clamp from '../../../utils/clamp';

// this file contains handler functions that will be passed to Draggable (and update tile position function)
export const updateSquarePosition = (puzzle, animatedValues, square, index) => {
  const { size } = puzzle;
  const { top, left } = calculateItemPosition(size, index);
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
  ];
  // Animated.Parallel lets you know when when all events have completed
  // Animated.parallel takes [] of animations & returns an obj. w/ start(callback) method
  // callback called when EVERY animation in [] has completed
  // to make updateSquarePosition easier to use, making it return promise
  return new Promise((resolve) => Animated.parallel(animations).start(resolve));
};

// upon initial touch, magnify to 1.1x size
export const handleTouchStart = (animatedValues, square) => {
  Animated.spring(animatedValues.current[square].scale, {
    toValue: 1.1,
    friction: 20,
    tension: 200,
    useNativeDriver: true,
  }).start();
};

// square and index provided by renderSquare, while offset provided by Draggable
// what we're trying to do is make the square follow the finger (finger = top,left)
export const handleTouchMove = (puzzle, animatedValues, square, index, { top, left }) => {
  const { size } = puzzle;
  const itemSize = calculateItemSize(size);
  const move = availableMove(puzzle, square);
  // Calculate tile's initial position based on index in puzzle's board []. rename return vars
  const { top: initialTop, left: initialLeft } = calculateItemPosition(size, index);
  // furthest box should be able to move is one item's size in any direction
  const distance = itemSize + itemMargin;

  // clamp ensures item isn't moved past borders, or over filled tile. leaves obj. as is unless < min or > max
  // clamp accepts 3 args: top (finger's offset dy), min, max
  // so if move === 'up', min is -size, max is 0 => can move up one tile, can't move down
  const clampedTop = clamp(top, move === 'up' ? -distance : 0, move === 'down' ? distance : 0);
  const clampedLeft = clamp(left, move === 'left' ? -distance : 0, move === 'right' ? distance : 0);
  // setValue is a function exposed on the new Animated.Value() instance, allowing external
  // code to control the internal value of instance w/o triggering animations of interim states
  // ~ setValue starts animation -> jump to specific value, which is better than .spring for slow devices
  animatedValues.current[square].top.setValue(initialTop + clampedTop);
  animatedValues.current[square].left.setValue(initialLeft + clampedLeft);
};

// scale piece back to orig. size, detect whether endpt. > threshold, reposition accordingly
export const handleTouchEnd = (onMoveSquare, puzzle, animatedValues, square, index, { top, left }) => {
  const { size } = puzzle;
  // bring scale back down to 1
  Animated.spring(animatedValues.current[square].scale, {
    toValue: 1,
    friction: 20,
    tension: 200,
    useNativeDriver: true,
  }).start();

  // calculate threshold
  const itemSize = calculateItemSize(size);
  const threshold = itemSize / 2;

  // only 1 of these directions will be nonzero, due to handleTouchMove's clamp, so fine to +
  const displacement = Math.abs(top + left);

  if (displacement > threshold) {
    // triggers new puzzle state w/ new move. doesn't actually move it into new place, though
    // new puzzle state will be passed back down, recognized in useEffect, which calls
    // updateSquarePosition with the new puzzle state
    onMoveSquare(square);
  } else {
    // move piece back to original spot pre-drag
    updateSquarePosition(puzzle, animatedValues, square, index);
  }
};
