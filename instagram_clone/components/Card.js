// imports from dependencies
import React, {useState} from 'react'
import {StyleSheet, View, Text, Image, ActivityIndicator} from 'react-native'
import PropTypes from 'prop-types'

// import from other project files
import AuthorRow from "./AuthorRow"

export default function Card({fullname, linkText,onPressLinkText, image}) {
	
	const [isLoading, setIsLoading] = useState(true)

	const handleLoading = ()=> {
		setIsLoading(false)
	}
	// place ActivityIndicator before image, as last rendered component renders on top of others
	// and don't want to wait for onLoad to be called to make ActivityIndicator disappear
	return (
		<View>
			<AuthorRow 
				fullname={fullname}
				linkText={linkText}
				onPressLinkText={onPressLinkText}
			/>
			<View style={styles.image}>
				<ActivityIndicator style={StyleSheet.absoluteFill} animating={isLoading}/>
				<Image style={StyleSheet.absoluteFill} source={image} onLoad={handleLoading}/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	image: {
		aspectRatio: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.02)'
	}
})

Card.propTypes = {
	fullname: PropTypes.string.isRequired,
	linkText: PropTypes.string,
	onPressLinkText: PropTypes.func,
	image: Image.propTypes.source.isRequired,
}

Card.defaultProps = {
	linkText: '',
	onPressLinkText: ()=> {},
}