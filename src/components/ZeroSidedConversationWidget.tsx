import "./ZeroSidedConversationWidget.css";

import React, { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Alert, Button, ButtonGroup, Form } from "react-bootstrap";

import GeneratedText, { Props as GeneratedTextProps } from "./GeneratedText";

interface Props {
	readonly models: readonly string[];
	readonly initialText: string;
	readonly loadingLocalModel: boolean;
	readonly running: boolean;
	readonly messages: readonly GeneratedTextProps[];
	readonly errorMessage: string | null;
	readonly onTextChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly onModelChange: (event: ChangeEvent<HTMLSelectElement>) => void;
	readonly onSubmit: (event: FormEvent) => void;
	readonly onPause: (event: MouseEvent<HTMLElement>) => void;
	readonly onReset: (event: MouseEvent<HTMLElement>) => void;
}

const ZeroSidedConversationWidget = ({
	models,
	initialText,
	loadingLocalModel,
	running,
	errorMessage,
	messages,
	onTextChange: handleTextChange,
	onModelChange: handleModelChange,
	onSubmit: handleSubmit,
	onPause: handlePause,
	onReset: handleReset,
}: Props): JSX.Element => (
	<div className="zero-sided-conversation-widget">
		<h1>{"The zero-sided conversation app"}</h1>
		<p>
			{"Sometimes even one-sided conversations require too much human input."}
		</p>
		<p>
			{
				"This widget uses the text-generation API to iteratively produce a story. In the browser we have a TensorFlow.js toxicity model analyzing the results for toxicity and expressing verbal encouragement or discouragement accordingly."
			}
		</p>
		<Form onSubmit={handleSubmit}>
			<Form.Group>
				<Form.Label>{"Select the model:"}</Form.Label>
				<Form.Control as="select" name="model" onChange={handleModelChange}>
					{models.map((model) => (
						<option key={model} value={model}>
							{model}
						</option>
					))}
				</Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>
					{"Kick things off with a conversation starter:"}
				</Form.Label>
				<Form.Control
					type="text"
					value={initialText}
					onChange={handleTextChange}
				/>
			</Form.Group>
			<ButtonGroup>
				<Button
					variant="dark"
					onClick={handleReset}
					disabled={loadingLocalModel || running || messages.length === 0}
				>
					{"Reset"}
				</Button>
				<Button variant="danger" onClick={handlePause} disabled={!running}>
					{"Pause"}
				</Button>
				<Button
					variant="primary"
					type="submit"
					disabled={loadingLocalModel || running}
				>
					{loadingLocalModel
						? "Loading local model (slow!)..."
						: running
						? "Conversing..."
						: "Converse"}
				</Button>
			</ButtonGroup>
		</Form>
		{errorMessage && <Alert variant="danger">{`Error: ${errorMessage}`}</Alert>}
		{messages.length > 0 && (
			<div>
				<h2>{"Your zero-effort conversation:"}</h2>
				<ol>{messages.map(GeneratedText)}</ol>
			</div>
		)}
	</div>
);

export default ZeroSidedConversationWidget;
