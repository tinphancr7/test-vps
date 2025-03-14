import React, {useMemo} from "react";

import {RadioGroup, Radio} from "@heroui/react";

const CustomRadioGroup = ({items = [], ...rests}: any) => {
	return (
		<RadioGroup
			{...rests}
			orientation="horizontal"
			classNames={{
				label: "font-bold text-sm text-black",
				base: "gap-1.5",
			}}
		>
			{items.map((item) => (
				<Radio key={item.value} value={item.value}>
					<span className="text-sm">{item.label}</span>
				</Radio>
			))}
		</RadioGroup>
	);
};

export default CustomRadioGroup;
