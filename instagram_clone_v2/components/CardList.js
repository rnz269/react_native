import React, {useState} from 'react';
import { FlatList } from 'react-native'
import PropTypes from 'prop-types'

import Card from './Card'
import { getImageFromId } from '../utils/api'

export default function CardList({items}) {
	
	// from item object, destructure id property
	const keyExtractor = ({id}) => (id.toString())
	const renderItem = ({ item: { id, author }}) => (
		<Card
			fullname={author}
			image={{
				uri: getImageFromId(id)
			}}
		/>
	)

	return (
		<FlatList
			data={items}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
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
}
