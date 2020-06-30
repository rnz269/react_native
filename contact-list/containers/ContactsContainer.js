import {connect} from 'react-redux'
import { fetchContactsData } from '../redux/allContacts'
import Contacts from '../screens/Contacts'

// grab state from redux store, pass down to Contact
const mapStateToProps = (globalState) => ({
	contacts: globalState.contacts
})

// bind dispatch to action, pass down as callback to Contacts
const mapDispatchToProps = {
	fetchContactsData: fetchContactsData
}

const ContactsContainer = connect(mapStateToProps, mapDispatchToProps)(Contacts)

export default ContactsContainer