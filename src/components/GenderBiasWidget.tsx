import "./GenderBiasWidget.css";

import React, { ChangeEvent, FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";

import { mask } from "../utils";
import InferenceComponent, { InferenceResult } from "./Inference";

interface Props {
	readonly models: readonly string[];
	readonly text: string;
	readonly loading: boolean;
	readonly errorMessage: string | null;
	readonly results: readonly InferenceResult[] | null;
	readonly onTextChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly onModelChange: (event: ChangeEvent<HTMLSelectElement>) => void;
	readonly onSubmit: (event: FormEvent) => void;
}

const GenderBiasWidget = ({
	models,
	text,
	loading,
	results,
	errorMessage,
	onTextChange: handleTextChange,
	onModelChange: handleModelChange,
	onSubmit: handleSubmit,
}: Props): JSX.Element => {
	const maskedText = mask(text).replace(/<mask>/gi, "❓");
	return (
		<div className="gender-bias-widget">
			<h1>{"Let’s play... how sexist is that model??"}</h1>
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
						{
							'Type a gendered sentence here (a sentence which uses a word like "his" or "she"):'
						}
					</Form.Label>
					<Form.Control type="text" value={text} onChange={handleTextChange} />
				</Form.Group>
				<Form.Group>
					<Form.Label>
						{
							"We’re going to hide the gendered word and see what the model predicts is behind the blank:"
						}
					</Form.Label>
					<Form.Control type="text" value={maskedText} disabled={true} />
				</Form.Group>
				<Button variant="dark" type="submit" disabled={loading}>
					{loading ? "Loading..." : "Check"}
				</Button>
			</Form>
			{errorMessage && (
				<Alert variant="danger">{`Error: ${errorMessage}`}</Alert>
			)}
			{results && (
				<div>
					<h2>{"This model suggests..."}</h2>
					<ol>{results.map(InferenceComponent)}</ol>
				</div>
			)}
		</div>
	);
};

export default GenderBiasWidget;
