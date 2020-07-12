import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'
import colors from '../utils/colors'


import ContactThumbnail from '../components/ContactThumbnail'
import {fetchContacts} from '../utils/api'

// Favorites not a child of Contacts, so no way to pass data prop
// Also, since this will be a different tab, no access to navigation prop
// therefore, we must re-call API
export default function Favorites({navigation: {navigate}}) {

	const [contacts, setContacts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(()=> {
		// define async function
		async function fetchFavorites() {
			try {
				const data = await fetchContacts()
				const favorites = data.filter(contact => contact.favorite)
				setContacts(favorites)
				setLoading(false)
			} catch (e) {
				setError(true)
				setLoading(false)
			}
		}
		// call async function
		fetchFavorites()
	}, [])

	const keyExtractor = ({id}) => id.toString()
	const renderItem = ({item}) => {
		const {avatar} = item
		return (
			<ContactThumbnail
				avatar={avatar}
				onPress={() => {navigate('Profile', {contact: item})}}
			/>
		)
	}

	// sort our data array
	const contactsSorted = contacts.sort((a,b)=> (
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
				data={contactsSorted}
				numColumns={3}
				contentContainerStyle={styles.list}
			/>
		</View>
	)
}

Favorites.navigationOptions = ({navigation: {openDrawer}}) => ({
	title: 'Favorites',
	headerLeft: (
		<MaterialIcons
			name='menu'
			size={24}
			style={{color: colors.black, marginLeft: 10}}
			onPress={() => openDrawer()}
		/>
	)
})

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