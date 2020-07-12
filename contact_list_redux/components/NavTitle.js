import React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

function NavTitle({navigation: { state: { params: {id} }}, contacts: {data}}) {
	const user = data.find(contact => contact.id === id)
	const {name} = user
	const title = name.split(' ')[0]
	console.log(title)
	console.log('test')
	return (
		<Text>test</Text>
	)
}

const mapStateToProps = (globalState) => ({
	contacts: globalState.contacts.data
})

export default connect(mapStateToProps)(NavTitle)