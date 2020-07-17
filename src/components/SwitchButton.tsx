import "./SwitchButton.css";

import React from "react";
import { Button, ButtonProps } from "react-bootstrap";

const SwitchButton = (props: ButtonProps): JSX.Element => (
	<div className="switch-button">
		<Button {...props} variant="warning">
			{"Switch widget"}
		</Button>
	</div>
);

export default SwitchButton;
