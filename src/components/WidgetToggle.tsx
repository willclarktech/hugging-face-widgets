import "./WidgetToggle.css";

import React from "react";
import { Button, ButtonProps } from "react-bootstrap";

const WidgetToggle = (props: ButtonProps): JSX.Element => (
	<div className="widget-toggle">
		<Button {...props} variant="warning">
			{"Switch widget"}
		</Button>
	</div>
);

export default WidgetToggle;
