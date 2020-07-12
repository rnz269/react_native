import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator, Linking} from 'react-native'

import ContactListItem from '../components/ContactListItem'
import getURLParams from '../utils/getURLParams'
// import connect from redux
import {connect} from 'react-redux'
// import action creators
import { fetchContactsData } from '../redux/allContacts'

function Contacts({dispatch, contacts: {isLoading, data, error}, navigation: {navigate}}) {
	// fetchContactsData returns an array of objects
	// each object is a contact w/ props: id, name, avatar, phone, cell, email, favorite
	// we must map this objects array to array of ContactListItem components, via Flatlist

	// on component mount
	useEffect(()=> {
		// send action to store to fetch contacts data
		dispatch(fetchContactsData())

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
		}
	}, [])

	const handleOpenUrl = event => {
		const {url} = event
		const params = getURLParams(url)

		if (params.name) {
			const queriedContact = data.find(contact => (
				contact.name.split(' ')[0].toLowerCase() === params.name.toLowerCase()
				)
			)
			if (queriedContact) {
				navigate('Profile', { id: queriedContact.id, name: queriedContact.name[0] })
			}
		}
	}

	// sort data alphabetically
	const contactsSorted = data.sort((a,b) => (
		a.name.localeCompare(b.name)
	))

	const keyExtractor = ({id}) => id.toString()
	const renderItem = ({item}) => {
		return (
			<ContactListItem 
				name={item.name}
				avatar={item.avatar}
				phone={item.phone}
				onPress={()=> navigate('Profile', {id: item.id, name: item.name})}
			/>
		)
	}

/**************** RETURNING UI ********************/
	
	// if loading, return spinner
	if (isLoading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size={'large'} animating={isLoading}/>
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

/**************** COMPONENT NAVIGATION OPTIONS, STYLES, REDUX ********************/

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
const mapStateToProps = (globalState) => ({
	contacts: globalState.contacts
})

// don't pass mapDispatchToProps => receive dispatch
export default connect(mapStateToProps)(Contacts)
