
import React from "react"
import { View, TextInput, StyleSheet } from "react-native"

export default function SearchInput(props) {
	return (
		<View style = {styles.container}>
			<TextInput
		        autoCorrect={false}
		        placeholder={props.placeholder}
		        placeholderTextColor="white"
		        underlineColorAndroid="transparent"
		        style={styles.textInput}
		        clearButtonMode="always"
	      />
      </View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 40,
		width: 300,
		marginTop: 20,
		marginHorizontal: 40,
		paddingHorizontal: 10,
		backgroundColor: "#666",
		borderRadius: 5,
	},
	textInput: {
		flex: 1,
		color: 'white',
	}
	// textInput: {
 //    backgroundColor: '#666',
 //    color: 'white',
 //    height: 40,
 //    width: 300,
 //    marginTop: 20,
 //    marginHorizontal: 20,
 //    paddingHorizontal: 10,
 //    alignSelf: 'center'
 //  }
})