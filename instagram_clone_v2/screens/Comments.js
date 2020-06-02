import React from 'react'
import { SafeAreaView, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'

import NavigationBar from '../components/NavigationBar'
import CommentList from '../components/CommentList'
import CommentInput from '../components/CommentInput'

export default function Comments({style, comments, onClose, onSubmitComment}) {
	return (
		<SafeAreaView style={style}>
			<NavigationBar title="Comments" leftText="close" onPressLeftText={onClose} />
			<CommentInput onSubmit={onSubmitComment} placeholder="Leave a comment"/>
			<CommentList comments={comments}/>
		</SafeAreaView>
		)

}



Comments.propTypes = {
	style: ViewPropTypes.style,
	comments: PropTypes.arrayOf(PropTypes.string).isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmitComment: PropTypes.func.isRequired,
}

Comments.defaultProps = {
	style: null,
}
