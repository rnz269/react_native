
// correct
import { PanResponder } from 'react-native'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'

export default function Draggable({children, onTouchStart, onTouchMove, onTouchEnd, enabled}) {
  
  const [dragging, setDragging] = useState(false)

  // want panResponder created on mount, and to persist its values (and prevent re-initialization)
  // ^ actually, we don't want it to persist. we don't want useRef. That keeps these tiles where they initialized.
  // we want this component to receive positioning instructions from Board
  const panResponder = PanResponder.create({
      // we want this component to become the responder when the enabled prop is true
      onStartShouldSetPanResponder: () => enabled,
      // when granted, we want to set dragging to true and magnify
      onPanResponderGrant: () => {
        setDragging(true)
        // call onTouchStart prop to allow parent to animate scale when drag begins
        onTouchStart()
      },
      // continously animate puzzle piece position as it's dragged within Board
      onPanResponderMove: (e, gestureState) => {
        // calculate offset, use to call onTouchMove prop. easy, since gestureState tracks
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx
        }
        // allows us to continuously animate transform of puzzle piece while dragged w/in Board
        onTouchMove(offset)
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

        onTouchMove(offset)
        onTouchEnd(offset)
      },
      onPanResponderTerminate: (e, gestureState) => {
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx
        }
        // setDragging back to false
        setDragging(false)

        onTouchMove(offset)
        onTouchEnd(offset)
      },
    })

  return (
    children({
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
