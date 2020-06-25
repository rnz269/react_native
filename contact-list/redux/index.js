import redux, {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import { fetchContacts, fetchUserContact } from '../utils/api'

// action creators
export function fetchContactsData() {
	// can use redux-thunk to return a function
	return (dispatch) => {
		fetchContacts()
		.then(res => dispatch({
			type: "FETCH_CONTACTS_DATA",
			payload: res,
		}))
	}
}
export function fetchUserContact() {
	// can use redux-thunk to return a function
	return (dispatch) => {
		fetchUserContact()
		.then(res => dispatch({
			type: "FETCH_USER_CONTACT",
			payload: res,
		}))
	}
}

// initialState
const initialState = {
	isFetchingContacts: true,
	isFetchingUser: true,
	contacts: [],
	user: {},
	error: false,
}

// reducer
function reducer(state = initialState, action) {
	switch (action.type) {
		case "FETCH_CONTACTS_DATA":
			return {
				...state,
				isFetchingContacts: false,
				contacts: action.payload,
			}
		case "FETCH_USER_CONTACT":
			return {
				...state,
				isFetchingUser: false,
				user: action.payload
			}
		default: return state
	}
}

const store = createStore(reducer, applyMiddleware)

export default store