import {useRef} from 'react'

const useConstructor = callback => {
	// useRef returns an obj w/ a current property pointing to useRef's arg (false)
	const hasBeenCalled = useRef(false)
	if (!hasBeenCalled.current) {
		callback()
		hasBeenCalled.current = true
	}
}