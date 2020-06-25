import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator, Linking} from 'react-native'

import ContactListItem from '../components/ContactListItem'
import getURLParams from '../utils/getURLParams'
// import connect from redux
import {connect} from 'react-redux'
// import action creators
import {fetchContactsData} from '../redux'

function Contacts({navigation: {navigate}}) {
	// fetchContacts returns an array of objects
	// each object is a contact w/ props:
	// id, name, avatar, phone, cell, email, favorite 
	// we must map this objects array to ContactListItem array 
	// we perform mapping using FlatList

	// setup state to supply ContactListItem data array
	// Connect only parts of global state we need, init local off global state
	const [contacts, setContacts] = useState(store.getState().contacts)
	const [loading, setLoading] = useState(store.getState().isFetchingContacts) 
	const [error, setError] = useState(store.getState().error)

	// on component mount
	useEffect(()=> {
		// define what cb we want run when store changes
		// this listener fires everytime store.setState is called
		// listener sets local state with store state
		// However, if local state doesn't change, Favorites won't be re-rendered
		const unsubscribe = store.onChange(
			() => {
				setContacts(store.getState().contacts)
				setLoading(store.getState().isFetchingContacts)
				setError(store.getState().error)
			}
		)
		
		async function fetchData() {
			const contacts = await fetchContacts()
			store.setState({ contacts, isFetchingContacts: false })
		}
		// call async function
		fetchData()

		// add deep linking functionality
		async function deepLinking() {
			// when app is running in background, can listen to URL events, and provide handler cb
			Linking.addEventListener('url', handleOpenUrl)
			// when uri accessed externally (app closed), getInitialURL method fired. 
			// pass url obtained to handleOpenUrl.
			const url = await Linking.getInitialURL()
			handleOpenUrl({ url })
		}

		deepLinking()

		// return cleanup function
		return () => {
			Linking.removeEventListener('url', handleOpenUrl)
			unsubscribe()
		}
	}, [])

	const handleOpenUrl = event => {
		const {url} = event
		const params = getURLParams(url)

		if (params.name) {
			const queriedContact = store.getState().contacts.find(contact => (
				contact.name.split(' ')[0].toLowerCase() === params.name.toLowerCase()
				)
			)
			if (queriedContact) {
				navigate('Profile', { id: queriedContact.id })
			}
		}
	}

	// sort data alphabetically
	const contactsSorted = contacts.sort((a,b) => (
		a.name.localeCompare(b.name)
	))

	const keyExtractor = ({id}) => id.toString()
	const renderItem = ({item}) => {
		return (
			<ContactListItem 
				name={item.name}
				avatar={item.avatar}
				phone={item.phone}
				onPress={()=> navigate('Profile', {id: item.id})}
			/>
		)
	}

/**************** RETURNING UI ********************/
	
	// if loading, return spinner
	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size={'large'} animating={loading}/>
			</View>
		)
	}

	// if error, print error message
	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>There was an error retrieving data</Text>
			</View>
			)
	}

	// otherwise render flatlist
	return (
		<View style={styles.container}>
			<FlatList
				data={contactsSorted}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
			/>
		</View>
	)

}

Contacts.navigationOptions = {
	title: 'Contacts',
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	text: {
		textAlign: 'center',
	}
})

// grab state from redux store
function mapStateToProps(state) {
	return {
		contacts: state.contacts,
		loading: state.isFetchingContacts,
		error: state.error,
	}
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)
