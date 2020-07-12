// imports from dependencies
import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'

// imports from other files in project
import Avatar from "./Avatar"
import getAvatarColor from '../utils/getAvatarColor'
import getInitials from '../utils/getInitials'

export default function AuthorRow({fullname, linkText, onPressLinkText}){
	

	return (
		<View style={styles.authorRowContainer}>
			<Avatar
				initials={getInitials(fullname)}
				size={35}
				backgroundColor={getAvatarColor(fullname)}
			/>
			<Text style={styles.text} numberOfLines={1}>{fullname}</Text>
			<TouchableOpacity onPress={onPressLinkText}>
				<Text>
					3 comments
				</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	authorRowContainer: {
		height:50,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	text: {
		flex: 1,
		marginHorizontal: 6,
	}
})

AuthorRow.propTypes = {
	fullname: PropTypes.string.isRequired,
	linkText: PropTypes.string.isRequired,
	onPressLinkText: PropTypes.func.isRequired,
}