let state = {
  isFetchingContacts: false,
  isFetchingUser: false,
  contacts: [],
  user: {},
  error: false,
};

const listeners = [];

export default {
  getState() {
    return state;
  },
  setState(newState) {
    state = { ...state, ...newState };
    // critical line. this is how onChange works. onChange pushes new callback to listener array
    // then when any component calls store.setState, all of the callbacks in listener are called
    listeners.forEach(listener => listener());
  },
  onChange(newListener) {
    listeners.push(newListener);
    // return function to remove listener on unmount (cleanup function)
    return () =>
      listeners.filter(listener => listener !== newListener);
  },
};
