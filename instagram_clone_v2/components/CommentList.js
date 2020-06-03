import React from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'

export default function CommentList({comments}) {
	const commentComponents = comments.map((comment, index) => (
		<View key={index} style={styles.comment}>
			<Text color="black" numberOfLines={1}>{comment}</Text>
		</View>
		)
	)

	return (
		<ScrollView>
			{commentComponents}
		</ScrollView>
		)



}

const styles = StyleSheet.create({
	comment: {
		marginLeft: 20,
		paddingVertical: 20,
		paddingRight: 20,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(0, 0, 0, 0.05)'
	}
})

CommentList.propTypes = {
	comments: PropTypes.arrayOf(PropTypes.string).isRequired
}