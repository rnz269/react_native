import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import React, {useState, useEffect, useRef} from 'react'

import { move, movableSquares, isSolved } from '../utils/puzzle'
import Board from '../components/Board'
import Button from '../components/Button'
import PuzzlePropType from '../validators/PuzzlePropType'
import Preview from '../components/Preview'
import Stats from '../components/Stats'
import configureTransition from '../utils/configureTransition'

const State = {
  LoadingImage: 'LoadingImage',
  WillTransitionIn: 'WillTransitionIn',
  RequestTransitionOut: 'RequestTransitionOut',
  WillTransitionOut: 'WillTransitionOut',
}

export default function Game({puzzle, image, onChange, onQuit}) {
  const [moves, setMoves] = useState(0)
  const [previousMove, setPreviousMove] = useState(null)
  const [transitionState, setTransitionState] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  // if image hadn't loaded by time we setTransitionState above, then we should be receiving
  // an updated prop from App once image loads
  useEffect(()=> {
    if (!image) {
      configureTransition(() => {
        setTransitionState(State.LoadingImage)
      })
    } else {
      configureTransition(() => {
        setTransitionState(State.WillTransitionIn)
      })
    }
  }, [image])

  // start timer when timerRunning is true
  useEffect(()=> {
    if (timerRunning) {
      setTimeout (() => {
        setElapsed(prevElapsed => prevElapsed + 1)
      }, 1000)
    }
  }, [timerRunning, elapsed])
  
  // set timerRunning to true to start timer
  // should be called after Board calls DidTransitionIn
  const handleBoardTransitionIn = () => {
    // set relevant Game state here
    setTimerRunning(true)
  }

  // stop timer, transition state to RequestTransitionOut
  const requestTransitionOut = () => {
    // equivalent to clearing out interval if using setInterval
    setTimerRunning(false)
    setTransitionState(State.RequestTransitionOut) 
    // should trigger Board destruction via teardown
    // at end of Board's destruction, Board calls handleBoardTransitionOut below
  }

  const handleBoardTransitionOut = async () => {
    // Game progresses to last phase, transitioning out, via LayoutAnimation
    // disappears gradually
    await configureTransition (() => {
      setTransitionState(State.WillTransitionOut)
    })
    onQuit()
  }

const handlePressQuit = () => {
  // pop up alert to confirm quit
  Alert.alert (
    'Quit',
    'Do you want to quit and lose progress on this puzzle?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Quit',
        style: 'destructive',
        onPress: requestTransitionOut,
      } 
    ]
  )
}

  const handlePressSquare = square => {
    // if square is not adjacent to open space, we abort
    if (!movableSquares(puzzle).includes(square)) return

    // otherwise, we move
    const updated = move(puzzle, square)
    // update local state (# moves, moved square)
    setMoves(moves => moves + 1)
    setPreviousMove(square)

    // call App's cb function to update puzzle state
    onChange(updated)

    // if board is solved, request transition out
    if (isSolved(updated)) {
      requestTransitionOut()
    }
  }

    return (
      transitionState && transitionState !== State.WillTransitionOut && (
      <View style={styles.container}>
        {transitionState === State.LoadingImage && (
          <ActivityIndicator size='large' color={'rgba(255, 255, 255, 0.5)'}/>
        )}
        {transitionState !== State.LoadingImage && (
          <View style={styles.centered}>
            <View style={styles.header}>
              <Preview image={image} boardSize={puzzle.size}/>
              <Stats time={elapsed} moves={moves} />
            </View>
            <Board
              puzzle={puzzle}
              teardown={transitionState === State.RequestTransitionOut}
              image={image}
              previousMove={previousMove}
              onMoveSquare={handlePressSquare}
              onTransitionIn={handleBoardTransitionIn}
              onTransitionOut={handleBoardTransitionOut}
            />
            <Button title='Quit' onPress={handlePressQuit}/>
          </View>
        )}
      </View>
    )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 16,
    alignSelf: 'stretch',
  },
})

Game.propTypes = {
    puzzle: PuzzlePropType.isRequired,
    image: Image.propTypes.source,
    onChange: PropTypes.func.isRequired,
    onQuit: PropTypes.func.isRequired,
  }

Game.defaultProps = {
    image: null,
  }