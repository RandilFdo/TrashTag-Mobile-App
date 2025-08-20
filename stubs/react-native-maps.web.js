// Minimal web stub for react-native-maps to avoid bundling native modules on web
const React = require('react');
const { View } = require('react-native');

function MapView(props) {
  return React.createElement(View, { ...props, style: [ { backgroundColor: '#222' }, props.style ] }, props.children);
}

function Marker({ children }) {
  return React.createElement(View, null, children);
}

function Callout({ children }) {
  return React.createElement(View, null, children);
}

module.exports = MapView;
module.exports.Marker = Marker;
module.exports.Callout = Callout;


