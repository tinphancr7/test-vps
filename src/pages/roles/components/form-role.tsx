import useForm from "@/hooks/use-form";
import {
	actionsRole,
	inititalFormState,
	permissionState,
	RoleAction,
} from "./constants";
import {
	asyncThunkGetPermissionsByRoleId,
	asyncThunkCreateNewRole,
	asyncThunkUpdatePermissionRole,
} from "@/stores/async-thunks/role-thunk";
import { resetModal } from "@/stores/slices/modal-slice";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores";
import { GoShieldCheck, GoShieldX } from "react-icons/go";
import { Button, Input, ModalFooter, Switch } from "@heroui/react";
import showToast from "@/utils/toast";

interface FormRoleProps {
	dataEdit?: any;
	isEdit: boolean;
	isRead: boolean;
}

function FormRole({ dataEdit, isEdit, isRead }: FormRoleProps) {
	const {
		isEmptyValues,
		getValues,
		getValue,
		getState,
		setValue,
		validateForm,
		setErrorMessage,
	} = useForm(inititalFormState);
	const dispatch = useAppDispatch();
	const { isSubmitting } = useAppSelector((state) => state.roles);

	const initializeDataPermissionRole = useCallback(async () => {
		const { permissionsRole } = await dispatch(
			asyncThunkGetPermissionsByRoleId(dataEdit?._id)
		).unwrap();

		setValue("name", dataEdit?.name);

		permissionsRole?.forEach((perms) => {
			const key = perms.subject;

			if (perms?.action.length) {
				let newActions;

				if (perms?.action?.length === 4) {
					newActions = perms?.action?.reduce(
						(values: RoleAction, action: string) => ({
							...values,
							[action]: true,
							all: true,
						}),
						[]
					);
				} else {
					newActions = perms?.action?.reduce(
						(values: RoleAction, action: string) => ({
							...values,
							[action]: perms?.action.includes(action)
								? true
								: false,
						}),
						[]
					);
				}

				setValue(key, newActions);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataEdit, dispatch]);

	useEffect(() => {
		if (isEdit || isRead) {
			initializeDataPermissionRole();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, isRead]);

	const handleValueChange = (key: string, value: any) => {
		setValue(key, value);
		setErrorMessage(key, value && "");
	};

	const columnsPermission = useMemo(() => {
		const defaultCols = [
			{
				key: "name",
				title: "Tên phân quyền",
				classes: "pl-1 col-span-3 text-left",
			},
			{ key: "read", title: "Xem", classes: "col-span-1 text-center" },
			{ key: "create", title: "Thêm", classes: "col-span-1 text-center" },
			{ key: "update", title: "Sửa", classes: "col-span-1 text-center" },
			{ key: "delete", title: "Xóa", classes: "col-span-1 text-center" },
		];

		if (!isRead) {
			defaultCols.push({
				key: "all",
				title: "Tất cả",
				classes: "col-span-1 text-center",
			});
		}

		return defaultCols;
	}, [isRead]);

	const renderCell = useCallback(
		(key: string, col: any) => {
			if (!isRead) {
				const handleChangeSwitch = (
					key: string,
					action: string,
					value: boolean
				) => {
					let newValue: any;

					if (action === "all") {
						newValue = {
							// ...getValue(key),
							[action]: value,
							create: value,
							read: value,
							update: value,
							delete: value,
						};
					}

					if (action !== "all") {
						newValue = {
							...getValue(key),
							[action]: value,
						};

						const allAction = Object.keys(actionsRole).every(
							(act) => act !== "all" && newValue[act]
						);

						if (allAction) {
							newValue = {
								...newValue,
								all: allAction,
							};
						} else {
							newValue = {
								...newValue,
								all: false,
							};
						}
					}

					setValue(key, newValue);
				};

				return (
					<Switch
						size="sm"
						isSelected={getValue(key)[col?.key]}
						onValueChange={(val) =>
							handleChangeSwitch(key, col?.key, val)
						}
					/>
				);
			}

			if (
				(isRead && getValue(key)[col?.key]) ||
				dataEdit?.name.toLowerCase().includes("supper admin")
			) {
				return <GoShieldCheck size={20} color="green" />;
			}

			return <GoShieldX size={20} color="red" />;
		},
		[dataEdit, getValue, isRead, setValue]
	);

	const onSubmit = async () => {
		if (isEmptyValues) {
			return validateForm();
		}

		const { name, ...rest } = getValues();

		const valuePermissions = Object.keys({ ...rest })?.reduce(
			(values, it) => {
				const roleValue: any = getValues()[it];

				const valueActions = Object.keys(roleValue).filter(
					(action) => action !== "all" && roleValue[action]
				);

				return {
					...values,
					[it]: valueActions,
				};
			},
			{}
		);

		const payload = {
			role: name,
			permission: valuePermissions,
		};

		if (isEdit) {
			const { status } = await dispatch(
				asyncThunkUpdatePermissionRole({
					id: dataEdit?._id,
					payload,
				})
			).unwrap();

			if (status === 1) {
				showToast("Cập nhật quyền hạn thành công!", "success");
                dispatch(resetModal());
			}
		} else {
			const { status } = await dispatch(
				asyncThunkCreateNewRole(payload)
			).unwrap();

			if (status === 1) {
				showToast("Thêm quyền hạn thành công!", "success");
                dispatch(resetModal());
			}
		}
	};

	return (
		<div className="h-full relative flex flex-col justify-between">
			<div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
				{/* Role name */}
				<Input
					radius="sm"
					color="primary"
					variant="bordered"
					labelPlacement="outside"
					classNames={{
						inputWrapper:
							"h-10 data-[hover=true]:border-primary border border-slate-400",
						label: "text-dark font-medium",
					}}
					type={getState("name").type}
					label={getState("name").label}
					placeholder={`${getState("name").label}`}
					value={getState("name").value}
					onValueChange={(value) => handleValueChange("name", value)}
					errorMessage={getState("name").errorMessage}
					isInvalid={!!getState("name").errorMessage}
					onKeyDown={(event) => event.key === "Enter" && onSubmit()}
					isDisabled={!!isRead}
				/>

				{/* Header */}
				<div className="grid grid-cols-8 gap-2 bg-primary py-1 rounded-sm">
					{columnsPermission?.map((col, index) => (
						<div
							key={index}
							className={`text-light text-base font-semibold ${col?.classes}`}
						>
							{col.title}
						</div>
					))}
				</div>

				{/* Permission Role */}
				<div className="grid grid-cols-8 gap-2 items-center">
					{Object.keys(permissionState).map((key) => (
						<Fragment key={key}>
							{/* Role Name */}
							<div
								className={`text-sm font-medium text-left col-span-3 text-wrap`}
							>
								{getState(key).label}
							</div>

							{/* Role Actions */}
							{columnsPermission?.map(
								(col, idx) =>
									idx > 0 && (
										<div
											key={idx}
											className={`col-span-1 flex justify-center items-center`}
										>
											{renderCell(key, col)}
										</div>
									)
							)}
						</Fragment>
					))}
				</div>
			</div>

			{/* Button */}
			{!isRead && (
				<ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
					<Button
						variant="solid"
						color="danger"
						className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
						onPress={() => dispatch(resetModal())}
					>
						Hủy
					</Button>

					<Button
						variant="solid"
						className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
						isLoading={isSubmitting}
						onPress={onSubmit}
					>
						Xác nhận
					</Button>
				</ModalFooter>
			)}
		</div>
	);
}

export default FormRole;
