import React from 'react'
import {Provider} from 'react-redux'
import store from './redux'

import AppContainer from './routes'


export default function App() {
  return (
  	<Provider store={store}>
  		<AppContainer />
  	</Provider>
  	)
}

