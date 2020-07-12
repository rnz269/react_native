import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import ContactThumbnail from '../components/ContactThumbnail'
import DetailListItem from '../components/DetailListItem'

import { fetchRandomContact } from '../utils/api'
import colors from '../utils/colors'

export default function Profile({navigation: {state: {params}}}) {

	// navigation prop provided by HOC. Contains navigate, state, setParams, goBack
	// destructure state to get params object, which contains one param: contacts.
	const {contact} = params
	const {name, phone, avatar, email, cell} = contact

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
	const {contact: {name}} = params
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