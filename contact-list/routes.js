import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Contacts from './screens/Contacts'
import Profile from './screens/Profile'

const StackNavigator = createStackNavigator({
	Contacts: {
		screen: Contacts,
	},
	Profile: {
		screen: Profile,
	},
})

export default createAppContainer(StackNavigator)