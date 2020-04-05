import React, {useState} from "react"
import { Text, View} from "react-native"

import Timer from "./Timer"
import TimerForm from "./TimerForm"

export default function EditableTimer({id, title, project, elapsed, isRunning}) {
	const [editFormOpen, setEditFormOpen] = useState(false)
	const toggleOpen = () => {
		setEditFormOpen(prevEditFormOpen => !prevEditFormOpen)
	}

	const updateButton = () => {
		// should call editButton AND call passed down function that updates data
		toggleOpen()
	}



	if (editFormOpen) {
		return (
			<View>
				<TimerForm id={id} title={title} project={project} toggleOpen={toggleOpen} />
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
				editFormOpen={editFormOpen}
				onEdit={toggleOpen}
			/>
		</View>
	)
}