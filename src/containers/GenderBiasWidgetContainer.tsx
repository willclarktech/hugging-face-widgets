import React, { ChangeEvent, Component, FormEvent } from "react";

import GenderBiasWidget from "../components/GenderBiasWidget";
import { Props as MaskInferenceProps } from "../components/MaskInference";
import {
	assert,
	genderedElementRegExp,
	mask,
	post,
	sanitizeText,
} from "../utils";

export type GenderBiasWidgetName = "gender-bias";

type ApiResult = readonly MaskInferenceProps[];

const isApiResult = (apiResult: unknown): apiResult is ApiResult =>
	Array.isArray(apiResult) &&
	apiResult.length > 0 &&
	typeof apiResult[0].sequence === "string";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface State {
	readonly text: string;
	readonly model: string;
	readonly errorMessage: string | null;
	readonly apiResult: ApiResult | null;
	readonly loading: boolean;
}

class GenderBiasWidgetContainer extends Component<Props, State> {
	public static widgetName: GenderBiasWidgetName = "gender-bias";
	private models: readonly string[];

	constructor(props: Props) {
		super(props);
		this.models = ["distilroberta-base", "camembert-base"];
		this.state = {
			text: "The coding interview went really well. We gave her the job.",
			model: this.models[0],
			errorMessage: null,
			apiResult: null,
			loading: false,
		};

		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleModelChange = this.handleModelChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleTextChange(event: ChangeEvent<HTMLInputElement>): void {
		this.setState({ text: event.target.value });
	}

	handleModelChange(event: ChangeEvent<HTMLSelectElement>): void {
		this.setState({ model: event.target.value });
	}

	handleSubmit(event: FormEvent): void {
		event.preventDefault();
		const matches = this.state.text.match(genderedElementRegExp);
		if (!matches || matches.length !== 1) {
			this.setState({
				errorMessage: "Sorry, this only works with exactly one blank.",
				apiResult: null,
			});
			return;
		}

		this.setState({
			apiResult: null,
			loading: true,
		});

		const maskedText = mask(this.state.text);
		post(`https://api-inference.huggingface.co/models/${this.state.model}`, {
			body: `"${sanitizeText(maskedText)}"`,
		}).then(
			(apiResult) => {
				this.setState({ loading: false });
				assert(isApiResult(apiResult));
				this.setState({
					apiResult,
					errorMessage: null,
				});
			},
			(error: Error) => {
				this.setState({
					loading: false,
					errorMessage: error.message,
				});
			},
		);
	}

	render(): JSX.Element {
		return (
			<GenderBiasWidget
				models={this.models}
				text={this.state.text}
				loading={this.state.loading}
				results={this.state.apiResult}
				errorMessage={this.state.errorMessage}
				onTextChange={this.handleTextChange}
				onModelChange={this.handleModelChange}
				onSubmit={this.handleSubmit}
			/>
		);
	}
}

export default GenderBiasWidgetContainer;
