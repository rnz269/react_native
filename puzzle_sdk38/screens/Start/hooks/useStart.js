import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import configureTransition from '../../../utils/configureTransition';
import sleep from '../../../utils/sleep';

const State = {
  Launching: 'Launching',
  WillTransitionIn: 'WillTransitionIn',
  WillTransitionOut: 'WillTransitionOut',
};

const BOARD_SIZES = [3, 4, 5, 6];

function useStart(onStartGame) {
  // set initial transitionState to launching
  const [transitionState, setTransitionState] = useState(State.Launching);
  const toggleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function triggerAnimation() {
      // only logo appears for first .5 s -- appears in middle
      await sleep(500);
      await configureTransition(() => {
        setTransitionState(State.WillTransitionIn);
      });
      // await keyword suspends progress through async function until promise resolves ^
      // so we only get here once LayoutAnimation fully completes
      // however, the state is updated while waiting for promise to resolve, triggering rerender, so buttons are now rendered (w/ opacity of 0 till animation completes)
      Animated.timing(toggleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }).start();
    }
    triggerAnimation();
    // eslint-disable-next-line
  }, []);

  const handlePressStart = async () => {
    await configureTransition(() => {
      setTransitionState(State.WillTransitionOut);
    });
    // call passed down function to start game
    onStartGame();
  };

  return { transitionState, State, toggleOpacity, buttonOpacity, handlePressStart, BOARD_SIZES };
}

export default useStart;
