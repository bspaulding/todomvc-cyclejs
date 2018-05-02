import xs from "xstream";

export default function actions(sources) {
	const newTodoInput = sources.DOM.select(".new-todo");
	const action$ = xs.merge(
		newTodoInput.events("input").map(ev => ({
			type: "NEW_DESCRIPTION_CHANGED",
			payload: ev.target.value
		})),
		newTodoInput
			.events("keydown")
			.filter(ev => ev.keyCode === 13)
			.map(pressed => ({
				type: "ADD_TODO"
			})),
		sources.DOM.select(".todo-list li .toggle")
			.events("change")
			.map(ev => ({
				type: "TODO_TOGGLED",
				payload: { id: ev.target.value, checked: ev.target.checked }
			})),
		xs
			.merge(
				sources.DOM.select(".todo-list li .view").events("dblclick"),
				sources.DOM.select(".todo-list li .edit")
					.events("keydown")
					.filter(ev => ev.keyCode === 13)
			)
			.map(ev => {
				return {
					type: "TODO_TOGGLE_EDITING",
					payload: { id: ev.currentTarget.getAttribute("data-id") }
				};
			}),
		sources.DOM.select(".todo-list li .edit")
			.events("input")
			.map(ev => ({
				type: "TODO_DESCRIPTION_CHANGED",
				payload: {
					id: ev.currentTarget.getAttribute("data-id"),
					description: ev.currentTarget.value
				}
			})),
		sources.DOM.select(".toggle-all")
			.events("click")
			.map(ev => ({ type: "TOGGLE_ALL" })),
		sources.DOM.select(".clear-completed")
			.events("click")
			.map(ev => ({
				type: "CLEAR_COMPLETED"
			})),
		sources.DOM.select('.filters a').events('click')
			.map(ev => ({
				type: 'VISIBILITY_CHANGED',
				payload: {
					"#/": "all",
					"#/active": "active",
					"#/completed": "completed"
				}[ev.currentTarget.getAttribute("href")]
			}))
	);
	return action$;
}


