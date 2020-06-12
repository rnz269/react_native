import React, {useState, useEffect} from 'react'
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'

import ContactThumbnail from '../components/ContactThumbnail'

import {fetchUserContact} from '../utils/api'
import colors from '../utils/colors'

export default function User() {

	const [user, setUser] = useState()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(()=> {
		async function getUserContact() {
			try {
				const userLoggedIn = await fetchUserContact()
				setUser(userLoggedIn)
				setLoading(false)
			} catch (e) {
				setError(true)
				setLoading(false)
			}
		}
		getUserContact()
	}, [])

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
				<Text style={styles.text}>There was an error fetching data</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<ContactThumbnail
				name={user.name}
				phone={user.phone}
				avatar={user.avatar}
			 />
		</View>
	)

}

User.navigationOptions = ({navigation: {navigate}}) => ({
	title: 'Me',
	headerStyle: {backgroundColor: colors.blue},
	headerTintColor: 'white',
	headerRight: (
		<MaterialIcons
			name="settings"
			size={24}
			style={{color: "white", marginRight: 10}}
			onPress={() => navigate('Options')}
		/>
	)
})


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.blue,
	},
	text: {
		textAlign: 'center',
	}
})