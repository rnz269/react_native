import { calculateItemSize, itemMargin } from '../utils/grid';

// calculates styles for each tile
const calculateItemStyle = (square, size, animatedValues) => {
  // calculate item size
  const itemSize = calculateItemSize(size);
  const itemStyle = {
    // position absolute so we can fit exactly where we want within parent
    position: 'absolute',
    width: itemSize,
    height: itemSize,
    overflow: 'hidden',
    // animatedValues tells us where square should position within parent grid based on index
    transform: [
      { translateX: animatedValues.current[square].left },
      { translateY: animatedValues.current[square].top },
      { scale: animatedValues.current[square].scale },
    ],
  };
  // full picture put into a square would show only top left part of picture
  // however, we can push the image up and over w/ translate to show specific subset
  const imageStyle = {
    position: 'absolute', // so we can fit exactly where we want within parent
    // make the image take up the space of the entire grid
    width: itemSize * size + (itemMargin * size - 1),
    height: itemSize * size + (itemMargin * size - 1),
    // translateX and Y shows a specific subset of the image
    transform: [
      { translateX: -Math.floor(square % size) * (itemSize + itemMargin) },
      { translateY: -Math.floor(square / size) * (itemSize + itemMargin) }, // for translateY, negative pushes up, positive pushes down
    ],
  };

  return [itemStyle, imageStyle];
};

export default calculateItemStyle;
