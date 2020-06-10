import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'

import ContactListItem from '../components/ContactListItem'
import {fetchContacts} from '../utils/api'

export default function Contacts() {
// fetchContacts returns an array of objects
// each object is a contact w/ props:
// id, name, avatar, phone, cell, email, favorite 
// we must map this objects array to ContactListItem array 
// supply name, avatar, phone, onPress to each CLI

// setup state to capture ContactListItem data array
const [data, setData] = useState([]) 

// on component mount
useEffect(()=> {
	async function fetchData() {
		const data = await fetchContacts()
		setData(data)
	}
	fetchData()
}, [])

useEffect(()=> {
	console.log(data)
}, [data])

return (
	<View>
		<Text>Hello from Contacts.js</Text>
	</View>
)

	
}

const styles = StyleSheet.create({

})