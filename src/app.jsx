import xs from "xstream";
import classnames from "classnames";
import reducer from "./reducer";
import actions from "./actions";

const state = action$ => action$.fold(reducer, reducer(undefined));

export const App = sources => {
	const vtree$ = state(actions(sources)).map(state => (
		<div>
			<section className="todoapp">
				<header className="header">
					<h1>todos</h1>
					<input
						className="new-todo"
						placeholder="What needs to be done?"
						autofocus
						value={state.newDescription}
					/>
				</header>
				{state.todoIds.length > 0 && (
					<section className="main">
						<input
							id="toggle-all"
							className="toggle-all"
							type="checkbox"
							checked={
								state.todoIds.filter(id => !state.todosById[id].completed)
									.length === 0
							}
						/>
						<label for="toggle-all">Mark all as complete</label>
						<ul className="todo-list">
							{state.todoIds
								.filter(
									id =>
										state.visibility === "all" ||
										(state.visibility === "active" &&
											!state.todosById[id].completed) ||
										(state.visibility === "completed" &&
											state.todosById[id].completed)
								)
								.map(id => state.todosById[id])
								.map(todo => (
									<li
										className={classnames({
											editing: todo.editing,
											completed: todo.completed
										})}
									>
										<div data-id={todo.id} className="view">
											<input
												className="toggle"
												type="checkbox"
												checked={todo.completed}
												value={todo.id}
											/>
											<label>{todo.description}</label>
											<button className="destroy" />
										</div>
										<input
											data-id={todo.id}
											className="edit"
											value={todo.description}
										/>
									</li>
								))}
						</ul>
					</section>
				)}
				{state.todoIds.length > 0 && (
					<footer className="footer">
						<span className="todo-count">
							<strong>
								{
									state.todoIds.filter(id => !state.todosById[id].completed)
										.length
								}
							</strong>{" "}
							{1 ===
							state.todoIds.filter(id => !state.todosById[id].completed).length
								? "item left"
								: "items left"}
						</span>
						<ul className="filters">
							<li>
								<a
									className={classnames({
										selected: state.visibility === "all"
									})}
									href="#/"
								>
									All
								</a>
							</li>
							<li>
								<a
									className={classnames({
										selected: state.visibility === "active"
									})}
									href="#/active"
								>
									Active
								</a>
							</li>
							<li>
								<a
									className={classnames({
										selected: state.visibility === "completed"
									})}
									href="#/completed"
								>
									Completed
								</a>
							</li>
						</ul>
						{state.todoIds.filter(id => state.todosById[id].completed).length >
							0 && <button className="clear-completed">Clear completed</button>}
					</footer>
				)}
			</section>
			<footer className="info">
				<p>Double-click to edit a todo</p>
				<p>
					Created by <a href="http://todomvc.com">Bradley J. Spaulding</a>
				</p>
				<p>
					Part of <a href="http://todomvc.com">TodoMVC</a>
				</p>
			</footer>
		</div>
	));
	const sinks = {
		DOM: vtree$
	};
	return sinks;
};
