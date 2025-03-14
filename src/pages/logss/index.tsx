import {useCallback, useEffect, useState} from "react";

import moment from "moment";

import FilterTable from "@/components/table/FilterTable";

import {useDispatch, useSelector} from "react-redux";

import {useDebounce} from "@/hooks/useDebounce";
import CustomTable from "@/components/table/CustomTable";

import {fetchLog} from "@/stores/slices/log.slice";
import TopFilter from "./components/TopFilter";
import {ActionEnum, SubjectEnum} from "@/constants/enum";
import Access from "@/components/Access/access";
import {AppDispatch} from "@/stores";
import {Chip, Tooltip} from "@heroui/react";

const columns = [
	{
		key: "user",
		label: "Tạo bởi",
	},
	{
		key: "action",
		label: "Hành động",
	},
	{
		key: "message",
		label: "Nội dung",
	},

	{
		key: "ip",
		label: "IP",
	},

	{
		key: "createdAt",
		label: "Ngày tạo",
	},
];

export default function LogPage() {
	const dispatch = useDispatch<AppDispatch>();

	// States for table selection and filters
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [topFilter, setTopFilter] = useState({
		time: null,
		subject: null,
		action: null,
	});
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [filterValue, setFilterValue] = useState("");

	// Debounce search input to optimize performance
	const searchMatch = useDebounce(filterValue, 500);
	const {result, meta, isLoading} = useSelector(
		(state: any) => state?.logs || []
	);

	// Fetch logs based on filters, pagination, and search
	const handleFetchLog = useCallback(
		({page, limit, search, topFilter}: any) => {
			const {time, action, subject} = topFilter || {};
			let startDate = null;
			let endDate = null;

			// Parse start and end date if time filter is applied
			if (time) {
				startDate = moment(time.start?.toDate()).startOf("day").toISOString();
				endDate = moment(time.end?.toDate()).endOf("day").toISOString();
			}

			// Dispatch action to fetch logs
			dispatch(
				fetchLog({page, limit, search, startDate, endDate, action, subject})
			);
		},
		[dispatch]
	);

	// Trigger fetch logs when page, rowsPerPage, searchMatch
	useEffect(() => {
		handleFetchLog({page: 1, limit: rowsPerPage, search: searchMatch});
	}, [rowsPerPage, searchMatch]);

	//
	const handleChangePage = (page: number) => {
		handleFetchLog({
			page,
			limit: rowsPerPage,
			search: searchMatch,
			topFilter,
		});
		setPage(page);
	};

	// Update search input and reset pagination on change
	const onSearchChange = useCallback((value: any) => {
		setFilterValue(value || "");
		setPage(1);
	}, []);

	// click top filter and reset paginationtot
	const handleClickTopFilter = () => {
		handleFetchLog({
			page: 1,
			limit: rowsPerPage,
			search: searchMatch,
			topFilter,
		});
		setPage(1);
	};

	// Clear search input and reset pagination
	const onClear = useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	// Update top filters
	const handleChangeTopFilter = (key: string, value: any) => {
		setTopFilter((prev) => ({...prev, [key]: value}));
	};

	// Clear all top filters and reset pagination
	const handleClearTopFilter = () => {
		setTopFilter({
			time: null,
			subject: null,
			action: null,
		});
		setPage(1);
	};
	const generateStatusAction = (cellValue: string) => {
		switch (cellValue) {
			case "read":
				return (
					<Chip className="bg-blue-100 text-blue-600 capitalize">
						{cellValue}
					</Chip>
				);
			case "create":
				return (
					<Chip className="bg-green-100 text-green-600 capitalize">
						{cellValue}
					</Chip>
				);
			case "update":
				return (
					<Chip className="bg-orange-100 text-orange-600 capitalize">
						{cellValue}
					</Chip>
				);
			case "delete":
				return (
					<Chip className="bg-red-100 text-red-600 capitalize">
						{cellValue}
					</Chip>
				);
			default:
				return (
					<Chip className="bg-gray-100 text-gray-600 capitalize">
						{cellValue}
					</Chip>
				);
		}
	};
	// Function to render table cell content based on columnKey
	const renderCell = useCallback((item: any, columnKey: any) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "message":
				return (
					<Tooltip
						showArrow={true}
						content={
							cellValue ? (
								<p
									dangerouslySetInnerHTML={{__html: cellValue}}
									className="max-w-[800px] w-full"
								></p>
							) : (
								item?.actionName
							)
						}
					>
						{cellValue ? (
							<p
								dangerouslySetInnerHTML={{__html: cellValue}}
								className="text-bold text-black line-clamp-1 w-[400px] "
							></p>
						) : (
							<p className="text-bold text-black line-clamp-1 w-[400px] ">
								{item?.actionName}
							</p>
						)}
					</Tooltip>
				);
			case "action":
				return (
					<p className="text-bold text-black line-clamp-1 w-[400px] ">
						{generateStatusAction(cellValue)}
					</p>
				);
			case "ip":
				return <p className="text-bold text-black ">{cellValue}</p>;

			case "user":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-black">{cellValue?.username}</p>
						<p className="text-bold text-default-400">{cellValue?.email}</p>
					</div>
				);
			case "createdAt":
				return (
					<p className="text-bold text-black">
						{moment(cellValue).format("DD/MM/YYYY HH:mm")}
					</p>
				);
			default:
				return cellValue;
		}
	}, []);
	return (
		<Access subject={SubjectEnum.LOG} action={ActionEnum.READ}>
			<div>
				{/* Search and Filter Table */}
				<FilterTable
					filterValue={filterValue}
					onSearchChange={onSearchChange}
					onClear={onClear}
					selectedKeys={selectedKeys}
					extra={
						<TopFilter
							topFilter={topFilter}
							onChangeTopFilter={handleChangeTopFilter}
							onClearTopFilter={handleClearTopFilter}
							onClickTopFilter={handleClickTopFilter}
						/>
					}
					isShow={false}
				/>

				{/* Table Component with Pagination */}
				<CustomTable
					data={result}
					columns={columns}
					selectedKeys={selectedKeys}
					setSelectedKeys={setSelectedKeys}
					renderCell={renderCell}
					page={page}
					setPage={setPage}
					onChangePage={handleChangePage}
					meta={meta}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					isLoading={isLoading}
					title="Danh sách Log"
				/>
			</div>
		</Access>
	);
}
