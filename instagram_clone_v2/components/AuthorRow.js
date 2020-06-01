import React from 'react';
import { StyleSheet, Text, View, ColorPropType, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types'

// imports from other files
import Avatar from './Avatar'
import getAvatarColor from '../utils/getAvatarColor';
import getInitials from '../utils/getInitials'


export default function AuthorRow({fullname, linkText, onPressLinkText}) {
	return (
		<View style={styles.container}>
			<Avatar 
				size={35}
				backgroundColor={"blue"}
				initials={"RN"}
			/>
			<Text style={styles.text} numberOfLines={1}>
				{fullname}
			</Text>
			{!!linkText && (
				<TouchableOpacity onPress={onPressLinkText}>
					<Text numberOfLines={1}>
						{linkText}
					</Text>
				</TouchableOpacity>
			)}
		</View>
		)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
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