
// import utility
import { fetchUserContact } from '../utils/api'

// define our action types
const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN'
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'

// action creators
export function fetchUserBegin() {
	return {
		type: FETCH_USER_BEGIN,
	}
}

export function fetchUserSuccess(user) {
	return {
		type: FETCH_USER_SUCCESS,
		payload: user,
	}
}

export function fetchUserFailure(error) {
	return {
		type: FETCH_USER_FAILURE,
		payload: error,
	}
}

export function fetchUserData() {
	return (dispatch, getState) => {
		dispatch(fetchUserBegin())
		fetchUserContact()
		.then(res => dispatch(fetchUserSuccess(res)))
		.catch(error => dispatch(fetchUserFailure(error)))
	}
}

const initialState = {
	isLoading: false,
	data: {},
	error: null
}

export default function userContactReducer (state = initialState, action) {
	switch (action.type) {
		case FETCH_USER_BEGIN:
			return {
				...state,
				isLoading: true,
			}
		case FETCH_USER_SUCCESS:
			return {
				...state,
				data: action.payload,
				isLoading: false,
			}
		case FETCH_USER_FAILURE:
			return {
				...state,
				isLoading: false,
				error: error.payload,
			}
		default: return state
	}
}