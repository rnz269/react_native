import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import ContactThumbnail from '../components/ContactThumbnail'
import DetailListItem from '../components/DetailListItem'

import colors from '../utils/colors'
import store from '../store'

export default function Profile({navigation: {state: {params}}}) {

	// only relevant state in store is contacts
	// whenever local state is changed, component rerenders
	// below, where we extract user from incoming id, incoming id will stay same,
	// but the user object could theoretically change. benefit of using id 
	// id -> we'll pull updated contact here. Before, we received full contact in param
	// which wouldn't have updated
	const [contacts, setContacts] = useState(store.getState().contacts)

	useEffect(()=> {
		const unsubscribe = store.onChange(
			() => {
				setContacts(store.getState().contacts)
			}
		)
		return () => unsubscribe()
	}, [])

	// navigation prop provided by HOC. Contains navigate, state, setParams, goBack
	// destructure state to get params object, which contains one param: id.
	// we'll use this id to find the relevant contact in store
	const {id} = params
	const user = contacts.find(contact => contact.id === id)
	const {name, phone, avatar, email, cell} = user

	return (
		<View style={styles.container}>
			<View style={styles.avatarSection}>
				<ContactThumbnail
					name={name}
					phone={phone}
					avatar={avatar}
				/>
			</View>
			<View style={styles.detailsSection}>
				<DetailListItem
					icon="mail"
					title="email"
					subtitle={email}
				/>
				<DetailListItem
					icon="phone"
					title="Work"
					subtitle={phone}
				/>
				<DetailListItem
					icon="smartphone"
					title="Personal"
					subtitle={cell}
				/>
			</View>
		</View>
	)
}

Profile.navigationOptions = ({navigation: {state: {params}}}) => {
	const {id} = params
	const user = store.getState().contacts.find(contact => contact.id === id)
	const {name} = user
	return {
		title: name.split(' ')[0],
		headerTintColor: 'white',
		headerStyle: {backgroundColor: colors.blue}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	avatarSection: {
		flex: 1,
		backgroundColor: colors.blue,
		justifyContent: 'center',
		alignItems: 'center',
	},
	detailsSection: {
		flex: 1,
		backgroundColor: 'white',
	}
})