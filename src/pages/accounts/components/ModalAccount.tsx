import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import accountApi from "@/apis/account.api";
import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import NotifyMessage from "@/utils/notify";
import CustomModal from "@/components/modal/CustomModal";
import { accountSchema } from "@/utils/validation";

import { useEffect } from "react";

import invoiceApi from "@/apis/invoice.api";
import teamApi from "@/apis/team.api";

const ModalAccount = ({
  isOpen,
  onClose,
  onOpenChange,
  reloadTable,
  dataInit,
  setDataInit,
}: any) => {
  useEffect(() => {
    if (dataInit) {
      setValue("apikey", dataInit?.apikey);
      setValue(
        "team",
        dataInit?.team
          ? {
              label: dataInit?.team?.name,
              value: dataInit?.team?._id,
            }
          : {
              label: "",
              value: "",
            }
      );
      setValue(
        "provider",
        dataInit?.provider
          ? {
              label: dataInit?.provider?.name,
              value: dataInit?.provider?._id,
            }
          : {
              label: "",
              value: "",
            }
      );
    }
  }, [dataInit]);

  const {
    handleSubmit,

    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      apikey: "",
      team: null,
      provider: null,
    } as any,
    resolver: yupResolver(accountSchema as any),
  });
  const loadOptionsProvider = async (
    searchQuery: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    const res = await invoiceApi.callFetchProvider({
      search: searchQuery,
      page: 1,
      limit: 10,
    });

    const items = res?.data?.data?.data.map((item: any) => ({
      label: item?.name,
      value: item?._id,
    }));
    return {
      options: items,
      hasMore: res?.data?.data?.totalPages > page,
      additional: {
        page: searchQuery ? 1 : page + 1,
      },
    };
  };
  const loadOptionsTeam = async (
    searchQuery: string,
    _loadedOptions: any,
    { page }: any
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

  const listData = [
    {
      label: "Nhà cung cấp",
      name: "provider",
      kind: "multiSelect",
      // placeholder: "Nhập dữ liệu",
      width: "col-span-6",
      isRequired: true,
      isMulti: false,
      loadOptions: loadOptionsProvider,
    },

    {
      label: "Team",
      name: "team",
      kind: "multiSelect",
      // placeholder: "Nhập dữ liệu",
      width: "col-span-6",
      isRequired: true,
      isMulti: false,
      loadOptions: loadOptionsTeam,
    },
    {
      label: "api key",
      name: "apikey",
      kind: "textarea",
      placeholder: "Nhập dữ liệu",
      width: "col-span-12",
      isRequired: true,
    },
  ];
  const resetForm = () => {
    onClose();
    setDataInit(null);
    reset();
  };
  const onSubmit = handleSubmit(async (values: any) => {
    const newValues = {
      ...values,
      provider: values?.provider?.value,
      team: values?.team?.value,
    };

    const isUpdate = !!dataInit?._id;
    const action = isUpdate
      ? accountApi.callUpdateAccount(newValues, dataInit?._id)
      : accountApi.callCreateAccount(newValues);

    const successMessage = isUpdate
      ? "Cập nhật tài khoản thành công"
      : "Thêm mới tài khoản thành công";
    const errorMessage = isUpdate
      ? "Cập nhật tài khoản không thành công"
      : "Thêm mới tài khoản không thành công";

    try {
      const res = await action;
      if (res?.data) {
        toast.success(successMessage);
        resetForm();
        reloadTable();
      } else {
        NotifyMessage(errorMessage, "error");
      }
    } catch (error: any) {
      NotifyMessage(error?.message || errorMessage, "error");
    }
  });

  return (
    <CustomModal
      title={dataInit ? "Cập nhật " : "Tạo mới team"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      resetForm={resetForm}
    >
      <div className="grid grid-cols-12 gap-4">
        {listData?.map((item, index) => (
          <div key={index} className={item?.width}>
            <RenderFormData item={item} control={control} errors={errors} />
          </div>
        ))}
      </div>
    </CustomModal>
  );
};

export default ModalAccount;
