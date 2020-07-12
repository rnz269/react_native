import React, {useState, useEffect} from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import CameraRoll from 'expo-cameraroll'
import * as Permissions from 'expo-permissions'
import PropTypes from 'prop-types'

import Grid from './Grid'

// perhaps we'll pass the renderItem prop from here to Grid
// we'd be able to define what to render...
export default function ImageGrid({onPressImage}) {

	// member variables -- don't need to be in state since they
	// don't affect component rendering
	let loading = false
	let cursor = null

	const [images, setImages] = useState([])
	const [pageInfo, setPageInfo] = useState()

	useEffect(()=> {
		getImages()
	}, [])

	const getImages = async (after) => {
		// in case onEndReached function is called multiple times before
		// loading new set of images, we keep track of loading
		if (loading) return

		const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
		if (status !== 'granted') {
			console.log('Camera roll permission denied')
			return
		}

		loading = true
		// results is an obj containing a) edges, an array of objs, each containing a node obj
		// b) page_info, an object containing a bool has_next_page
		const results = await CameraRoll.getPhotos({
			first: 20,
			after
		})
		// destructure edges array
		const {edges, page_info} = results
		// turn into an array of image objects
		const uriImages = edges.map(item => item.node.image)
		setImages(prevImages => {
			const newImages = [...prevImages, ...uriImages]
			return newImages
		})
		setPageInfo(page_info)
	}

	// when pageInfo updates, we can set loading false & update cursor
	useEffect(()=> {
		// pageInfo is null on initial load. prevent destructuring null obj
		if (!pageInfo) return
		const {has_next_page, end_cursor} = pageInfo
		loading = false
		cursor = has_next_page ? end_cursor : null
	}, [pageInfo])


	const getNextImages = () => {
		if (!cursor) return

		getImages(cursor)
	}


	const keyExtractor = ({uri}) => uri
	const renderItem = ({item: {uri}, size, marginLeft, marginTop}) => {
		const style = {
			width: size,
			height: size,
			marginLeft,
			marginTop,
		}
		return (
			<TouchableOpacity 
				activeOpacity={0.75} 
				onPress={()=>onPressImage(uri)}
				style={style}
			>
				<Image source={{uri}} style={styles.image}/>
			</TouchableOpacity> 
		)
	}

	return (
		<Grid
			data={images}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			numColumns={4}
			onEndReached={getNextImages}
		/>
	)
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
	}
})

ImageGrid.propTypes = {
	onPressImage: PropTypes.func,
}

ImageGrid.defaultProps = {
	onPressImage: ()=> {},
}