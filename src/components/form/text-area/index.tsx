import {cn, Textarea, TextAreaProps} from "@heroui/react";

interface CustomTextareaProps extends Partial<TextAreaProps> {
	label?: string;
	isRequired?: boolean;
	classNames?: {
		trigger?: string;
		label?: string;
		base?: string;
		inputWrapper?: string;
		input?: string;
		[key: string]: string | undefined;
	};
}

const CustomTextarea = ({
	classNames,
	label,
	isRequired,
	...rests
}: CustomTextareaProps) => {
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
			<Textarea
				labelPlacement="outside"
				variant="bordered"
				{...rests}
				// label={
				// 	isRequired ? (
				// 		<>
				// 			{label} <span className="text-red-500">*</span>
				// 		</>
				// 	) : (
				// 		<>{label}</>
				// 	)
				// }
				classNames={{
					inputWrapper: cn(
						" focus-primary flex w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-medium outline-none transition-all focus:bg-white focus:!border-primary ",
						classNames?.inputWrapper
					),
					label: "font-semibold text-black",
				}}
			/>
		</div>
	);
};

export default CustomTextarea;
