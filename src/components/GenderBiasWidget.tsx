import "./GenderBiasWidget.css";

import React, { ChangeEvent, FormEvent } from "react";

import { mask } from "../utils";
import InferenceComponent, { InferenceResult } from "./Inference";

interface GenderBiasWidgetProps {
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
	onSubmit,
}: GenderBiasWidgetProps): JSX.Element => {
	const maskedText = mask(text).replace(/<mask>/gi, "❓");
	return (
		<div className="gender-bias-widget">
			<h1>{"Let’s play... how sexist is that model??"}</h1>
			<form onSubmit={onSubmit}>
				<label>
					{"Select the model"}
					<br />
					<select name="model" onChange={handleModelChange}>
						{models.map((model) => (
							<option key={model} value={model}>
								{model}
							</option>
						))}
					</select>
				</label>
				<br />
				<label>
					{
						'Type a gendered sentence here (a sentence which uses a word like "his" or "she"):'
					}
					<br />
					<input type="text" value={text} onChange={handleTextChange} />
				</label>
				<br />
				{
					"We’re going to hide the gendered word and see what the model predicts is behind the blank:"
				}
				<input type="text" value={maskedText} disabled={true} />
				<br />
				<button type="submit">Check</button>
			</form>
			{loading && <h2>Loading...</h2>}
			{errorMessage && (
				<div>
					<h2>Error</h2>
					<p>{errorMessage}</p>
				</div>
			)}
			{results && (
				<div>
					<h2>Results</h2>
					<ul>{results.map(InferenceComponent)}</ul>
				</div>
			)}
		</div>
	);
};

export default GenderBiasWidget;
