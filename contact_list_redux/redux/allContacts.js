
// import utility
import { fetchContacts } from '../utils/api'

// define our action types
const FETCH_CONTACTS_BEGIN = 'FETCH_CONTACTS_BEGIN'
const FETCH_CONTACTS_SUCCESS = 'FETCH_CONTACTS_SUCCESS'
const FETCH_CONTACTS_FAILURE = 'FETCH_CONTACTS_FAILURE'

// action creators
export function fetchContactsBegin() {
	return {
		type: FETCH_CONTACTS_BEGIN,
	}
}

export function fetchContactsSuccess(contacts) {
	return {
		type: FETCH_CONTACTS_SUCCESS,
		payload: contacts,
	}
}

export function fetchContactsFailure(error) {
	return {
		type: FETCH_CONTACTS_FAILURE,
		payload: error,
	}
}

export function fetchContactsData() {
	return (dispatch, getState) => {
		dispatch(fetchContactsBegin())
		fetchContacts()
		.then(res => dispatch(fetchContactsSuccess(res)))
		.catch(error => dispatch(fetchContactsFailure(error)))
	}
}

const initialState = {
	isLoading: false,
	data: [],
	error: null
}

export default function allContactsReducer (state = initialState, action) {
	switch (action.type) {
		case FETCH_CONTACTS_BEGIN:
			return {
				...state,
				isLoading: true,
			}
		case FETCH_CONTACTS_SUCCESS:
			return {
				...state,
				data: action.payload,
				isLoading: false,
			}
		case FETCH_CONTACTS_FAILURE:
			return {
				...state,
				isLoading: false,
				error: error.payload,
			}
		default: return state
	}
}