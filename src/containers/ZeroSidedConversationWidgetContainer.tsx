import { ToxicityClassifier } from "@tensorflow-models/toxicity";
import React, { ChangeEvent, Component, FormEvent, MouseEvent } from "react";

import {
	Props as GeneratedTextProps,
	Speaker,
} from "../components/GeneratedText";
import ZeroSidedConversationWidget from "../components/ZeroSidedConversationWidget";
import { assert, post, sanitizeText } from "../utils";

export type ZeroSidedConversationWidgetName = "zero-sided-conversation";

interface TextGenerationResult {
	readonly generated_text: string;
}

type ApiResult = readonly TextGenerationResult[];

const isApiResult = (apiResult: unknown): apiResult is ApiResult =>
	Array.isArray(apiResult) &&
	apiResult.length === 1 &&
	typeof apiResult[0].generated_text === "string";

interface Props {
	readonly localModel: ToxicityClassifier | null;
}

interface State {
	readonly initialText: string;
	readonly remoteModel: string;
	readonly errorMessage: string | null;
	readonly messages: readonly GeneratedTextProps[];
	readonly running: boolean;
	readonly serverMessageIndex: number;
	readonly clientMessageIndex: number;
}

class ZeroSidedConversationWidgetContainer extends Component<Props, State> {
	public static widgetName: ZeroSidedConversationWidgetName =
		"zero-sided-conversation";
	private readonly remoteModels: readonly string[];
	private readonly threshold: number;
	private readonly encouragingComment: string;
	private readonly discouragingComment: string;

	constructor(props: Props) {
		super(props);
		this.remoteModels = ["gpt2", "openai-gpt"];
		this.threshold = 0.002;
		this.encouragingComment = "This is good stuff.";
		this.discouragingComment = "I don’t like where this is going.";

		this.state = {
			initialText: "Once upon a time there were two very special AIs.",
			remoteModel: this.remoteModels[0],
			errorMessage: null,
			messages: [],
			running: false,
			serverMessageIndex: 0,
			clientMessageIndex: 0,
		};

		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleRemoteModelChange = this.handleRemoteModelChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePause = this.handlePause.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	componentWillUnmount(): void {
		this.setState({ running: false });
	}

	getRemoteMessage(): void {
		const { initialText, messages, remoteModel } = this.state;
		const serverMessages = messages.filter(
			({ speaker }) => speaker === Speaker.Server,
		);
		const text =
			serverMessages.length === 0
				? initialText
				: serverMessages[serverMessages.length - 1].text;
		const body = `"${sanitizeText(text)}"`;
		post(`https://api-inference.huggingface.co/models/${remoteModel}`, {
			body,
		}).then(
			(apiResult) => {
				assert(isApiResult(apiResult));
				const rawReply = apiResult[0].generated_text;
				const reply = sanitizeText(
					rawReply.slice(text.length).replace(/\s[^\s]+?$/, ""),
				);

				this.setState({
					messages: [
						...this.state.messages,
						{
							id: `server${this.state.serverMessageIndex}`,
							speaker: Speaker.Server,
							text: reply,
							toxic: false,
						},
					],
					serverMessageIndex: this.state.serverMessageIndex + 1,
					errorMessage: null,
				});

				return this.state.running ? this.getLocalMessage() : null;
			},
			(error: Error) => {
				this.setState({
					running: false,
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
			({ speaker }) => speaker === Speaker.Server,
		);
		const mostRecentServerMessage = serverMessages[serverMessages.length - 1];
		localModel.classify(mostRecentServerMessage.text).then((classification) => {
			const isToxic =
				classification[0].results[0].probabilities[1] > this.threshold;
			const comment = isToxic
				? this.discouragingComment
				: this.encouragingComment;
			this.setState({
				messages: [
					...this.state.messages,
					{
						id: `client${this.state.clientMessageIndex}`,
						speaker: Speaker.Client,
						text: comment,
						toxic: isToxic,
					},
				],
				clientMessageIndex: this.state.clientMessageIndex + 1,
			});

			return this.state.running ? this.getRemoteMessage() : null;
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
			running: true,
		});

		const mostRecentMessage = this.state.messages[
			this.state.messages.length - 1
		];

		return mostRecentMessage === undefined ||
			mostRecentMessage.speaker === Speaker.Client
			? this.getRemoteMessage()
			: this.getLocalMessage();
	}

	handlePause(event: MouseEvent<HTMLElement>): void {
		event.preventDefault();
		this.setState({
			running: false,
		});
	}

	handleReset(event: MouseEvent<HTMLElement>): void {
		event.preventDefault();
		this.setState({
			errorMessage: null,
			messages: [],
			running: false,
			serverMessageIndex: 0,
			clientMessageIndex: 0,
		});
	}

	render(): JSX.Element {
		return (
			<ZeroSidedConversationWidget
				models={this.remoteModels}
				initialText={this.state.initialText}
				loadingLocalModel={this.props.localModel === null}
				running={this.state.running}
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
