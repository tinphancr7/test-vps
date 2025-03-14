import CustomTextField from "@/components/form/text-field";

import React, {useEffect, useState} from "react";
import {useDebounce} from "@/hooks/useDebounce";
const InputSearch = ({onSearchValue}) => {
	const [filterValue, setFilterValue] = useState("");

	// use debounce

	const debouncedFilterValue = useDebounce(filterValue);

	useEffect(() => {
		onSearchValue(debouncedFilterValue);
	}, [debouncedFilterValue]);

	return (
		<CustomTextField
			isClearable
			placeholder="Tìm kiếm ..."
			className="h-10"
			size="sm"
			type="search"
			// startContent={<SearchIcon className="text-default-500" />}
			value={filterValue}
			variant="bordered"
			onClear={() => setFilterValue("")}
			onValueChange={setFilterValue}
		/>
	);
};

export default InputSearch;
