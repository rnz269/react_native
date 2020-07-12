import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createDrawerNavigator } from 'react-navigation-drawer'

import { MaterialIcons } from '@expo/vector-icons'
import colors from './utils/colors'

import Contacts from './screens/Contacts'
import Favorites from './screens/Favorites'
import Profile from './screens/Profile'
import User from './screens/User'
import Options from './screens/Options'


function getTabBarIcon(icon) {
	return (
		({tintColor}) => (
			<MaterialIcons name={icon} size={26} style={{ color: tintColor }} />			
		)
	)
}

function getDrawerItemIcon(icon) {
	return (
		({tintColor}) => (
			<MaterialIcons name={icon} size={22} style={{ color: tintColor }} />			
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
			drawerIcon: getDrawerItemIcon('list')
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
			drawerIcon: getDrawerItemIcon('star')
		}
	}
)

// User Stack Navigator
const UserScreen = createStackNavigator(
	{
		User,
		Options,
	},
	// specify this StackNavigator should have modal transitions
	{
		mode: 'modal',
		initialRouteName: 'User',
		navigationOptions: {
			drawerIcon: getDrawerItemIcon('person')
		}
	}
)

/***************** DRAWER NAVIGATOR *****************/

const DrawerNavigator = createDrawerNavigator(
	{
		Contacts: ContactsScreen,
		Favorites: FavoritesScreen,
		User: UserScreen,
	},
	{
		initialRouteName: 'Contacts',
	}
)

export default createAppContainer(DrawerNavigator)