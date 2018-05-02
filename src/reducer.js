const initialState = {
	newDescription: "",
	todosById: {
		"0": { id: "0", description: "Taste JavaScript", completed: true },
		"1": { id: "1", description: "Buy a unicorn", completed: false }
	},
	todoIds: ["0", "1"],
	visibility: "all"
};
export default function(state, action) {
	if ("undefined" === typeof state) {
		return initialState;
	}

	let next;
	switch (action.type) {
		case "NEW_DESCRIPTION_CHANGED":
			next = { ...state, newDescription: action.payload };
			break;
		case "ADD_TODO":
			const newId = String(new Date().getTime());
			next = {
				...state,
				newDescription: "",
				todosById: {
					...state.todosById,
					[newId]: {
						id: newId,
						description: state.newDescription,
						completed: false
					}
				},
				todoIds: [...state.todoIds, newId]
			};
			break;
		case "TODO_TOGGLED":
			next = {
				...state,
				todosById: {
					...state.todosById,
					[action.payload.id]: {
						...state.todosById[action.payload.id],
						completed: action.payload.checked
					}
				}
			};
			break;
		case "TODO_TOGGLE_EDITING":
			next = {
				...state,
				todosById: {
					...state.todosById,
					[action.payload.id]: {
						...state.todosById[action.payload.id],
						editing: !state.todosById[action.payload.id].editing
					}
				}
			};
			break;
		case "TODO_DESCRIPTION_CHANGED":
			next = {
				...state,
				todosById: {
					...state.todosById,
					[action.payload.id]: {
						...state.todosById[action.payload.id],
						description: action.payload.description
					}
				}
			};
			break;
		case "TOGGLE_ALL":
			const allCompleted = !state.todoIds.find(
				id => !state.todosById[id].completed
			);
			next = {
				...state,
				todosById: state.todoIds.reduce(
					(byId, id) => ({
						...byId,
						[id]: {
							...state.todosById[id],
							completed: !allCompleted
						}
					}),
					state.todosById
				)
			};
			break;
		case "CLEAR_COMPLETED":
			next = {
				...state,
				todosById: state.todoIds
					.filter(id => !state.todosById[id].completed)
					.reduce(
						(byId, id) => ({
							...byId,
							[id]: state.todosById[id]
						}),
						{}
					),
				todoIds: state.todoIds.filter(id => !state.todosById[id].completed)
			};
			break;
		case "VISIBILITY_CHANGED":
			next = {
				...state,
				visibility: action.payload
			};
			break;
		default:
			next = state;
			break;
	}
	console.log({ state, action, next });
	return next;
}
