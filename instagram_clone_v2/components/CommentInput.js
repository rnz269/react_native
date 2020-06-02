import React, {useState} from 'react'
import { TextInput, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default function CommentInput({onSubmit, placeholder}) {
	
	const [comment, setComment] = useState('')
	const handleChangeText = (text) => setComment(text)
	const handleSubmitEditing = () => {
		
		// prohibit empty submission
		if (!comment) return

		onSubmit(comment)
		setComment('')
	}

	return (
		<View style={styles.container}>
			<TextInput
				placeholder={placeholder}
				placeholderTextColor="gray"
				value={comment}
				style={styles.textInput}
				onChangeText={handleChangeText}
				onSubmitEditing={handleSubmitEditing}
			 />
		</View>
	)
}

	const styles = StyleSheet.create ({
		container: {
			height: 60,
			paddingHorizontal: 20,
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		},

		textInput: {
			flex: 1,
		},
	})

	CommentInput.propTypes = {
		onSubmit: PropTypes.func.isRequired,
		placeholder: PropTypes.string,
	}

	CommentInput.defaultProps = {
		placeholder: '',
	}

