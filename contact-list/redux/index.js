import redux, {createStore, combineReducers, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import allContactsReducer from './allContacts'
import userContactReducer from './userContact'


const rootReducer = combineReducers({
	contacts: allContactsReducer,
	user: userContactReducer,
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store