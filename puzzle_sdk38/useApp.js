import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { createPuzzle } from './utils/puzzle';
import { getRandomImage } from './utils/api';

function useApp() {
  const [size, setSize] = useState(3);
  const [puzzle, setPuzzle] = useState(null);
  const [image, setImage] = useState(null);

  async function preloadNextImage() {
    const randImage = await getRandomImage();
    Image.prefetch(randImage.uri);
    setImage(randImage);
  }

  useEffect(() => {
    preloadNextImage();
  }, []);

  const handleChangeSize = (boardSize) => {
    setSize(boardSize);
  };

  const handleStartGame = () => {
    setPuzzle(createPuzzle(size));
  };

  // memoize since this is used in Game's handlePressSquare memoized cb, which is used in memoized Board component
  // actually, memoizing this function would only save renders if App rerendered a lot.
  // App only rerenders when puzzle pieces are moved, which should (and does) rerender children
  const handleGameChange = (newPuzzle) => {
    setPuzzle(newPuzzle);
  };

  // no need to memoize this either
  // we're memoizing Board due to Game's timer updates. However, Game rerendering doesn't
  // mean it's receiving new props from App, since App isn't rerendering.
  const handleQuit = () => {
    setImage(null);
    setPuzzle(null);
    preloadNextImage();
  };

  return {
    size,
    handleStartGame,
    handleChangeSize,
    puzzle,
    image,
    handleGameChange,
    handleQuit,
  };
}

export default useApp;
