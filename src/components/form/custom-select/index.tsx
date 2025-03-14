import React, {useMemo} from "react";
import {
	Select,
	SelectItem,
	SelectProps as NextUiSelectProps,
} from "@heroui/react";
import {cn} from "@/utils";

interface CustomSelectProps extends Partial<NextUiSelectProps> {
	items?: {label: string; value: string}[];
	classNames?: {
		trigger?: string;
		label?: string;
		[key: string]: string | undefined;
	};
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	items = [],
	classNames = {},
	label = "",
	isRequired = false,
	...rests
}) => {
	// Merge default classNames with user-provided ones
	const mergedClassNames = useMemo(
		() => ({
			...classNames,
			trigger: cn(
				"h-12 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium outline-none transition-all focus:bg-white",
				classNames.trigger
			),
			label: cn("font-semibold text-black", classNames.label),
		}),
		[classNames]
	);

	return (
		<div>
			{label && (
				<label htmlFor="" className="text-sm inline-block font-bold mb-1.5">
					{isRequired ? (
						<>
							{label} <span className="text-red-500">*</span>
						</>
					) : (
						<>{label}</>
					)}
				</label>
			)}
			<Select
				variant="bordered"
				isMultiline={true}
				labelPlacement="outside"
				{...rests}
				classNames={mergedClassNames}
			>
				{items.map((item) => (
					<SelectItem
						key={item.value}
						value={item.value}
						className="data-[hover=true]:transition-colors data-[hover=true]:!bg-primary/20 data-[hover=true]:!text-primary data-[selectable=true]:focus:!bg-primary/20 data-[selectable=true]:focus:!text-primary"
						classNames={{
							title: "font-medium",
							selectedIcon: "font-medium",
						}}
					>
						{item.label}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};

export default CustomSelect;
