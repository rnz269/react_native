import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'

import ContactListItem from '../components/ContactListItem'
import {fetchContacts} from '../utils/api'

export default function Contacts({navigation: {navigate}}) {
	// fetchContacts returns an array of objects
	// each object is a contact w/ props:
	// id, name, avatar, phone, cell, email, favorite 
	// we must map this objects array to ContactListItem array 
	// we perform mapping using FlatList

	// setup state to capture ContactListItem data array
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true) 
	const [error, setError] = useState(false)

	// on component mount
	useEffect(()=> {
		async function fetchData() {
			try {
				const data = await fetchContacts()
				setData(data)
				setLoading(false)
			}
			catch (e) {
				setError(true)
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	// sort data alphabetically
	const dataSorted = data.sort((a,b) => (
		a.name.localeCompare(b.name)
	))

	const keyExtractor = ({id}) => id.toString()
	const renderItem = ({item}) => {
		return (
			<ContactListItem 
				name={item.name}
				avatar={item.avatar}
				phone={item.phone}
				onPress={()=> navigate('Profile')}
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
				data={dataSorted}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
			/>
		</View>
	)

	
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