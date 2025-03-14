import {Button, Pagination, Switch, Tooltip} from "@heroui/react";

import {useCallback, useEffect, useMemo, useState} from "react";

import {IoMdAdd} from "react-icons/io";

import ConfirmationDialog from "@/components/confirmation-dialog";

import InputSearch from "@/components/input-search";

import rulesetApi from "@/apis/ruleset.api";
import Access from "@/components/Access/access";
import CustomTableV2 from "@/components/table/CustomTableV2";
import {ruleActionObj} from "@/constants";
import {ActionEnum, SubjectEnum} from "@/constants/enum";
import {AppDispatch, useAppDispatch, useAppSelector} from "@/stores";
import {
	deleteRuleAsync,
	deleteRulesetAsync,
	getAllRulesAsync,
} from "@/stores/async-thunks/ruleset-thunk";
import {resetInitialState} from "@/stores/slices/ruleset.slice";
import {FaRegEdit} from "react-icons/fa";
import {FaTrash} from "react-icons/fa6";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ModalAddEditRuleset from "./components/model-ruleset";

const RulesetManagePage = () => {
	const [rulesetId, setRulesetId] = useState("");

	const {id} = useParams();
	// ** States
	const [filterValue, setFilterValue] = useState("");

	const [rowsPerPage, setRowsPerPage] = useState("10");

	const [selectedKeys, setSelectedKeys] = useState(new Set());

	const [page, setPage] = useState(1);

	const [openCreateEdit, setOpenCreateEdit] = useState({
		open: false,
		id: "",
		itemData: null,
	});
	console.log("RulesetManagePage -> openCreateEdit", openCreateEdit);
	const [openDeleteRule, setOpenDeleteRule] = useState({
		open: false,
		id: "",
	});

	// ** redux
	const dispatch: AppDispatch = useAppDispatch();
	const {
		result,
		result_info,
		isSuccessCreateEdit,
		isErrorCreateEdit,
		isLoading,
		messageErrorCreateEdit,
		isErrorDelete,
		isSuccessDelete,
		messageErrorDelete,
		typeError,
	} = useAppSelector((state) => state.ruleset);

	// Calculate start and end indices
	const startIndex = (page - 1) * Number(rowsPerPage) + 1;
	const endIndex = Math.min(
		page * Number(rowsPerPage),
		result_info?.total_count
	);

	const columns = [
		{name: "action", uid: "action"},
		{name: "description", uid: "description"},
		{name: "enabled", uid: "enabled"},
		{name: "Hành động", uid: "actions"},
	];
	const handleCloseCreateEdit = () => {
		setOpenCreateEdit({
			open: false,
			id: "",
			itemData: null,
		});
	};

	const handleUpdateStatus = async (item, rulesetId) => {
		try {
			await rulesetApi.updateRule({
				action: item.action,
				description: item.description,
				enabled: !item.enabled,
				expression: item.expression,
				ref: item.ref,
				zone_id: id,
				id: item.id,
				ruleset_id: rulesetId,
			});
		} catch (error) {}
	};
	const renderCell = useCallback(
		(item, columnKey) => {
			const cellValue = item[columnKey];

			switch (columnKey) {
				case "action":
					return (
						<span className="font-medium">{ruleActionObj[cellValue]}</span>
					);

				case "description":
					return <span>{cellValue}</span>;
				case "enabled":
					return (
						<Switch
							defaultSelected={cellValue}
							onValueChange={() => {
								handleUpdateStatus(item, rulesetId);
							}}
						/>
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
										onClick={() =>
											setOpenCreateEdit({
												open: true,
												id: item?.id,
												itemData: item,
											})
										}
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
										onClick={() =>
											setOpenDeleteRule({
												open: true,
												id: item?.id,
											})
										}
									>
										<FaTrash />
									</span>
								</Tooltip>
							</Access>
						</div>
					);

				default:
					return cellValue;
			}
		},
		[rulesetId]
	);
	const handleFetchAllRulesets = async () => {
		try {
			const res = await rulesetApi.getAllRulesets({
				params: {
					zone_id: id,
				},
			});

			const data = res.result || [];

			const ruleset = data.find(
				(item) => item.phase === "http_request_firewall_custom"
			);

			setRulesetId(ruleset.id || "");
		} catch (error) {}
	};

	useEffect(() => {
		if (id) {
			handleFetchAllRulesets(id);
		}
	}, [id]);
	// Fetch API
	const handleFetchAllRules = () => {
		const query = {
			id: rulesetId,
			params: {
				zone_id: id,
				search: filterValue,
			},
		};

		dispatch(getAllRulesAsync(query));
	};
	const handleCloseConfirmDeleteRuleset = () => {
		setOpenDeleteRule({
			open: false,
			id: "",
		});
	};

	const handleDeleteRuleset = () => {
		dispatch(
			deleteRuleAsync({
				id: openDeleteRule.id,
				zone_id: id,
				ruleset_id: rulesetId,
			})
		);
	};

	useEffect(() => {
		if (rulesetId) {
			handleFetchAllRules();
		}
	}, [rulesetId]);

	useEffect(() => {
		if (isSuccessCreateEdit) {
			if (openCreateEdit.id) {
				toast.success("Chỉnh sửa rule thành công");
			} else {
				toast.success("Tạo mới rule thành công");
			}

			handleFetchAllRules();
			dispatch(resetInitialState());
			handleCloseCreateEdit();
		} else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
			if (typeError) {
				toast.error(messageErrorCreateEdit);
			} else {
				if (openCreateEdit.id) {
					toast.error(`Chỉnh sửa rule thất bại`);
				} else {
					toast.error(`Tạo mới rule thất bại`);
				}
			}
			dispatch(resetInitialState());
		}
	}, [
		isSuccessCreateEdit,
		isErrorCreateEdit,
		messageErrorCreateEdit,
		typeError,
		dispatch,
	]);
	useEffect(() => {
		if (isSuccessDelete) {
			toast.success(`Xóa rule thành công.`);
			handleFetchAllRules();
			handleCloseConfirmDeleteRuleset();
			dispatch(resetInitialState());
		} else if (isErrorDelete && messageErrorDelete) {
			toast.error(`Xóa rule thất bại.`);
			dispatch(resetInitialState());
		}
	}, [isSuccessDelete, isErrorDelete, messageErrorDelete]);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex justify-between gap-3 items-center">
					<div className="max-w-[300px]  w-full">
						<InputSearch onSearchValue={setFilterValue} />
					</div>

					<div className="flex gap-3">
						<Button
							className="text-white h-10 flex-shrink-0 bg-primary px-4 text-base font-medium"
							startContent={<IoMdAdd size={20} />}
							size="sm"
							onPress={() =>
								setOpenCreateEdit({open: true, id: "", itemData: null})
							}
						>
							Thêm mới
						</Button>
					</div>
				</div>
			</div>
		);
	}, [rowsPerPage, selectedKeys]);

	const bottomContent = useMemo(() => {
		return (
			<>
				{result?.length > 0 && (
					<div className="py-2 px-2 flex justify-between items-center">
						<p className="font-medium text-gray-500 text-sm">
							{result_info?.total_pages
								? `Showing ${startIndex} to ${endIndex} of ${result_info?.total_count} entries`
								: ""}
						</p>
						<Pagination
							showControls
							color="primary"
							page={page}
							total={1}
							variant="light"
							onChange={setPage}
						/>
					</div>
				)}
			</>
		);
	}, [
		result?.length,
		result_info?.total_pages,
		result_info?.total_count,
		startIndex,
		endIndex,
		page,
	]);

	return (
		<>
			{openCreateEdit.open && (
				<ModalAddEditRuleset
					isOpen={openCreateEdit.open}
					onOpenChange={handleCloseCreateEdit}
					idRuleset={openCreateEdit.id}
					itemData={openCreateEdit.itemData}
					zoneId={id}
					rulesetId={rulesetId}
					rules={result}
				/>
			)}

			{openDeleteRule.open && (
				<ConfirmationDialog
					isOpen={openDeleteRule.open}
					onCancel={handleCloseConfirmDeleteRuleset}
					onConfirm={handleDeleteRuleset}
					title={"Xóa rule"}
				/>
			)}

			<div className="shadow-medium p-5 rounded-lg">
				<CustomTableV2
					isLoading={isLoading}
					items={result || []}
					renderCell={renderCell}
					columns={columns}
					topContent={topContent}
					bottomContent={bottomContent}
					selectedKeys={selectedKeys}
					setSelectedKeys={setSelectedKeys}
				/>
			</div>
		</>
	);
};

export default RulesetManagePage;
