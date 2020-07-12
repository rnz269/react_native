import React from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'

import {MessageShape} from '../utils/MessageUtils'

export default function MessageList({messages, onPressMessage}) {

	const keyExtractor = ({id}) => (id.toString())

	const renderItem = ({item}) => {
		return (
			<View style={styles.messageRow}>
				<TouchableOpacity onPress={()=> onPressMessage(item)}>
					{renderMessageBody(item)}
				</TouchableOpacity>
			</View>
		)
	}

	const renderMessageBody = ({type, text, uri, coordinate}) => {
		switch (type) {
			case 'text':
				return (
					<View style={styles.messageBubble}>
						<Text style={styles.text}>{text}</Text>
					</View>
				)
				break

			case 'image':
				return <Image style={styles.image} source={{uri}}/>
				break

			case 'location':
				return (
					<MapView 
						style={styles.map}
						initialRegion={{...coordinate, latitudeDelta: 0.08, longitudeDelta: 0.04}}
					>
						<MapView.Marker coordinate={coordinate} />
					</MapView>
				)
				break

			default:
			return null
		}
	}


	return (
		<FlatList
			style={styles.container}
			inverted
			data={messages}
			keyboardShouldPersistTaps={'handled'}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
		/>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// overflow visible is for when keyboard appears and list shrinks
		overflow: 'visible',
	},
	messageRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginBottom: 4,
		marginRight: 10, 
		marginLeft: 60,
	},
	messageBubble: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: 'rgb(16, 135, 255)',
		borderRadius: 20,
	},
	text: {
		fontSize: 18,
		color: 'white',
	}, 
	image: {
		width: 150,
		height: 150,
		borderRadius: 10,
	},
	map: {
		width: 250,
		height: 250,
		borderRadius: 10,
	},
})

MessageList.propTypes = {
	messages: PropTypes.arrayOf(MessageShape).isRequired,
	onPressMessage: PropTypes.func,
}

MessageList.defaultProps = {
	onPressMessage: () => {}
}
