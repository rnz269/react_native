import React, {useState, useEffect, useLayoutEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import ContactThumbnail from '../components/ContactThumbnail'
import DetailListItem from '../components/DetailListItem'
// import connect from redux
import {connect} from 'react-redux'
import colors from '../utils/colors'

function Profile({contacts: {data}, navigation, navigation: {state: {params}}}) {
	// use name (navigation prop) to immediately load header title on page load
	// then, use id to grab updated stuff. Name should be same. Could implement a check & re-render if wanting to be safe.
	const {id} = params
	const user = data.find(contact => contact.id === id)
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
	const {id, name} = params

	return {
		title: name,
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