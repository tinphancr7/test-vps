import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import NotifyMessage from "@/utils/notify";
import CustomModal from "@/components/modal/CustomModal";
import { cloudflareApiKeySchema } from "@/utils/validation";

import { useEffect } from "react";

import teamApi from "@/apis/team.api";
import cloudflareApiKeyApi from "@/apis/cloudflare-api-key.api";

const ModalCloudflareApiKey = ({
  isOpen,
  onClose,
  onOpenChange,
  reloadTable,
  dataInit,
  setDataInit,
}: any) => {
  useEffect(() => {
    if (dataInit) {
      setValue("api_key", dataInit?.api_key);
      setValue("email", dataInit?.email);
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
      api_key: "",
      team: null,
      email: "",
    } as any,
    resolver: yupResolver(cloudflareApiKeySchema as any),
  });

  const loadOptionsTeam = async (
    searchQuery: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    const res = await teamApi.callFetchYourTeamNoneAuth({
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
      label: "Team",
      name: "team",
      kind: "multiSelect",
      width: "col-span-6",
      isRequired: true,
      isMulti: false,
      loadOptions: loadOptionsTeam,
    },
    {
      label: "Email",
      name: "email",
      kind: "input",
      placeholder: "Nhập địa chỉ email",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Api key",
      name: "api_key",
      kind: "input",
      placeholder: "Nhập API key",
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
      team: values?.team?.value,
    };

    const isUpdate = !!dataInit?._id;
    const action = isUpdate
      ? cloudflareApiKeyApi.callUpdateCloudflareApiKey(newValues, dataInit?._id)
      : cloudflareApiKeyApi.callCreateCloudflareApiKey(newValues);

    const successMessage = isUpdate
      ? "Cập nhật API key thành công"
      : "Thêm mới API key thành công";
    const errorMessage = isUpdate
      ? "Cập nhật API key không thành công"
      : "Thêm mới API key không thành công";

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
      title={dataInit ? "Cập nhật API key" : "Tạo mới API key"}
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

export default ModalCloudflareApiKey;
