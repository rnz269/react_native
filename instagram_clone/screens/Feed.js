// import dependencies
import React, {useState, useEffect} from "react"
import {ActivityIndicator, Text, View, ViewPropTypes, SafeAreaView} from "react-native"
import PropTypes from 'prop-types'

// imports from other project files
import CardList from '../components/CardList'
import {fetchImages} from '../utils/api'

export default function Feed({style}) {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(false)
	const [data, setData] = useState([])

	// fetch data asynchronously on component mount
	useEffect(()=> {
		async function fetchData() {
			try {
				const data = await fetchImages()
				setIsLoading(false)
				setData(data)
			} catch (e) {
				setIsLoading(false)
				setError(true)
			}
		}
		fetchData()
	}, [])

	if (isLoading) {
		return <ActivityIndicator style={style} size='large'/>
	}

	if (error) {
		return (
			<View style={[style, {justifyContent: 'center', alignItems: 'center'}]}>
				<Text>Error...</Text>
			</View>
		)
	}

	return (
		<SafeAreaView>
			<CardList data={data} />
		</SafeAreaView>
	)
}

Feed.propTypes = {
	style: ViewPropTypes.style,
}

Feed.defaultProps = {
	style: null,
}