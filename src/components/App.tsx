import "@tensorflow/tfjs-backend-webgl";

import { ToxicityClassifier } from "@tensorflow-models/toxicity";
import React from "react";

import WidgetToggle from "../components/WidgetToggle";
import GenderBiasWidgetContainer, {
	GenderBiasWidgetName,
} from "../containers/GenderBiasWidgetContainer";
import ZeroSidedConversationWidgetContainer, {
	ZeroSidedConversationWidgetName,
} from "../containers/ZeroSidedConversationWidgetContainer";

export type WidgetName = GenderBiasWidgetName | ZeroSidedConversationWidgetName;

interface Props {
	readonly currentWidget: WidgetName;
	readonly localModel: ToxicityClassifier | null;
	readonly onToggleWidget: () => void;
}

const App = ({
	currentWidget,
	localModel,
	onToggleWidget: handleToggleWidget,
}: Props): JSX.Element => (
	<div>
		<WidgetToggle onClick={handleToggleWidget} />
		{currentWidget === GenderBiasWidgetContainer.widgetName ? (
			<GenderBiasWidgetContainer />
		) : (
			<ZeroSidedConversationWidgetContainer localModel={localModel} />
		)}
	</div>
);

export default App;
