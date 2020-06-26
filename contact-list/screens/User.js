import React, {useState, useEffect} from 'react'
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'

import ContactThumbnail from '../components/ContactThumbnail'
// import connect from redux
import {connect} from 'react-redux'

import { fetchUserData } from '../redux/userContact'
import colors from '../utils/colors'

function User({dispatch, user: {isLoading, data, error}}) {

	useEffect(()=> {
		// send action to store to fetch data
		dispatch(fetchUserData())
	}, [])

	if (isLoading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size={'large'} animating={isLoading} />
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
				name={data.name}
				phone={data.phone}
				avatar={data.avatar}
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

// get state from redux store
const mapStateToProps = (globalState) => ({
	user: globalState.user
})

export default connect(mapStateToProps)(User)