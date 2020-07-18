import React from 'react';
import { requireNativeComponent, processColor, ColorPropType, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// we create a PieChart component to wrap the native component. allows us to modify props before passing to native component.
// we need to modify two props: data (need to convert color to native color spec), and style (need to override native's default black background)
export default function PieChart({ style, data, ...rest }) {
  const processedData = data.map((item) => ({
    value: item.value,
    color: processColor(item.color),
  }));
  return <NativePieChart {...rest} style={[styles.container, style]} data={processedData} />;
}

// import component from native code
const NativePieChart = requireNativeComponent('PieChart', PieChart);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      color: ColorPropType,
    }),
  ).isRequired,
  strokeWidth: PropTypes.number,
  strokeColor: ColorPropType,
  ...ViewPropTypes,
};

PieChart.defaultProps = {
  strokeWidth: 0,
  strokeColor: 'transparent',
};
