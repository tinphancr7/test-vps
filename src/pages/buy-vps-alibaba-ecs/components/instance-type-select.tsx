import {useAppDispatch, useAppSelector} from "@/stores";
import {
	asyncThunkGetImagesAlibabaEcs,
	asyncThunkGetInstanceTypesAlibabaEcs,
} from "@/stores/async-thunks/alibaba-ecs-thunk";
import {
	setArchitectureSelected,
	setArmSelected,
	setGpuSelected,
	setInstanceType,
	setMemoriesSelected,
	setPageNumber,
	setSearchIntType,
	setVCpuSelected,
	setX86Selected,
} from "@/stores/slices/alibaba-ecs.slice";
import {
	Autocomplete,
	AutocompleteItem,
	CircularProgress,
	Input,
	Pagination,
	Radio,
	RadioGroup,
	Select,
	SelectItem,
} from "@heroui/react";
import {generateInstanceFamilyNameBody} from "./utils";
import Container from "@/components/container";
import {useEffect, useMemo} from "react";
import {BiSearch} from "react-icons/bi";
import {useDebounce} from "@/hooks/useDebounce";

function InstanceTypeSelect() {
	const dispatch = useAppDispatch();
	const {
		region,
		zone,
		vCpuSelected,
		memoriesSelected,
		searchIntType,
		x86Selected,
		armSelected,
		gpuSelected,
		architectureSelected,
		instanceType,
		instanceTypesList,
		pageNumber,
		totalPagesInstanceTypes,
		isLoading,
	} = useAppSelector((state) => state.alibabaEcs);

	const searchMatch = useDebounce(searchIntType, 500);

	useEffect(() => {
		const params = {
			RegionId: region,
			ZoneId: zone,
			PageNumber: Number(1),
			InstanceTypeId: searchMatch?.trim(),
		};

		if (zone && region) {
			dispatch(setPageNumber(1));

			dispatch(asyncThunkGetInstanceTypesAlibabaEcs(params));
		}

		return () => {};
	}, [searchMatch]);

	const columns = [
		{
			_id: "InstanceTypeFamily",
			name: "Instance Family",
			classes: "min-w-72 w-full max-w-72",
		},
		{_id: "InstanceTypeId", name: "Instance Type", classes: "min-w-52 w-full"},
		{_id: "CpuCoreCount", name: "vCPUs", classes: "min-w-52 w-full"},
		{_id: "MemorySize", name: "Memory", classes: "min-w-52 w-full"},
		{
			_id: "CpuArchitecture",
			name: "Architecture-Category",
			classes: "min-w-72 max-w-72 w-full",
		},
		{_id: "GPUSpec", name: "GPU/FPGA", classes: "min-w-52 w-full"},
		{_id: "GPUMemorySize", name: "GPU Memory", classes: "min-w-52 w-full"},
		// { name: 'Supported Zones' },
		// { _id: "Processor", name: "Processor", classes: "min-w-52 w-full" },
		{
			_id: "LocalStorageCapacity",
			name: "Local Storage",
			classes: "min-w-52 w-full",
		},
		{
			_id: "PriceInfo",
			name: "Reference Price",
			classes: "min-w-52 w-full sticky right-0",
		},
	];

	const handleChangeInstanceType = (value: string) => {
		dispatch(setInstanceType(value));
		dispatch(
			asyncThunkGetImagesAlibabaEcs({
				RegionId: region,
				InstanceType: value,
			})
		);
	};

	const renderCell = (item: any, columnKey: string) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "InstanceTypeFamily":
				return generateInstanceFamilyNameBody(cellValue);

			case "CpuCoreCount":
				return `${cellValue} vCPU`;

			case "MemorySize":
				return `${cellValue} GiB`;

			case "CpuArchitecture":
				return item?.InstanceCategory
					? `${cellValue} - ${item?.InstanceCategory}`
					: ``;

			case "GPUSpec":
				if (!cellValue) return "";

				return `${item?.GPUAmount} * ${cellValue}`;

			case "GPUMemorySize":
				if (!cellValue) return "";

				return `${item?.GPUAmount} * ${cellValue} GB`;

			case "PriceInfo":
				return (
					<p className="text-center font-medium tracking-wide">
						$ {cellValue?.OriginalPrice} USD/ tháng
					</p>
				);

			default:
				return cellValue || "";
		}
	};

	const handlePageChange = (value: string | number) => {
		dispatch(setPageNumber(value));

		dispatch(
			asyncThunkGetInstanceTypesAlibabaEcs({
				RegionId: region,
				ZoneId: zone,
				PageNumber: Number(value),
			})
		);
	};

	const vCpusOptions = [
		{label: "1 vCPUs", value: "1"},
		{label: "2 vCPUs", value: "2"},
		{label: "4 vCPUs", value: "4"},
		{label: "8 vCPUs", value: "8"},
		{label: "12 vCPUs", value: "12"},
		{label: "16 vCPUs", value: "16"},
		{label: "20 vCPUs", value: "20"},
		{label: "24 vCPUs", value: "24"},
		{label: "28 vCPUs", value: "28"},
		{label: "32 vCPUs", value: "32"},
		{label: "40 vCPUs", value: "40"},
		{label: "48 vCPUs", value: "48"},
		{label: "52 vCPUs", value: "52"},
		{label: "56 vCPUs", value: "56"},
		{label: "64 vCPUs", value: "64"},
		{label: "72 vCPUs", value: "72"},
		{label: "80 vCPUs", value: "80"},
		{label: "96 vCPUs", value: "96"},
		{label: "104 vCPUs", value: "104"},
		{label: "128 vCPUs", value: "128"},
		{label: "160 vCPUs", value: "160"},
		{label: "192 vCPUs", value: "192"},
	];

	const memoriesOptions = [
		{label: "0.5 GiB", value: "0.5"},
		{label: "1 GiB", value: "1"},
		{label: "2 GiB", value: "2"},
		{label: "4 GiB", value: "4"},
		{label: "8 GiB", value: "8"},
		{label: "10 GiB", value: "10"},
		{label: "12 GiB", value: "12"},
		{label: "15 GiB", value: "15"},
		{label: "16 GiB", value: "16"},
		{label: "24 GiB", value: "24"},
		{label: "30 GiB", value: "30"},
		{label: "31 GiB", value: "31"},
		{label: "32 GiB", value: "32"},
		{label: "48 GiB", value: "48"},
		{label: "60 GiB", value: "60"},
		{label: "62 GiB", value: "62"},
		{label: "64 GiB", value: "64"},
		{label: "88 GiB", value: "88"},
		{label: "92 GiB", value: "92"},
		{label: "93 GiB", value: "93"},
		{label: "96 GiB", value: "96"},
		{label: "112 GiB", value: "112"},
		{label: "120 GiB", value: "120"},
		{label: "128 GiB", value: "128"},
		{label: "155 GiB", value: "155"},
		{label: "176 GiB", value: "176"},
		{label: "186 GiB", value: "186"},
		{label: "188 GiB", value: "188"},
		{label: "192 GiB", value: "192"},
		{label: "224 GiB", value: "224"},
		{label: "256 GiB", value: "256"},
		{label: "288 GiB", value: "288"},
		{label: "310 GiB", value: "310"},
		{label: "346 GiB", value: "346"},
		{label: "352 GiB", value: "352"},
		{label: "368 GiB", value: "368"},
		{label: "372 GiB", value: "372"},
		{label: "376 GiB", value: "376"},
		{label: "384 GiB", value: "384"},
		{label: "480 GiB", value: "480"},
		{label: "512 GiB", value: "512"},
		{label: "704 GiB", value: "704"},
		{label: "736 GiB", value: "736"},
		{label: "752 GiB", value: "752"},
		{label: "768 GiB", value: "768"},
		{label: "960 GiB", value: "960"},
		{label: "1024 GiB", value: "1024"},
		{label: "1920 GiB", value: "1920"},
	];

	const cpuArchitectureX86Options = [
		{label: "General-purpose", value: "General-purpose"},
		{label: "Compute-optimized", value: "Compute-optimized"},
		{label: "Memory-optimized", value: "Memory-optimized"},
		{label: "Big data", value: "Big data"},
		{label: "Local SSDs", value: "Local SSDs"},
		{label: "High Clock Speed", value: "High Clock Speed"},
		{label: "Shared", value: "Shared"},
		{label: "Enhanced", value: "Enhanced"},
	];

	const cpuArchitectureArmBasedOptions = [
		{label: "General-purpose", value: "General-purpose"},
		{label: "Compute-optimized", value: "Compute-optimized"},
		{label: "Memory-optimized", value: "Memory-optimized"},
	];

	const gpuSpecOptions = [
		{label: "A10 GPUs", value: "NVIDIA A10"},
		{label: "V100 GPUs", value: "NVIDIA V100"},
		{label: "T4 GPUs", value: "NVIDIA T4"},
		{label: "P100 GPUs", value: "NVIDIA P100"},
		{label: "P4 GPUs", value: "NVIDIA P4"},
		{label: "GRID Virtualization", value: "NVIDIA A10*1/3"},
	];

	const handleChangeFilterValue = (key: string, value: any) => {
		let payload = value;

		const params: any = {
			RegionId: region,
			ZoneId: zone,
			PageNumber: Number(1),
		};

		if (["x86", "arm", "gpu"].includes(key)) {
			payload = [...value][0];
		}

		if (key === "x86") {
			dispatch(setX86Selected(payload));

			params["InstanceCategory"] = payload;
			params["CpuArchitecture"] = key.toUpperCase();
		}

		if (key === "arm") {
			dispatch(setArmSelected(payload));

			params["InstanceCategory"] = payload;
			params["CpuArchitecture"] = key.toUpperCase();
		}

		if (key === "gpu") {
			dispatch(setGpuSelected(payload));

			params["GPUSpec"] = payload;
		}

		if (key !== architectureSelected) {
			dispatch(setArchitectureSelected(key));
		}

		if (key === "vCpus") {
			dispatch(setVCpuSelected(payload));
			dispatch(setMemoriesSelected(""));
			dispatch(setSearchIntType(""));

			params["CpuCoreCount"] = payload;
		}

		if (key === "memories") {
			dispatch(setMemoriesSelected(payload));
			dispatch(setVCpuSelected(""));
			dispatch(setSearchIntType(""));

			params["MemorySize"] = payload;
		}

		if (key === "searchIntType") {
			dispatch(setSearchIntType(payload));
			dispatch(setVCpuSelected(""));
			dispatch(setMemoriesSelected(""));

			return;
		}

		dispatch(setPageNumber(1));

		dispatch(asyncThunkGetInstanceTypesAlibabaEcs(params));
	};

	const filterArchitectures = useMemo(() => {
		return [
			{
				key: "x86",
				label: "x86",
				options: cpuArchitectureX86Options,
				value: x86Selected,
			},
			{
				key: "arm",
				label: "Arm-based",
				options: cpuArchitectureArmBasedOptions,
				value: armSelected,
			},
			{
				key: "gpu",
				label: "GPU/FPGA/ASIC",
				options: gpuSpecOptions,
				value: gpuSelected,
			},
		];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gpuSelected, gpuSpecOptions, x86Selected]);

	const filterCondition = useMemo(() => {
		return [
			{
				key: "vCpus",
				label: "Select a vCPUs...",
				type: "autocomplete",
				options: vCpusOptions,
				value: vCpuSelected,
			},
			{
				key: "memories",
				label: "Select a Memory...",
				type: "autocomplete",
				options: memoriesOptions,
				value: memoriesSelected,
			},
			{
				key: "searchIntType",
				label: "Search by instance type name...",
				type: "input",
				options: gpuSpecOptions,
				value: gpuSelected,
			},
		];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gpuSelected, gpuSpecOptions, memoriesSelected]);

	const handleChangeArchitectureSelected = (value: string) => {
		let payload = value;
		const params: any = {
			RegionId: region,
			ZoneId: zone,
			PageNumber: Number(1),
			CpuArchitecture: value.toUpperCase(),
		};

		if (value === architectureSelected) {
			payload = "";
			params["CpuArchitecture"] = "";
		}

		dispatch(setArchitectureSelected(payload));
		dispatch(setPageNumber(1));
		dispatch(asyncThunkGetInstanceTypesAlibabaEcs(params));
	};

	return (
		<div className="grid grid-cols-7 gap-1 w-full">
			<div className="flex items-center gap-1">
				<h3 className="text-base tracking-wide font-medium">Loại Instance</h3>
			</div>

			<div className="col-span-6">
				<div className="mb-4 grid grid-cols-8 gap-3 items-center">
					<h3 className="tracking-wide text-base">Điều kiện lọc</h3>

					<div className="col-span-7 grid grid-cols-12 gap-3">
						{filterCondition?.map((item: any) => {
							if (item?.type === "autocomplete") {
								return (
									<div className="col-span-3">
										<Autocomplete
											aria-label={"image-platform"}
											fullWidth
											defaultItems={item?.options || []}
											labelPlacement="outside"
											placeholder={item?.label}
											radius="sm"
											variant="bordered"
											inputProps={{
												classNames: {
													label: "text-dark font-medium",
													inputWrapper:
														"border border-slate-400 group-data-[open=true]:border-primary group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
												},
											}}
											scrollShadowProps={{
												isEnabled: false,
											}}
											selectedKey={item?.value}
											onSelectionChange={(value) =>
												handleChangeFilterValue(item?.key, value)
											}
										>
											{(option: any) => (
												<AutocompleteItem key={option?.value}>
													{option?.label}
												</AutocompleteItem>
											)}
										</Autocomplete>
									</div>
								);
							}

							return (
								<Input
									isClearable
									variant="bordered"
									radius="sm"
									classNames={{
										base: "col-span-6",
										inputWrapper:
											"bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-1 group-data-[focus=true]:border-primary",
									}}
									placeholder={item?.label}
									startContent={<BiSearch className="text-black" />}
									value={searchIntType}
									onValueChange={(value) =>
										handleChangeFilterValue(item?.key, value)
									}
								/>
							);
						})}
					</div>
				</div>

				<div className="mb-4 grid grid-cols-8 gap-3 items-center">
					<h3 className="tracking-wide text-base">Mô hình</h3>

					{filterArchitectures?.map((item: any) => (
						<div
							key={item?.key}
							className={`col-span-2 border ${
								architectureSelected === item?.key
									? "border-primary-500"
									: "border-gray-200"
							} divide-y-2 cursor-pointer select-none hover:border-primary-500`}
							onClick={() => handleChangeArchitectureSelected(item?.key)}
						>
							<h3 className="p-2 text-center bg-gray-200/50 text-base font-medium">
								{item?.label}
							</h3>

							<Select
								items={item?.options}
								placeholder="All Categories"
								selectionMode="single"
								classNames={{
									base: "w-full",
									label: "text-dark font-medium",
									value: "text-center text-base",
									trigger:
										"text-dark shadow-none border-none min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
								}}
								disallowEmptySelection={false}
								selectedKeys={new Set([item?.value])}
								onSelectionChange={(value) =>
									handleChangeFilterValue(item?.key, value)
								}
							>
								{(item: any) => (
									<SelectItem key={item?.value} textValue={item?.label}>
										{item?.label}
									</SelectItem>
								)}
							</Select>
						</div>
					))}
				</div>

				{isLoading?.instanceTypesList ? (
					<Container className="flex items-center justify-center h-60">
						<CircularProgress color="primary" aria-label="Loading..." />
					</Container>
				) : (
					<div className="max-w-screen-xl w-full overflow-x-auto scroll-main-x">
						<div className="border border-gray-200 inline-block">
							{/* Header */}
							<div className="flex border-b border-gray-200 bg-primary">
								<div className="w-6 min-w-4 h-4" />
								<div className="flex flex-row items-center p-2 gap-2">
									{columns?.map((col) => (
										<div
											key={col?._id}
											className={`${
												col?.classes || ""
											} text-center font-medium text-white text-base bg-primary`}
										>
											<h3>{col?.name}</h3>
										</div>
									))}
								</div>
							</div>

							{/* Instance Types List */}
							{!isLoading?.instanceTypesList && !instanceTypesList?.length ? (
								<div className="flex items-center p-6 justify-center">
									<p className="text-base tracking-wide text-gray-300">
										Không tìm thấy loại phiên bản nào. Sửa đổi điều kiện lọc.
									</p>
								</div>
							) : (
								<RadioGroup
									label=""
									size="sm"
									classNames={{
										label: "none",
										wrapper: "divide-y-1 gap-0",
									}}
									value={instanceType}
									onValueChange={handleChangeInstanceType}
								>
									{instanceTypesList?.map((it: any, index: number) => (
										<Radio
											key={index}
											value={it?.InstanceTypeId}
											classNames={{
												base: "max-w-full w-full m-0 hover:bg-primary/20",
												labelWrapper: "w-full",
												label: "w-full flex flex-row",
											}}
										>
											{columns?.map((col) => (
												<div
													key={col?._id}
													className={`${
														col?.classes || ""
													} tracking-wide text-center text-base py-2 ${
														col?._id === "PriceInfo"
															? "bg-white"
															: "bg-transparent"
													}`}
												>
													{renderCell(it, col?._id)}
												</div>
											))}
										</Radio>
									))}
								</RadioGroup>
							)}
						</div>
					</div>
				)}

				<div className="flex items-center justify-end mt-4">
					<Pagination
						showControls
						color="primary"
						page={pageNumber || 1}
						total={totalPagesInstanceTypes || 1}
						variant="flat"
						onChange={handlePageChange}
						classNames={{
							item: "font-medium [&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
							prev: "[&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
							next: "[&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default InstanceTypeSelect;
