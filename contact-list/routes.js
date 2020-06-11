import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import { MaterialIcons } from '@expo/vector-icons'
import colors from './utils/colors'

import Contacts from './screens/Contacts'
import Favorites from './screens/Favorites'
import Profile from './screens/Profile'
import User from './screens/User'


function getTabBarIcon(icon) {
	return (
		({tintColor}) => (
			<MaterialIcons name={icon} size={26} style={{ color: tintColor }} />			
		)
	)
}

/***************** STACK NAVIGATORS *****************/

// Contacts Stack Navigator
const ContactsScreen = createStackNavigator(
	{
		Contacts,
		Profile,
	}, 
	{
		initialRouteName: 'Contacts',
		navigationOptions: {
			tabBarIcon: getTabBarIcon('list')
		}
	}
)

// Favorites Stack Navigator
const FavoritesScreen = createStackNavigator(
	{
		Favorites,
		Profile,
	},
	{
		initialRouteName: 'Favorites',
		navigationOptions: {
			tabBarIcon: getTabBarIcon('star')
		}
	}
)

// User Stack Navigator
const UserScreen = createStackNavigator(
	{
		User,
	},
	{
		initialRouteName: 'User',
		navigationOptions: {
			tabBarIcon: getTabBarIcon('person')
		}
	}
)

/***************** TAB NAVIGATOR *****************/

const TabNavigator = createBottomTabNavigator(
	{
		Contacts: ContactsScreen,
		Favorites: FavoritesScreen,
		User: UserScreen,
	},
	{
		initialRouteName: 'Contacts',
		tabBarPosition: 'bottom',
		tabBarOptions: {
			style: {backgroundColor: colors.greyLight},
			showLabel: false,
			showIcon: true,
			activeTintColor: colors.blue,
			inactiveTintColor: colors.greyDark,
		}
	}
)

export default createAppContainer(TabNavigator)