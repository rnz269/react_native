import { useRef } from 'react'
import { calculateItemPosition } from '../utils/grid';
import { Animated } from 'react-native';

// runs only once, before anything else in Board (acts like constructor)
const useBoardSetup = puzzle => {
	const animatedValues = useRef(null)
	const squareScale = useRef(null)
	const squareTop = useRef(null)
	const squareLeft = useRef(null)
	// useRef returns an obj w/ a current property pointing to useRef's arg (false)
	const hasBeenCalled = useRef(false)

	if (!hasBeenCalled.current) {
		// destructure
		const {size, board} = puzzle
		const temp = []

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
		hasBeenCalled.current = true
	}
	return animatedValues
}

export default useBoardSetup