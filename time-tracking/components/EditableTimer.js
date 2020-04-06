import React, {useState, useEffect} from "react"
import { Text, View} from "react-native"
import PropTypes from 'prop-types'

import Timer from "./Timer"
import TimerForm from "./TimerForm"

export default function EditableTimer({id, title, project, elapsed, isRunning, onSubmit, toggleTimer, removeTimer}) {
	const [editFormOpen, setEditFormOpen] = useState(false)

	const toggleOpen = () => {
		setEditFormOpen(prevEditFormOpen => !prevEditFormOpen)
	}

// supercharge passed down cb with EditableTimer's toggleOpen method (to close form upon creation)
// the props to EditableTimer are the original, unedited version. we get the updated ones from TimerForm
	const handleSubmit = (id, title, project) => {
		onSubmit(id, title, project)
		toggleOpen()
	}

	if (editFormOpen) {
		return (
			<View>
				<TimerForm id={id} title={title} project={project} onSubmit={handleSubmit} toggleOpen={toggleOpen} />
			</View>
		)
	}
	return (
		<View>
			<Timer 
				id={id}
				title={title}
				project={project}
				elapsed={elapsed}
				isRunning={isRunning}
				editTimer={toggleOpen}
				toggleTimer={toggleTimer}
				removeTimer={removeTimer}
			/>
		</View>
	)
}

EditableTimer.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	project: PropTypes.string.isRequired,
	elapsed: PropTypes.number.isRequired,
	isRunning: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	toggleTimer: PropTypes.func.isRequired,
	removeTimer: PropTypes.func.isRequired,
}