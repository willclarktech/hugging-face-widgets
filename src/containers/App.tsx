import "@tensorflow/tfjs-backend-webgl";

import { ToxicityClassifier } from "@tensorflow-models/toxicity";
import React, { Component } from "react";

import SwitchButton from "../components/SwitchButton";
import GenderBiasWidgetContainer, {
	GenderBiasWidgetName,
} from "./GenderBiasWidgetContainer";
import ZeroSidedConversationWidgetContainer, {
	ZeroSidedConversationWidgetName,
} from "./ZeroSidedConversationWidgetContainer";

type WidgetName = GenderBiasWidgetName | ZeroSidedConversationWidgetName;

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
			currentWidget: GenderBiasWidgetContainer.widgetName,
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
						currentWidget === GenderBiasWidgetContainer.widgetName
							? ZeroSidedConversationWidgetContainer.widgetName
							: GenderBiasWidgetContainer.widgetName,
					)}
				/>
				{currentWidget === GenderBiasWidgetContainer.widgetName ? (
					<GenderBiasWidgetContainer />
				) : (
					<ZeroSidedConversationWidgetContainer localModel={localModel} />
				)}
			</div>
		);
	}
}

export default App;
