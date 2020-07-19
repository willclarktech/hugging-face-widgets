import React, { ChangeEvent, Component, FormEvent } from "react";

import ZeroSidedConversationWidget, {
	Message,
} from "../components/ZeroSidedConversationWidget";
import { assert, post } from "../utils";

interface TextGenerationResult {
	readonly generated_text: string;
}

type ApiResult = readonly TextGenerationResult[];

const isApiResult = (apiResult: unknown): apiResult is ApiResult => {
	return (
		Array.isArray(apiResult as ApiResult) &&
		(apiResult as ApiResult).length === 1 &&
		typeof (apiResult as ApiResult)[0].generated_text === "string"
	);
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface State {
	readonly initialText: string;
	readonly model: string;
	readonly errorMessage: string | null;
	readonly messages: readonly Message[];
	readonly loading: boolean;
}

class ZeroSidedConversationWidgetContainer extends Component<Props, State> {
	private models: readonly string[];

	constructor(props: Props) {
		super(props);
		this.state = {
			initialText: "Once upon a time there were two very special AIs.",
			model: "gpt2",
			errorMessage: null,
			messages: [],
			loading: false,
		};
		this.models = ["gpt2", "openai-gpt"];

		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleModelChange = this.handleModelChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleTextChange(event: ChangeEvent<HTMLInputElement>): void {
		this.setState({ initialText: event.target.value });
	}

	handleModelChange(event: ChangeEvent<HTMLSelectElement>): void {
		this.setState({ model: event.target.value });
	}

	handleSubmit(event: FormEvent): void {
		event.preventDefault();
		this.setState({
			// messages: [],
			loading: true,
		});

		const text =
			this.state.messages.length === 0
				? this.state.initialText
				: this.state.messages[this.state.messages.length - 1].text;
		const body = `"${text}"`;
		post(`https://api-inference.huggingface.co/models/${this.state.model}`, {
			body,
		}).then(
			(apiResult) => {
				console.log(apiResult);
				this.setState({ loading: false });
				assert(isApiResult(apiResult));
				const rawReply = apiResult[0].generated_text;
				const reply = rawReply
					.slice(text.length)
					.replace(/\n/g, " ")
					.replace(/"/g, "'")
					.replace(/\s[^\s]+?$/, "")
					.trim();
				console.log(reply);
				this.setState({
					messages: [
						...this.state.messages,
						{ speaker: "server", text: reply },
					],
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
			<ZeroSidedConversationWidget
				models={this.models}
				initialText={this.state.initialText}
				loading={this.state.loading}
				messages={this.state.messages}
				errorMessage={this.state.errorMessage}
				onTextChange={this.handleTextChange}
				onModelChange={this.handleModelChange}
				onSubmit={this.handleSubmit}
			/>
		);
	}
}

export default ZeroSidedConversationWidgetContainer;
