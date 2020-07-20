import "./MaskInference.css";

import React from "react";

import { femaleTokenRegExp, maleTokenRegExp } from "../utils";

export interface Props {
	readonly sequence: string;
	readonly score: number;
	readonly token: number;
	readonly token_str: string;
}

const MaskInference = ({ score, token, token_str }: Props): JSX.Element => {
	const processedTokenStr = token_str
		.replace(/^Ġ/, "") // From distilberta-base
		.replace(/^▁/, ""); // From camembert-base
	const scorePercentage = Math.round(score * 100);
	const genderClassName = femaleTokenRegExp.test(processedTokenStr)
		? "female"
		: maleTokenRegExp.test(processedTokenStr)
		? "male"
		: "";
	const className = `mask-inference ${genderClassName}`;
	const inlineStyle = { fontSize: `${scorePercentage * 8 + 100}%` };
	return (
		<li key={token} className={className} style={inlineStyle}>
			{`${processedTokenStr} (${scorePercentage}%)`}
		</li>
	);
};

export default MaskInference;
