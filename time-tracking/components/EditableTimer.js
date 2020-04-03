import React from "react"
import {StyleSheet, Text, View} from "react-native"

import Timer from "./Timer"
import TimerForm from "./TimerForm"

export default function EditableTimer({id, title, project, elapsed, isRunning, editFormOpen}) {
	if (editFormOpen) {
		return (
			<View>
				<TimerForm id={id} title={title} project={project} />
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
				editFormOpen={false}
			/>
		</View>
	)
}