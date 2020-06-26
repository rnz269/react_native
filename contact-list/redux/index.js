import redux, {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import allContactsReducer from './allContacts'
import userContactReducer from './userContact'


const rootReducer = combineReducers({
	contacts: allContactsReducer,
	user: userContactReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store