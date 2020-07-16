import React, { Component } from "react";

class App extends Component {
	public state: { readonly counter: number };

	constructor() {
		super({});
		this.state = {
			counter: 0,
		};
	}

	render(): JSX.Element {
		return (
			<div>
				<h1>Header!</h1>
				<span>Counter is at: {this.state.counter}</span>
			</div>
		);
	}
}

export default App;
