import {useController} from "react-hook-form";
import {Textarea} from "@heroui/react";

const MyTextarea = ({
	control,
	errorMessage,
	horizontal = false,
	isRequired = false,
	...props
}: any) => {
	const {field} = useController({
		name: props.name || "",
		control,
		defaultValue: "",
	});
	return (
		<div className={`${horizontal ? "items-center gap-1" : "flex-col"} flex  `}>
			<label
				className=" mb-2 text-sm font-semibold text-black flex items-center gap-1"
				htmlFor=""
			>
				{props.label} {horizontal && <>:</>}
				{isRequired && <span className="text-red-500 font-normal">*</span>}
			</label>
			<Textarea
				{...field}
				{...props}
				placeholder={props.placeholder}
				label=""
				className="max-w-full w-full"
				classNames={{
					inputWrapper:
						"bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent border ",
					input: "!text-black",
					label: "!text-black",
				}}
			/>
			{errorMessage && (
				<div className="text-sm text-red-500">{errorMessage}</div>
			)}
		</div>
	);
};

export default MyTextarea;
