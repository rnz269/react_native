import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import ContactThumbnail from '../components/ContactThumbnail'
import DetailListItem from '../components/DetailListItem'

import { fetchRandomContact } from '../utils/api'
import colors from '../utils/colors'

export default function Profile() {

	const [contact, setContact] = useState()

	useEffect(()=> {
		async function fetchContact () {
			const person = await fetchRandomContact()
			console.log(person)
			setContact(person)
		}
		fetchContact()
	}, [])

	if (!contact) {
		return (<View></View>)
	}

	return (
		<View style={styles.container}>
			<View style={styles.avatarSection}>
				<ContactThumbnail
					name={contact.name}
					phone={contact.phone}
					avatar={contact.avatar}
				/>
			</View>
			<View style={styles.detailsSection}>
				<DetailListItem
					icon="mail"
					title="email"
					subtitle={contact.email}
				/>
				<DetailListItem
					icon="phone"
					title="Work"
					subtitle={contact.phone}
				/>
				<DetailListItem
					icon="smartphone"
					title="Personal"
					subtitle={contact.cell}
				/>
			</View>
		</View>
	)
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