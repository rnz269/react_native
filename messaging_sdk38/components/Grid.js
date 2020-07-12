import React from "react";
import { Dimensions, PixelRatio, FlatList, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default function Grid(props) {
  // used to customize the style of each item rendered, depending on its location in photo grid
  const renderGridItem = (info) => {
    const { renderItem, numColumns, itemMargin } = props;
    const { width } = Dimensions.get("window");
    const { index } = info;
    // PixelRatio used below to assign an integer value to align to the device's physical pixels
    // size is pixel width of each item in grid
    const size = PixelRatio.roundToNearestPixel(
      (width - itemMargin * (numColumns - 1)) / numColumns
    );

    // don't want first item of each row to have a marginLeft
    const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

    // don't want first row to have a marginTop
    const marginTop = index < numColumns ? 0 : itemMargin;

    return renderItem({ ...info, size, marginLeft, marginTop });
  };

  return <FlatList {...props} renderItem={renderGridItem} />;
}

Grid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  numColumns: PropTypes.number,
  itemMargin: PropTypes.number,
};

Grid.defaultProps = {
  numColumns: 4,
  itemMargin: StyleSheet.hairlineWidth,
};
