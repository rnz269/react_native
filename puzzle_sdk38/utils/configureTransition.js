import { LayoutAnimation } from 'react-native';

// this function returns a promise that sets Transition State and then
// resolves to configureNext(animation)
export default function configureTransition(onConfigured = () => {}) {
  const animation = LayoutAnimation.create(
    750,
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.opacity,
  );

  // will resolve after waiting .75 seconds
  // configureNext enqueues the animation above to run next time render is called
  return new Promise((resolve) => {
    // configure the next animation
    LayoutAnimation.configureNext(animation);
    // onConfigured() immediately sets new state -> rerender, which renders buttons at opacity of 0 & thus bumps logo to top
    // button opacity animation doesn't occur until this promise resolves, however
    onConfigured();
    // promise is resolved after .75s
    setTimeout(resolve, 750);
  });
}
