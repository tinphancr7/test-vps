import {AsyncPaginate} from "react-select-async-paginate";
const CustomMultiSelect = ({
	label,
	isRequired = false,
	isInvalid,
	errorMessage,
	placeholder,
	isMulti = true,
	isClearable= true,
	...rests
}: any) => {
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
			<AsyncPaginate
				isMulti={isMulti}
				isClearable={isClearable}
				{...rests}
				placeholder={placeholder ? placeholder : "--- Chọn ---"}
				menuPosition="fixed"
				debounceTimeout={500}
				isSearchable={true}
				additional={{
					page: 1,
				}}
				className="z-50"
				styles={{
					control: (styles) => ({
						...styles,
						borderColor: "#d1d5db",
						color: "red",
						borderRadius: "8px",
						fontSize: "14px",
					}),
				}}
			/>
			{isInvalid && (
				<p className="text-pink-600 text-sm mt-1.5">{errorMessage}</p>
			)}
		</div>
	);
};

export default CustomMultiSelect;
