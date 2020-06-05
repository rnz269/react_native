import React, {useState, useEffect} from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import CameraRoll from 'expo-cameraroll'
import * as Permissions from 'expo-permissions'
import PropTypes from 'prop-types'

import Grid from './Grid'

// perhaps we'll pass the renderItem prop from here to Grid
// we'd be able to define what to render...
export default function ImageGrid({onPressImage}) {

	const [images, setImages] = useState ([])

	useEffect(()=> {
		getImages()
	}, [])

	const getImages = async () => {
		const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
		if (status !== 'granted') {
			console.log('Camera roll permission denied')
			return
		}
		// results is an obj containing a) edges, an array of objs, each containing a node obj
		// b) page_info, an object containing a bool has_next_page
		const results = await CameraRoll.getPhotos({
			first: 20,
		})
		// destructure edges array
		const {edges} = results
		// turn into an array of image objects
		const uriImages = edges.map(item => item.node.image)
		setImages(uriImages)
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
			<Image source={{uri}} style={style}/> 
		)
	}



	return (
		<Grid
			data={images}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			numColumns={4}
		/>
	)
}

const styles = StyleSheet.create({
	grid: {
		flex: 1,
		flexDirection: 'row',
	}
})

ImageGrid.propTypes = {
	onPressImage: PropTypes.func,
}

ImageGrid.defaultProps = {
	onPressImage: ()=> {},
}