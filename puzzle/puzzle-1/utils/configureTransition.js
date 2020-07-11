import { LayoutAnimation, Platform } from 'react-native';

// this function returns a promise that sets Transition State and then 
// resolves to configureNext(animation)
export default function configureTransition(onConfigured = () => {}) {
  const animation = LayoutAnimation.create(
    750,
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.opacity,
  );

// will resolve after waiting .75 seconds
  const promise = new Promise(resolve => {
    // Workaround for missing LayoutAnimation callback support on Android
    if (Platform.OS === 'android') {
      // configure the next animation
      LayoutAnimation.configureNext(animation);
      // promise is resolved after .75s
      setTimeout(resolve, 750);
    } else {
      LayoutAnimation.configureNext(animation);
      // for some reason, callback to configureNext wasn't working on iOS, so:
      setTimeout(resolve, 750);
    }
  });

// this will be a setTransitionState function
// will execute btw time we call create and time we schedule the animation with configureNext
// this doesn't appear to be true ^
  onConfigured();
  return promise;
}
