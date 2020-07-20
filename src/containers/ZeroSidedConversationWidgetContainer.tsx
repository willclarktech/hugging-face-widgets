import { ToxicityClassifier } from "@tensorflow-models/toxicity";
import React, { ChangeEvent, Component, FormEvent, MouseEvent } from "react";

import ZeroSidedConversationWidget, {
	Message,
	Speaker,
} from "../components/ZeroSidedConversationWidget";
import { assert, post } from "../utils";

export type ZeroSidedConversationWidgetName = "zero-sided-conversation";

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

interface Props {
	readonly localModel: ToxicityClassifier | null;
}

interface State {
	readonly initialText: string;
	readonly remoteModel: string;
	readonly errorMessage: string | null;
	readonly messages: readonly Message[];
	readonly paused: boolean;
	readonly serverMessageIndex: number;
	readonly clientMessageIndex: number;
}

class ZeroSidedConversationWidgetContainer extends Component<Props, State> {
	public static widgetName: ZeroSidedConversationWidgetName =
		"zero-sided-conversation";
	private readonly models: readonly string[];
	private readonly threshold: number;
	// TODO: This is an anti-pattern and should be replaced with cancelable promises.
	private _isMounted: boolean;

	constructor(props: Props) {
		super(props);
		this.models = ["gpt2", "openai-gpt"];
		this.threshold = 0.001;
		this._isMounted = false;
		this.state = {
			initialText: "Once upon a time there were two very special AIs.",
			remoteModel: "gpt2",
			errorMessage: null,
			messages: [],
			paused: true,
			serverMessageIndex: 0,
			clientMessageIndex: 0,
		};

		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleRemoteModelChange = this.handleRemoteModelChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePause = this.handlePause.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	componentDidMount(): void {
		this._isMounted = true;
	}

	componentWillUnmount(): void {
		this._isMounted = false;
	}

	getRemoteMessage(): void {
		this.setState({
			paused: false,
		});
		const { initialText, messages, remoteModel } = this.state;
		const serverMessages = messages.filter(
			({ speaker }) => speaker === "server",
		);
		const text =
			serverMessages.length === 0
				? initialText
				: serverMessages[serverMessages.length - 1].text;
		const body = `"${text}"`;
		post(`https://api-inference.huggingface.co/models/${remoteModel}`, {
			body,
		}).then(
			(apiResult) => {
				if (!this._isMounted) {
					return;
				}

				assert(isApiResult(apiResult));
				const rawReply = apiResult[0].generated_text;
				const reply = rawReply
					.slice(text.length)
					.replace(/\n/g, " ")
					.replace(/"/g, "'")
					.replace(/\s[^\s]+?$/, "")
					.trim();

				this.setState({
					messages: [
						...this.state.messages,
						{
							id: this.state.serverMessageIndex,
							speaker: Speaker.Server,
							text: reply,
						},
					],
					serverMessageIndex: this.state.serverMessageIndex + 1,
					errorMessage: null,
				});

				return this.state.paused ? null : this.getLocalMessage();
			},
			(error: Error) => {
				if (!this._isMounted) {
					return;
				}
				this.setState({
					errorMessage: error.message,
				});
			},
		);
	}

	getLocalMessage(): void {
		const { messages } = this.state;
		const { localModel } = this.props;
		if (!localModel) {
			throw new Error("Local model not yet loaded");
		}

		const serverMessages = messages.filter(
			({ speaker }) => speaker === "server",
		);
		const mostRecentServerMessage = serverMessages[serverMessages.length - 1];
		localModel.classify(mostRecentServerMessage.text).then((classification) => {
			if (!this._isMounted) {
				return;
			}
			const isToxic =
				classification[0].results[0].probabilities[1] > this.threshold;
			const comment = isToxic
				? "I don’t like where this is going."
				: "This is good stuff.";
			this.setState({
				messages: [
					...this.state.messages,
					{
						id: this.state.clientMessageIndex,
						speaker: Speaker.Client,
						text: comment,
					},
				],
				clientMessageIndex: this.state.clientMessageIndex + 1,
			});

			return this.state.paused ? null : this.getRemoteMessage();
		});
	}

	handleTextChange(event: ChangeEvent<HTMLInputElement>): void {
		this.setState({ initialText: event.target.value });
	}

	handleRemoteModelChange(event: ChangeEvent<HTMLSelectElement>): void {
		this.setState({ remoteModel: event.target.value });
	}

	handleSubmit(event: FormEvent): void {
		event.preventDefault();
		this.setState({
			paused: false,
		});

		const mostRecentMessage = this.state.messages[
			this.state.messages.length - 1
		];

		return mostRecentMessage === undefined ||
			mostRecentMessage.speaker === "client"
			? this.getRemoteMessage()
			: this.getLocalMessage();
	}

	handlePause(event: MouseEvent<HTMLElement>): void {
		event.preventDefault();
		this.setState({
			paused: true,
		});
	}

	handleReset(event: MouseEvent<HTMLElement>): void {
		event.preventDefault();
		this.setState({
			errorMessage: null,
			messages: [],
			paused: true,
			serverMessageIndex: 0,
			clientMessageIndex: 0,
		});
	}

	render(): JSX.Element {
		return (
			<ZeroSidedConversationWidget
				models={this.models}
				initialText={this.state.initialText}
				loadingLocalModel={this.props.localModel === null}
				paused={this.state.paused}
				messages={this.state.messages}
				errorMessage={this.state.errorMessage}
				onTextChange={this.handleTextChange}
				onModelChange={this.handleRemoteModelChange}
				onSubmit={this.handleSubmit}
				onPause={this.handlePause}
				onReset={this.handleReset}
			/>
		);
	}
}

export default ZeroSidedConversationWidgetContainer;
