import React, {useState, useEffect, useLayoutEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import ContactThumbnail from '../components/ContactThumbnail'
import DetailListItem from '../components/DetailListItem'
// import connect from redux
import {connect} from 'react-redux'
import colors from '../utils/colors'

function Profile({contacts: {data}, navigation, navigation: {state: {params}}}) {

	const getContact = () => {
		const {id} = params
		const user = data.find(contact => contact.id === id)
		return user
	}

	const [user, setUser] = useState(getContact)
	// navigation prop provided by HOC. Contains navigate, state, setParams, goBack
	// destructure state to get params object, which contains one param: id.
	// we'll use this id to find the relevant contact in store
	useLayoutEffect(()=> {
		navigation.setParams({
			user: user,
		})
	}, [])

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
	const {id, user} = params

	return {
		title: user ? user.name.split(' ')[0] : '',
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

// get state from redux store
const mapStateToProps = (globalState) => ({
	contacts: globalState.contacts,
})

export default connect(mapStateToProps, {})(Profile)