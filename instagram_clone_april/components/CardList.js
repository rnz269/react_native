// import dependencies
import React from 'react'
import {FlatList} from 'react-native'
import PropTypes from "prop-types"

// import other files within project
import Card from "./Card"
import {getImageFromId} from "../utils/api"

const keyExtractor = ({id}) => (id.toString())

export default function CardList({data}) {
	
	// renderItem prop requires a function that maps items to components
	// prop hands function an item from data array, which we must destructure
	const renderItem = ({item: {id, author}}) => (
		<Card
			fullname={author}
			image={{uri: getImageFromId(id)}}
		/>
	)

	return (
		<FlatList 
			data={data}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
		/>
	)
}


Card.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			author: PropTypes.string.isRequired,
		})
	)
}