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

  const handleGameChange = (newPuzzle) => {
    setPuzzle(newPuzzle);
  };

  const handleQuit = () => {
    setImage(null);
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
