import "./ZeroSidedConversationWidget.css";

import React, { ChangeEvent, FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";

export interface Message {
	readonly speaker: "client" | "server";
	readonly text: string;
}

interface Props {
	readonly models: readonly string[];
	readonly initialText: string;
	readonly loading: boolean;
	readonly messages: readonly Message[];
	readonly errorMessage: string | null;
	readonly onTextChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly onModelChange: (event: ChangeEvent<HTMLSelectElement>) => void;
	readonly onSubmit: (event: FormEvent) => void;
}

const ZeroSidedConversationWidget = ({
	models,
	initialText,
	loading,
	errorMessage,
	messages,
	onTextChange: handleTextChange,
	onModelChange: handleModelChange,
	onSubmit: handleSubmit,
}: Props): JSX.Element => (
	<div className="zero-sided-conversation-widget">
		<h1>{"The zero-sided conversation app"}</h1>
		<p>
			{"Sometimes even one-sided conversations require too much human input."}
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
			<Button variant="dark" type="submit" disabled={loading}>
				{loading ? "Loading..." : "Converse"}
			</Button>
		</Form>
		{errorMessage && <Alert variant="danger">{`Error: ${errorMessage}`}</Alert>}
		{messages.length === 0 ? (
			""
		) : (
			<div>
				<h2>{"Your zero-effort conversation:"}</h2>
				<ol>
					{messages.map(({ speaker, text }) => (
						<li key={text} className={speaker}>
							{text}
						</li>
					))}
				</ol>
			</div>
		)}
	</div>
);

export default ZeroSidedConversationWidget;
