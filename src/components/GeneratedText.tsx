import "./GeneratedText.css";

import React from "react";

export enum Speaker {
	Client = "client",
	Server = "server",
}

export interface Props {
	readonly speaker: Speaker;
	readonly text: string;
	readonly id: string;
}

const GeneratedText = ({ speaker, text, id }: Props): JSX.Element => (
	<li key={id}>
		<div className={`speech ${speaker}`}>{text}</div>
	</li>
);

export default GeneratedText;
