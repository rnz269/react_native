// import dependencies
import React, {useState} from 'react'
import {StyleSheet, View, Text, ScrollView} from 'react-native'
import PropTypes from "prop-types"

// import other files within project
import Card from "./Card"

export default function CardList({data}) {
	const cardComponents = data.map(datum => <Card key={datum.id} {...datum} />)

	return (
		<ScrollView>
			{cardComponents}
		</ScrollView>
	)
}

const styles = StyleSheet.create({

})

Card.propTypes = {

}