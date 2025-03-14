import {AsyncPaginate} from "react-select-async-paginate";

const ReactSelectAsyncPaginate = ({value, loadOptions, ...props}: any) => {
	return (
		<div>
			<AsyncPaginate
				value={value}
				loadOptions={loadOptions}
				menuPosition="fixed"
				debounceTimeout={500}
				isSearchable={true}
				isClearable
				additional={{
					page: 1,
				}}
				styles={{
					control: (styles) => ({
						...styles,

						borderRadius: "8px",
					}),
					option: (styles, {isFocused}) => {
						return {
							...styles,
							backgroundColor: isFocused ? "#999999" : null,
							color: "#333333",
						};
					},
				}}
				{...props}
			/>
		</div>
	);
};

export default ReactSelectAsyncPaginate;
