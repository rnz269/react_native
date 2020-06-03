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
// we want to use arguments provided by child when child calls function. Not using original props from parent here, since edits may have occured.
	const handleSubmit = (id, title, project) => {
		onSubmit(id, title, project)
		toggleOpen()
	}

// id isn't going to change in child -- can use id provided by parent.
// can't do this with handleSubmit -- because title & project may have changed in child
	const handleToggleTimer = () => {
		toggleTimer(id)
	}

// id isn't going to change in child -- can use id provided by parent.
// can't do this with handleSubmit -- because title & project may have changed in child
	const handleRemoveTimer = () => {
		removeTimer(id)
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
				title={title}
				project={project}
				elapsed={elapsed}
				isRunning={isRunning}
				editTimer={toggleOpen}
				toggleTimer={handleToggleTimer}
				removeTimer={handleRemoveTimer}
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