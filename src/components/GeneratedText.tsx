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
	readonly toxic: boolean;
}

const GeneratedText = ({ speaker, text, id, toxic }: Props): JSX.Element => (
	<li key={id}>
		<div className={`speech ${speaker} ${toxic ? "toxic" : ""}`}>{text}</div>
	</li>
);

export default GeneratedText;
