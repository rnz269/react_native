import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'

import ContactThumbnail from '../components/ContactThumbnail'
// import connect from redux
import { connect } from 'react-redux'
import { fetchContactsData } from '../redux/allContacts'

// Favorites not a child of Contacts, so no way to pass data prop
function Favorites({dispatch, contacts: {isLoading, data, error}, navigation: {navigate}}) {

	useEffect(()=> {
		// call action creator if needed
		if (data.length === 0) {
			dispatch(fetchContactsData())
		}
	}, [])

	const keyExtractor = ({id}) => id.toString()
	const renderItem = ({item}) => {
		const {avatar} = item
		return (
			<ContactThumbnail
				avatar={avatar}
				onPress={() => {navigate('Profile', {id: item.id})}}
			/>
		)
	}

	// assemble our favorites array
	const favorites = data.filter(contact => contact.favorite)
	// sort our favorites array
	const favoritesSorted = favorites.sort((a,b)=> (
		a.name.localeCompare(b.name)
	))


	/* RETURN JSX */

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
				<Text style={styles.list}>There was an error fetching data</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<FlatList
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				data={favoritesSorted}
				numColumns={3}
				contentContainerStyle={styles.list}
			/>
		</View>
	)
}

Favorites.navigationOptions = {
	title: 'Favorites',
}

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

const mapStateToProps = (globalState) => ({
	contacts: globalState.contacts
})

export default connect(mapStateToProps)(Favorites)