import "@tensorflow/tfjs-backend-webgl";

import {
	load as loadLocalModel,
	ToxicityClassifier,
} from "@tensorflow-models/toxicity";
import React, { Component } from "react";

import App, { WidgetName } from "../components/App";
import GenderBiasWidgetContainer from "./GenderBiasWidgetContainer";
import ZeroSidedConversationWidgetContainer from "./ZeroSidedConversationWidgetContainer";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface State {
	readonly currentWidget: WidgetName;
	readonly localModel: ToxicityClassifier | null;
}

class AppContainer extends Component<Props, State> {
	private toxicityLabels: readonly string[];

	constructor(props: Props) {
		super(props);
		this.toxicityLabels = ["toxicity"];
		this.state = {
			currentWidget: GenderBiasWidgetContainer.widgetName,
			localModel: null,
		};
	}

	componentDidMount(): void {
		loadLocalModel(0, [...this.toxicityLabels]).then((localModel) => {
			this.setState({ localModel });
		});
	}

	setCurrentWidget(widgetName: WidgetName): void {
		this.setState({ currentWidget: widgetName });
	}

	render(): JSX.Element {
		const { currentWidget, localModel } = this.state;
		return (
			<App
				currentWidget={currentWidget}
				localModel={localModel}
				onToggleWidget={this.setCurrentWidget.bind(
					this,
					currentWidget === GenderBiasWidgetContainer.widgetName
						? ZeroSidedConversationWidgetContainer.widgetName
						: GenderBiasWidgetContainer.widgetName,
				)}
			/>
		);
	}
}

export default AppContainer;
