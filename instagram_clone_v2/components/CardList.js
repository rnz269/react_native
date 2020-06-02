import React, {useState} from 'react';
import { FlatList } from 'react-native'
import PropTypes from 'prop-types'

import Card from './Card'
import { getImageFromId } from '../utils/api'

export default function CardList({items, onPressComments, commentsForItem}) {
	
	// keyExtractor takes an item from data array and returns its id
	// from our item object, we destructure the id property
	const keyExtractor = ({id}) => (id.toString())
	
	// takes an item from data array and maps it to a React element
	const renderItem = ({ item: { id, author }}) => {
		const comments = commentsForItem[id]
		return (
			<Card
				fullname={author}
				image={{
					uri: getImageFromId(id)
				}}
				onPressLinkText = {()=> onPressComments(id)}
				linkText = {`${comments ? comments.length : 0} Comments`}
			/>
		)
	}

	return (
		<FlatList
			data={items}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			extraData={commentsForItem}
		/>
	)
}


CardList.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			author: PropTypes.string.isRequired,
		})
		).isRequired,
	onPressComments: PropTypes.func.isRequired,
	commentsForItem: PropTypes.objectOf(
		PropTypes.arrayOf(PropTypes.string),
		).isRequired,
}
