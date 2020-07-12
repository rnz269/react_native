
// Draggable with Ref -- works with BoardBookVersion, but doesn't work with BoardMyVersion
import { PanResponder } from 'react-native'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'

export default function Draggable(props) {
  
  const [dragging, setDragging] = useState(false)

  // update 7.1: since we have useRef, we're not updating the Pan-handlers after initial render. In other words, we're not using updated props onTouchStart/Move/End, enabled.
  // that means that these handlers belong to the initial render. this is why as soon as we call handleTouchStart, inside handleTouchStart the puzzle (console.log) is old
  // Because 'any function inside a component, including event handlers and effects, sees the props and state from the render it was created in'
  // that's why getting rid of useRef here works: then, our PanResponder will be created upon each render with new handlers that access fresh props and state
  // instead of recreating PanResponder on each render, implemented a solution to access state in oldly defined handler
  const updatedProps = useRef({...props})

  useEffect(()=> {
    updatedProps.current = {...props}
  })

  const panResponder = useRef(
    PanResponder.create({
      // we want this component to become the responder when the enabled prop is true
      onStartShouldSetPanResponder: () => updatedProps.current.enabled,
      // when granted, we want to set dragging to true and magnify
      onPanResponderGrant: () => {
        setDragging(true)
        // call onTouchStart prop to allow parent to animate scale when drag begins
        updatedProps.current.onTouchStart()
      },
      // continously animate puzzle piece position as it's dragged within Board
      onPanResponderMove: (e, gestureState) => {
        // calculate offset, use to call onTouchMove prop. easy, since gestureState tracks
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx
        }
        // allows us to continuously animate transform of puzzle piece while dragged w/in Board
        updatedProps.current.onTouchMove(offset)
      },
      // when user lifts finger, calculate final offset, use to animate (onTouchMove), decide
      // whether piece exceeds threshold (onTouchEnd)
      onPanResponderRelease: (e, gestureState) => {
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx
        }
        // setDragging back to false
        setDragging(false)

        updatedProps.current.onTouchMove(offset)
        updatedProps.current.onTouchEnd(offset)
      },
      onPanResponderTerminate: (e, gestureState) => {
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx
        }
        // setDragging back to false
        setDragging(false)

        updatedProps.current.onTouchMove(offset)
        updatedProps.current.onTouchEnd(offset)
      },
    })
  ).current

  return (
    props.children({
      handlers: panResponder.panHandlers,
      dragging,
    })
  )
}

Draggable.propTypes = {
  children: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  enabled: PropTypes.bool,
}

Draggable.defaultProps = {
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  enabled: true,
}
