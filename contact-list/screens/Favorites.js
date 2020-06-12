import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'

import ContactThumbnail from '../components/ContactThumbnail'

import {fetchContacts} from '../utils/api'
import store from '../store'

// Favorites not a child of Contacts, so no way to pass data prop
// Also, since this will be a different tab, no access to navigation prop
// therefore, we must re-call API
export default function Favorites({navigation: {navigate}}) {

	const [contacts, setContacts] = useState(store.getState().contacts)
	const [loading, setLoading] = useState(store.getState().isFetchingContacts)
	const [error, setError] = useState(store.getState().error)

	useEffect(()=> {
		// define our new change listener. on change of store state, we update local state
		// this listener fires everytime store changes, leading us to set local state with
		// store state. However, if local state doesn't change, Favorites won't be re-rendered
		const unsubscribe = store.onChange(
			() => {
				setContacts(store.getState().contacts)
				setLoading(store.getState().isFetchingContacts)
				setError(store.getState().error)
			}
		)

		// define async function
		async function fetchContacts() {
				const fetchedContacts = await fetchContacts()
				store.setState({
					contacts: fetchedContacts,
					isFetchingContacts: false,
				})
		}
		// call async function if needed
		if (contacts.length === 0) {
			fetchContacts()
		}
		// return cleanup function
		return ()=> unsubscribe ()
	}, [])

	const keyExtractor = ({id}) => id.toString()
	const renderItem = ({item}) => {
		const {avatar} = item
		return (
			<ContactThumbnail
				avatar={avatar}
				onPress={() => {navigate('Profile', {id: item.id})}}
			/>
		)
	}

	// assemble our favorites array
	const favorites = contacts.filter(contact => contact.favorite)
	// sort our data array
	const favoritesSorted = favorites.sort((a,b)=> (
		a.name.localeCompare(b.name)
	))


	/* RETURN JSX */

	if (loading) {
		return (
		<View style={styles.container}>
			<ActivityIndicator size={'large'} animating={loading} />
		</View>
		)
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.list}>There was an error fetching data</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<FlatList
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				data={favoritesSorted}
				numColumns={3}
				contentContainerStyle={styles.list}
			/>
		</View>
	)
}

Favorites.navigationOptions = {
	title: 'Favorites',
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
	}, 
	list: {
		alignItems: 'center',
	}
})