import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Text, ViewPropTypes, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types'

import CardList from '../components/CardList'
import { fetchImages } from '../utils/api';

export default function Feed({style, onPressComments, commentsForItem}) {

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [items, setItems] = useState([])

	useEffect(()=> {
		// define async function
		async function tapAPI() {
			try {
				// fetchImages gets us a list of image metadata objects
				const items = await fetchImages();
				setItems(items);
				setLoading(false);
			} catch (e) {
				setLoading(false);
				setError(true);
			}
		}
		tapAPI();
	}, [])

	if (loading) {
		return <ActivityIndicator size={'large'} animating={loading} />
	}

	if (error) {
		return (
			<Text>Error encountered in data fetch process</Text>
			)
	}

	return (
		<SafeAreaView style={style}>
			<CardList onPressComments={onPressComments} commentsForItem={commentsForItem} items={items} />
		</SafeAreaView>
		)
}



Feed.propTypes = {
	style: ViewPropTypes.style,
	onPressComments: PropTypes.func.isRequired,
	commentsForItem: PropTypes.objectOf(
		PropTypes.arrayOf(PropTypes.string),
		).isRequired,
}

Feed.defaultProps = {
	style: null,
}