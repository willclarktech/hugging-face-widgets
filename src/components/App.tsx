import React, { Component, MouseEvent } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
	readonly counter: number;
}

class App extends Component<Props, State> {
	constructor() {
		super({});
		this.state = {
			counter: 0,
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e: MouseEvent): void {
		e.preventDefault();
		this.setState((state) => ({
			counter: state.counter + 1,
		}));
	}

	render(): JSX.Element {
		return (
			<div>
				<h1>Header!</h1>
				<span>Counter is at: {this.state.counter}</span>
				<br />
				<button onClick={this.handleClick}>Press me</button>
			</div>
		);
	}
}

export default App;
