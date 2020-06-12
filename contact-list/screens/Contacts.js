import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'

import ContactListItem from '../components/ContactListItem'
import {fetchContacts} from '../utils/api'
import store from '../store'

export default function Contacts({navigation: {navigate}}) {
	// fetchContacts returns an array of objects
	// each object is a contact w/ props:
	// id, name, avatar, phone, cell, email, favorite 
	// we must map this objects array to ContactListItem array 
	// we perform mapping using FlatList

	// setup state to capture ContactListItem data array
	const [contacts, setContacts] = useState(store.getState().contacts)
	const [loading, setLoading] = useState(store.getState().isFetchingContacts) 
	const [error, setError] = useState(store.getState().error)

	// on component mount
	useEffect(()=> {
		// define our new change listener. on change of store state, we update local state.
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
		// return cleanup function
		return unsubscribe
	}, [])

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
				onPress={()=> navigate('Profile', {contact: item})}
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