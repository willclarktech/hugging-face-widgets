import React, { Component } from "react";

import SwitchButton from "../components/SwitchButton";
import GenderBiasWidgetContainer from "./GenderBiasWidgetContainer";
import ZeroSidedConversationWidgetContainer from "./ZeroSidedConversationWidgetContainer";

type WidgetName = "gender-bias" | "zero-sided-conversation";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface State {
	readonly currentWidget: WidgetName;
}

class App extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			currentWidget: "gender-bias",
		};
	}

	setCurrentWidget(widgetName: WidgetName): void {
		this.setState({ currentWidget: widgetName });
	}

	render(): JSX.Element {
		return (
			<div>
				<SwitchButton
					onClick={this.setCurrentWidget.bind(
						this,
						this.state.currentWidget === "gender-bias"
							? "zero-sided-conversation"
							: "gender-bias",
					)}
				/>
				{this.state.currentWidget === "gender-bias" ? (
					<GenderBiasWidgetContainer />
				) : (
					<ZeroSidedConversationWidgetContainer />
				)}
			</div>
		);
	}
}

export default App;
