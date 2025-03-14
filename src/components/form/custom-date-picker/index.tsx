import React, {useMemo} from "react";
import {
	Select,
	SelectItem,
	SelectProps as NextUiSelectProps,
	DatePicker,
} from "@heroui/react";
import {cn} from "@/utils/common";

const CustomDatePicker = ({label, ...rests}: any) => {
	return (
		<div className="bg-background-date">
			<DatePicker
				labelPlacement="outside"
				variant="bordered"
				label={label}
				className="[&>[data-slot='input-wrapper']]:!border [&>[data-slot='input-wrapper']]:!bg-white [&>[data-slot='input-wrapper']]:!rounded-md  [&>[data-slot='label']]:!font-bold "
				{...rests}
			/>
		</div>
	);
};

export default CustomDatePicker;
