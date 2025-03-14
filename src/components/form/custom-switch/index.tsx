import {Switch} from "@heroui/react";
import React from "react";

const CustomSwitch = ({label, ...rests}) => {
	return (
		<Switch
			classNames={{
				label: "text-sm font-bold",
			}}
			{...rests}
		>
			{label}
		</Switch>
	);
};

export default CustomSwitch;
