import {useCallback, useEffect, useState} from "react";
import {Avatar, AvatarGroup, Tooltip} from "@heroui/react";
import {FaRegEdit, FaTrash} from "react-icons/fa";
import moment from "moment";

import FilterTable from "@/components/table/FilterTable";

import {useDispatch, useSelector} from "react-redux";

import {useDebounce} from "@/hooks/useDebounce";
import CustomTable from "@/components/table/CustomTable";
import ModalDeleteTeam from "./components/ModalDeleteTeam";

import ModalTeam from "./components/ModalTeam";
import Access from "@/components/Access/access";
import {ActionEnum, SubjectEnum} from "@/constants/enum";
import {AppDispatch} from "@/stores";
import {fetchTeam} from "@/stores/async-thunks/team-thunk";

const columns = [
	{
		key: "name",
		label: "Tên",
	},

	{
		key: "managers",
		label: "Nguời quản lý",
	},
	{
		key: "telegramIds",
		label: "Telegram ID",
	},

	// {
	// 	key: "user",
	// 	label: "Tạo bởi",
	// },
	{
		key: "createdAt",
		label: "Ngày tạo",
	},

	{
		key: "actions",
		label: "Hành động",
	},
];

export default function TeamPage() {
	// Redux dispatch hook
	const dispatch = useDispatch<AppDispatch>();

	// States for managing selection, filter, pagination, and modal visibility
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [dataInit, setDataInit] = useState(null); // Data for editing
	const [page, setPage] = useState(1);

	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [filterValue, setFilterValue] = useState("");

	// Debounce the search input for performance optimization
	const searchMatch = useDebounce(filterValue, 500);

	// Fetching teams from the Redux store
	const {result, meta, isLoading} = useSelector(
		(state: any) => state?.teams || []
	);

	// Consolidate modal state into a single object
	const [modalState, setModalState] = useState({
		isAddEditOpen: false,
		isDeleteOpen: false,
	});

	// Fetch teams with pagination, filtering, and search
	const handleFetchTeam = useCallback(
		({page, limit, search}: any) => {
			dispatch(fetchTeam({page, limit, search}));
		},
		[dispatch]
	);

	const handleChangePage = (page: number) => {
		handleFetchTeam({
			page,
			limit: rowsPerPage,
			search: searchMatch,
		});
		setPage(page);
	};

	// Automatically fetch teams when page, rows per page, or search changes
	useEffect(() => {
		handleFetchTeam({page: 1, limit: rowsPerPage, search: searchMatch});
	}, [rowsPerPage, searchMatch]);

	// Handle search input change
	const onSearchChange = useCallback((value: any) => {
		setFilterValue(value || "");
		setPage(1); // Reset to the first page when search changes
	}, []);

	// Clear search input
	const onClear = useCallback(() => {
		setFilterValue("");
		setPage(1); // Reset to the first page after clearing
	}, []);

	// Render the appropriate cell content based on the column key
	const renderCell = useCallback((item: any, columnKey: any) => {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "name":
				return <p className="text-bold text-black">{cellValue}</p>;
			case "managers":
				return (
					<div className="flex items-center justify-center">
						<AvatarGroup max={4} className="gap-1">
							{cellValue?.map((manager: any) => (
								<Tooltip
									key={manager?._id}
									placement="top"
									classNames={{content: "p-0 rounded-md"}}
									content={
										<span className="py-1 px-2 text-wrap text-xs bg-slate-600 text-white">
											{manager?.username}
										</span>
									}
								>
									<Avatar
										showFallback
										src={manager.avatarUrl || "default-avatar.png"}
									/>
								</Tooltip>
							))}
						</AvatarGroup>
					</div>
				);
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
			case "actions":
				return (
					<div className="relative flex items-center justify-center gap-4">
						{/* Edit Action */}
						<Access
							subject={SubjectEnum.TEAM}
							action={ActionEnum.UPDATE}
							hideChildren
						>
							<Tooltip className="bg-blue-600 text-white" content="Chỉnh sửa">
								<span
									className="text-lg text-blue-600 cursor-pointer"
									onClick={() => {
										setDataInit(item);
										setModalState((prev) => ({...prev, isAddEditOpen: true}));
									}}
								>
									<FaRegEdit />
								</span>
							</Tooltip>
						</Access>
						{/* Delete Action */}
						<Access
							subject={SubjectEnum.TEAM}
							action={ActionEnum.DELETE}
							hideChildren
						>
							<Tooltip className="bg-red-600 text-white" content="Xóa">
								<span
									className="text-lg text-red-600 cursor-pointer"
									onClick={() => {
										setSelectedKeys(new Set([item._id]));
										setModalState((prev) => ({...prev, isDeleteOpen: true}));
									}}
								>
									<FaTrash />
								</span>
							</Tooltip>
						</Access>
					</div>
				);
			case "telegramIds":
				return (
					<p className="text-[14px]">
						{Array.isArray(cellValue) && cellValue.length > 0
							? cellValue.map((id, index) => (
									<span key={index}>
										{id}
										{index < cellValue.length - 1 && ", "}
									</span>
							  ))
							: "(Trống)"}
					</p>
				);
			default:
				return cellValue;
		}
	}, []);

	return (
		<Access subject={SubjectEnum.TEAM} action={ActionEnum.READ}>
			<div>
				{/* FilterTable handles filtering and search */}
				<FilterTable
					filterValue={filterValue}
					onSearchChange={onSearchChange}
					onClear={onClear}
					onOpenAddEdit={() =>
						setModalState((prev) => ({...prev, isAddEditOpen: true}))
					}
					onOpenDelete={() =>
						setModalState((prev) => ({...prev, isDeleteOpen: true}))
					}
					selectedKeys={selectedKeys}
					subject={SubjectEnum.TEAM}
					actionCreate={ActionEnum.CREATE}
					actionDelete={ActionEnum.DELETE}
				/>
				{/* CustomTable renders paginated team data */}
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
					title="Danh sách Team"
				/>

				{/* Add/Edit Modal */}
				{modalState.isAddEditOpen && (
					<ModalTeam
						dataInit={dataInit}
						isOpen={modalState.isAddEditOpen}
						onClose={() =>
							setModalState((prev) => ({...prev, isAddEditOpen: false}))
						}
						setDataInit={setDataInit}
						reloadTable={() =>
							handleFetchTeam({page: 1, limit: rowsPerPage, search: ""})
						}
					/>
				)}

				{/* Delete Modal */}
				{modalState.isDeleteOpen && (
					<ModalDeleteTeam
						isOpen={modalState.isDeleteOpen}
						onClose={() =>
							setModalState((prev) => ({...prev, isDeleteOpen: false}))
						}
						selectedKeys={selectedKeys}
						setSelectedKeys={setSelectedKeys}
						reloadTable={() => handleFetchTeam({page, limit: rowsPerPage})}
					/>
				)}
			</div>
		</Access>
	);
}
