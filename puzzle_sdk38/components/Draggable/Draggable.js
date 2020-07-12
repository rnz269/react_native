// Draggable with Ref -- works with BoardBookVersion, but doesn't work with BoardMyVersion
import { PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

export default function Draggable(props) {
  const [dragging, setDragging] = useState(false);

  const updatedProps = useRef({ ...props });

  useEffect(() => {
    updatedProps.current = { ...props };
  });

  const panResponder = useRef(
    PanResponder.create({
      // we want this component to become the responder when the enabled prop is true
      onStartShouldSetPanResponder: () => updatedProps.current.enabled,
      // when granted, we want to set dragging to true and magnify
      onPanResponderGrant: () => {
        setDragging(true);
        // call onTouchStart prop to allow parent to animate scale when drag begins
        updatedProps.current.onTouchStart();
      },
      // continously animate puzzle piece position as it's dragged within Board
      onPanResponderMove: (e, gestureState) => {
        // calculate offset, use to call onTouchMove prop. easy, since gestureState tracks
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx,
        };
        // allows us to continuously animate transform of puzzle piece while dragged w/in Board
        updatedProps.current.onTouchMove(offset);
      },
      // when user lifts finger, calculate final offset, use to animate (onTouchMove), decide
      // whether piece exceeds threshold (onTouchEnd)
      onPanResponderRelease: (e, gestureState) => {
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx,
        };
        // setDragging back to false
        setDragging(false);

        updatedProps.current.onTouchMove(offset);
        updatedProps.current.onTouchEnd(offset);
      },
      onPanResponderTerminate: (e, gestureState) => {
        const offset = {
          top: gestureState.dy,
          left: gestureState.dx,
        };
        // setDragging back to false
        setDragging(false);

        updatedProps.current.onTouchMove(offset);
        updatedProps.current.onTouchEnd(offset);
      },
    }),
  ).current;

  return props.children({
    handlers: panResponder.panHandlers,
    dragging,
  });
}

Draggable.propTypes = {
  children: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  enabled: PropTypes.bool,
};

Draggable.defaultProps = {
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  enabled: true,
};
