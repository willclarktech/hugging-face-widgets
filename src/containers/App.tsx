import "@tensorflow/tfjs-backend-webgl";

import { ToxicityClassifier } from "@tensorflow-models/toxicity";
import React, { Component } from "react";

import SwitchButton from "../components/SwitchButton";
import GenderBiasWidgetContainer from "./GenderBiasWidgetContainer";
import ZeroSidedConversationWidgetContainer from "./ZeroSidedConversationWidgetContainer";

type WidgetName = "gender-bias" | "zero-sided-conversation";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface State {
	readonly currentWidget: WidgetName;
	readonly localModel: ToxicityClassifier | null;
}

class App extends Component<Props, State> {
	private toxicityLabels: readonly string[];

	constructor(props: Props) {
		super(props);
		this.toxicityLabels = ["toxicity"];
		this.state = {
			currentWidget: "gender-bias",
			localModel: null,
		};
	}

	componentDidMount(): void {
		const localModel = new ToxicityClassifier(undefined, [
			...this.toxicityLabels,
		]);
		localModel.load().then(() => {
			this.setState({ localModel });
		});
	}

	setCurrentWidget(widgetName: WidgetName): void {
		this.setState({ currentWidget: widgetName });
	}

	render(): JSX.Element {
		const { currentWidget, localModel } = this.state;
		return (
			<div>
				<SwitchButton
					onClick={this.setCurrentWidget.bind(
						this,
						currentWidget === "gender-bias"
							? "zero-sided-conversation"
							: "gender-bias",
					)}
				/>
				{currentWidget === "gender-bias" ? (
					<GenderBiasWidgetContainer />
				) : (
					<ZeroSidedConversationWidgetContainer localModel={localModel} />
				)}
			</div>
		);
	}
}

export default App;
