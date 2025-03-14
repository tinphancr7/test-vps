import CustomMultiSelect from "@/components/form/custom-multi-select";
import CustomSwitch from "@/components/form/custom-switch";

import InputNumberField from "@/components/form/input-number-field";
import CustomTextField from "@/components/form/text-field";

import CustomSelect from "@/components/form/custom-select";
import ModalNextUI from "@/components/modal";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { domainProviderSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomTextarea from "@/components/form/text-area";
import teamApi from "@/apis/team.api";

import { toast } from "react-toastify";
import NotifyMessage from "@/utils/notify";
import domainProviderApi from "@/apis/domain-provider";
import { domainFields } from "@/constants";

interface DefaultValues {
  title?: string;
  name: string;
  apiKey?: string;
  secret?: string;
  exchangeRate?: number;
  username?: string;
  clientIp?: string;
  shopperId?: string;
  isOpen?: boolean;
  teams?: any[];
  firstName?: string;
  lastName?: string;
  address?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  city?: string;
}
const ModalAddEditDomainProvider = ({
  isOpen,
  onOpenChange,
  idDomainProvider,
  reloadTable,
}: any) => {
  const defaultValues: DefaultValues = {
    title: "",
    name: "dynadot",
    apiKey: "",
    secret: "",
    exchangeRate: 0,
    username: "",
    clientIp: "",
    shopperId: "",
    isOpen: true,
    teams: [],
    firstName: "",
    lastName: "",
    address: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    email: "",
    city: "",
  };

  const {
    handleSubmit,
    control,
    reset,

    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(domainProviderSchema),
  });

  // Lấy nhà cung cấp được chọn
  const selectedProvider = watch("name");

  // Lấy danh sách field từ domainFields
  const fieldsToShow = domainFields[selectedProvider] || {};

  // Danh sách field có thứ tự như trong domainFields[selectedProvider]
  const orderedFields = Object.keys(fieldsToShow);

  const formFields: {
    name: keyof typeof defaultValues;
    component: any;
    label: string;
    isBoolean?: boolean;
    asyncLoad?: boolean;
    width?: string;
  }[] = [
    { name: "title", component: CustomTextField, label: "Tên kết nối" },
    { name: "exchangeRate", component: InputNumberField, label: "Tỷ giá VND" },
    {
      name: "teams",
      component: CustomMultiSelect,
      label: "Team",
      asyncLoad: true,
    },
    { name: "username", component: CustomTextField, label: "Tài khoản" },
    { name: "clientIp", component: CustomTextField, label: "IP client" },
    { name: "apiKey", component: CustomTextarea, label: "API Key" },
    { name: "secret", component: CustomTextarea, label: "Secret Key" },
    { name: "shopperId", component: CustomTextField, label: "Shopper ID" },
    { name: "firstName", component: CustomTextField, label: "Tên" },
    { name: "lastName", component: CustomTextField, label: "Họ" },
    { name: "address", component: CustomTextField, label: "Địa chỉ" },
    { name: "state", component: CustomTextField, label: "Tỉnh thành" },
    { name: "zip", component: CustomTextField, label: "Mã bưu điện" },
    { name: "country", component: CustomTextField, label: "Quốc gia" },
    { name: "phone", component: CustomTextField, label: "Số điện thoại" },
    { name: "email", component: CustomTextField, label: "Email" },
    { name: "city", component: CustomTextField, label: "Thành phố" },
    {
      name: "isOpen",
      component: CustomSwitch,
      label: "Trạng thái",
      isBoolean: true,
    },
  ];

  // Lọc & Sắp xếp formFields theo thứ tự của domainFields[selectedProvider]
  const sortedFormFields: {
    name: keyof typeof defaultValues;
    component: any;
    label: string;
    isBoolean?: boolean;
    asyncLoad?: boolean;
    width?: string;
  }[] = orderedFields
    .map((field) => {
      const formField = formFields.find((f) => f.name === field);
      return formField && fieldsToShow[field]?.width
        ? { ...formField, width: fieldsToShow[field]?.width }
        : formField;
    })
    .filter((field): field is NonNullable<typeof field> => Boolean(field));

  const loadOptionsData = async (searchQuery: string, _loadedOptions: any, { page }: any) => {
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

    // filter data base domainfields to get only data that is in form

    const filterData = Object.keys(data).reduce((acc: { [key: string]: any }, key) => {
      if (Object.prototype.hasOwnProperty.call(fieldsToShow, key)) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    const {
      firstName = "",
      lastName = "",
      address = "",
      state = "",
      zip = "",
      country = "",
      phone = "",
      email = "",
      city = "",
      ...rests
    } = filterData;

    const newData = {
      ...rests,
      teams,
      detail: {
        firstName,
        lastName,
        address,
        state,
        zip,
        country,
        phone,
        email,
        city,
      },
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

      const { detail, ...rests } = data;
      if (data) {
        reset({
          ...rests,
          ...detail,
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

  // Khi name thay đổi, reset lại toàn bộ form với giá trị mặc định
  useEffect(() => {
    if (!selectedProvider) return;

    if (!idDomainProvider) {
      reset({
        ...defaultValues,
        name: selectedProvider, // Giữ lại giá trị của name
      });
    }
  }, [selectedProvider, reset]);

  // Reset form khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      reset({ ...defaultValues });
    } else if (idDomainProvider && isOpen) {
      fetchDetailsDomainProvider(idDomainProvider);
    }
  }, [isOpen, idDomainProvider]);

  return (
    <ModalNextUI
      title={idDomainProvider ? "Cập nhật nhà cung cấp" : "Thêm mới nhà cung cấp"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      size="5xl"
      idItem={idDomainProvider}
    >
      <div className="p-4 grid grid-cols-2 gap-4 w-full">
        <div>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <CustomSelect
                {...field}
                isRequired
                selectedKeys={[field.value]}
                label="Nhà cung cấp"
                placeholder="--- Chọn ---"
                isInvalid={!!errors?.name?.message}
                errorMessage={errors?.name?.message}
                items={[
                  { label: "Dynadot", value: "dynadot" },
                  { label: "Gname", value: "gname" },
                  { label: "Name", value: "name" },
                  { label: "Epik", value: "epik" },
                  { label: "Godaddy", value: "godaddy" },
                  { label: "Name Cheap", value: "name-cheap" },
                ]}
              />
            )}
          />
        </div>

        {sortedFormFields.map(({ name, component: Component, label, isBoolean, asyncLoad }) => (
          <div className={`w-full ${fieldsToShow[name]?.width || ""}`}>
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => {
                const isRequired = fieldsToShow[name]?.isRequired; // Kiểm tra required dựa vào domainFields

                return isBoolean ? (
                  <Component label={label} {...field} isSelected={field.value} />
                ) : asyncLoad ? (
                  <Component
                    {...field}
                    isRequired={isRequired}
                    label={label}
                    placeholder="--- Chọn ---"
                    loadOptions={loadOptionsData}
                    isInvalid={!!errors?.[name]}
                    errorMessage={errors?.[name]?.message}
                  />
                ) : (
                  <Component
                    {...field}
                    isRequired={isRequired}
                    label={label}
                    placeholder="Nhập dữ liệu"
                    isInvalid={!!errors?.[name]}
                    errorMessage={errors?.[name]?.message}
                  />
                );
              }}
            />
          </div>
        ))}
      </div>
    </ModalNextUI>
  );
};

export default ModalAddEditDomainProvider;
