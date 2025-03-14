import CustomMultiSelect from "@/components/form/custom-multi-select";
import CustomSwitch from "@/components/form/custom-switch";

import InputNumberField from "@/components/form/input-number-field";
import CustomTextField from "@/components/form/text-field";

import CustomSelect from "@/components/form/custom-select";
import ModalNextUI from "@/components/modal";
import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {domainProviderSchema} from "@/utils/validation";
import {yupResolver} from "@hookform/resolvers/yup";
import CustomTextarea from "@/components/form/text-area";
import teamApi from "@/apis/team.api";

import {toast} from "react-toastify";
import NotifyMessage from "@/utils/notify";
import domainProviderApi from "@/apis/domain-provider";

const ModalAddEditDomainProvider = ({
	isOpen,
	onOpenChange,
	idDomainProvider,
	reloadTable,
}: any) => {
	const defaultValues = {
		title: "",
		name: "",
		apiKey: "",
		secret: "",
		exchangeRate: 0,
		username: "",
		clientIp: "",

		isOpen: true,
		teams: null,
	};

	const {
		handleSubmit,
		control,
		reset,
		setValue,
		watch,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues,
		mode: "onChange",

		resolver: yupResolver(domainProviderSchema),
	});

	const loadOptionsData = async (
		searchQuery: string,
		_loadedOptions: any,
		{page}: any
	) => {
		const res = await teamApi.callFetchTeam({
			search: searchQuery,
			page: page,
			limit: 10,
		});

		const items = res?.data?.data?.result.map((item: any) => ({
			label: item?.name,
			value: item?._id,
		}));

		return {
			options: items,
			hasMore: res?.data?.data?.meta?.totalPages > page,
			additional: {
				page: searchQuery ? 1 : page + 1,
			},
		};
	};

	const onSubmit = async (data: any) => {
		const teams = data.teams.map((item: any) => item.value);
		const newData = {
			...data,
			teams,
		};

		const isUpdate = !!idDomainProvider;
		const action = isUpdate
			? domainProviderApi.callUpdateDomainProvider(newData, idDomainProvider)
			: domainProviderApi.callCreateDomainProvider(newData);

		const successMessage = isUpdate
			? "Cập nhật nhà cung cấp thành công"
			: "Thêm mới nhà cung cấp thành công";
		const errorMessage = isUpdate
			? "Cập nhật nhà cung cấp không thành công"
			: "Thêm mới nhà cung cấp không thành công";

		try {
			const res = await action;
			if (res?.data) {
				toast.success(successMessage);
				onOpenChange();
				reloadTable();
			} else {
				NotifyMessage(errorMessage, "error");
			}
		} catch (error: any) {
			console.log("error", error);
			NotifyMessage(error?.response?.data?.message || errorMessage, "error");
		}
	};
	// Fetch API
	const fetchDetailsDomainProvider = async (id: string) => {
		try {
			const res = await domainProviderApi.callFetchDomainProviderById(id);
			const data = res?.data?.data;
			if (data) {
				reset({
					...data,
					teams: data?.teams?.map((item: any) => ({
						label: item?.name,
						value: item?._id,
					})),
				});
			}
		} catch (e) {
			console.error(e); // Optional: Add error-handling logic
		}
	};

	useEffect(() => {
		if (!isOpen) {
			reset({
				// Reset with default values when the modal is closed
				...defaultValues,
			});
		} else if (idDomainProvider && isOpen) {
			// Fetch order details if `idDomainProvider` exists and modal is open
			fetchDetailsDomainProvider(idDomainProvider);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, idDomainProvider]);
	return (
		<ModalNextUI
			title={
				idDomainProvider ? "Cập nhật nhà cung cấp" : "Thêm mới nhà cung cấp"
			}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={handleSubmit(onSubmit)}
			isSubmitting={isSubmitting}
			size="5xl"
			idItem={idDomainProvider}
		>
			<div className=" p-4 grid grid-cols-2 gap-4 w-full">
				<Controller
					control={control}
					name="name"
					render={({field}) => (
						<CustomSelect
							{...field}
							isRequired
							selectedKeys={[field.value]}
							label="Nhà cung cấp"
							placeholder="--- Chọn ---"
							isInvalid={!!errors?.name?.message}
							errorMessage={errors?.name?.message}
							items={[
								{label: "Dynadot", value: "dynadot"},
								{label: "Gname", value: "gname"},
								{label: "Name", value: "name"},
								{label: "Epik", value: "epik"},
								{label: "Godaddy", value: "godaddy"},
								{label: "Name Cheap", value: "name-cheap"},
							]}
						/>
					)}
				/>

				<Controller
					control={control}
					name="title"
					render={({field}) => (
						<CustomTextField
							{...field}
							label="Tên kết nối"
							placeholder="Nhập dữ liệu"
						/>
					)}
				/>

				<Controller
					control={control}
					name="exchangeRate"
					render={({field}) => (
						<InputNumberField
							{...field}
							isRequired
							label="Tỷ giá"
							placeholder="Nhập dữ liệu"
							isInvalid={!!errors?.exchangeRate}
							errorMessage={errors?.exchangeRate?.message}
						/>
					)}
				/>

				<Controller
					control={control}
					name="teams"
					render={({field}) => (
						<CustomMultiSelect
							{...field}
							isRequired
							label="Team"
							placeholder="--- Chọn ---"
							loadOptions={loadOptionsData}
							isInvalid={!!errors?.teams}
							errorMessage={errors?.teams?.message}
						/>
					)}
				/>
				<Controller
					control={control}
					name="username"
					render={({field}) => (
						<CustomTextField
							{...field}
							label="Tên đăng nhập"
							placeholder="Nhập dữ liệu"
						/>
					)}
				/>
				<Controller
					control={control}
					name="clientIp"
					render={({field}) => (
						<CustomTextField
							{...field}
							label="Client ip"
							placeholder="Nhập dữ liệu"
						/>
					)}
				/>
				<Controller
					control={control}
					name="apiKey"
					render={({field}) => (
						<CustomTextarea
							{...field}
							isRequired
							label="Api key"
							placeholder="Nhập dữ liệu"
							isInvalid={!!errors?.apiKey?.message}
							errorMessage={errors?.apiKey?.message}
						/>
					)}
				/>
				<Controller
					control={control}
					name="secret"
					render={({field}) => (
						<CustomTextarea
							{...field}
							label="Secret key"
							placeholder="Nhập dữ liệu"
						/>
					)}
				/>
				<Controller
					control={control}
					name="isOpen"
					render={({field}) => (
						<CustomSwitch
							label="Trạng thái"
							{...field}
							isSelected={field?.value}
						/>
					)}
				/>
			</div>
		</ModalNextUI>
	);
};

export default ModalAddEditDomainProvider;
