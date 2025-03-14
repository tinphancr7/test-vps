/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import teamApi from "@/apis/team.api";
import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import NotifyMessage from "@/utils/notify";
import CustomModal from "@/components/modal/CustomModal";
import { teamSchema } from "@/utils/validation";
import CreatableSelect from "react-select/creatable"; // Import React Select
import { useEffect, useState } from "react";
import userApis from "@/apis/user-api";
const ModalTeam = ({
  isOpen,
  onClose,
  onOpenChange,
  reloadTable,
  dataInit,
  setDataInit,
}: any) => {
  const [telegramIds, setTelegramIds] = useState<string[]>([]); // State cho TelegramIds
  useEffect(() => {
    if (dataInit) {
      setValue("name", dataInit?.name);
      setTelegramIds(dataInit?.telegramIds || []); // Gán giá trị ban đầu
      setValue(
        "managers",
        dataInit?.managers.map((user: any) => ({
          label: user.username,
          value: user._id,
        }))
      );
    }
  }, [dataInit]);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      managers: [],
      telegramIds: [],
    },
    resolver: yupResolver(teamSchema),
  });

  const loadOptionsData = async (
    searchQuery: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    const res = await userApis.getPaginationUsers({
      search: searchQuery,
      pageIndex: page,
      pageSize: 10,
    });
    const users = res?.data?.users.map((user: any) => ({
      label: user.username,
      value: user._id,
    }));
    return {
      options: users,
      hasMore: res?.data?.totalPages > page,
      additional: {
        page: searchQuery ? 1 : page + 1,
      },
    };
  };

  const handleTelegramIdsChange = (newValues: any) => {
    setTelegramIds(newValues.map((item: any) => item.value)); // Cập nhật State
  };

  const listData = [
    {
      label: "Tên",
      name: "name",
      kind: "input",
      placeholder: "Nhập dữ liệu",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Quản lý",
      name: "managers",
      kind: "multiSelect",
      width: "col-span-6",
      isRequired: true,
      loadOptions: loadOptionsData,
    },
  ];

  const resetForm = () => {
    onClose();
    setDataInit(null);
    setValue("name", "");
    setTelegramIds([]);
  };

  const onSubmit = handleSubmit(async (values) => {
    const newValues = {
      ...values,
      telegramIds, // Thêm TelegramIds
      managers: values?.managers?.map((item) => item.value),
    };

    const isUpdate = !!dataInit?._id;
    const action = isUpdate
      ? teamApi.callUpdateTeam(newValues, dataInit?._id)
      : teamApi.callCreateTeam(newValues);

    const successMessage = isUpdate
      ? "Cập nhật team thành công"
      : "Thêm mới team thành công";
    const errorMessage = isUpdate
      ? "Cập nhật team không thành công"
      : "Thêm mới team không thành công";

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
      title={dataInit ? "Cập nhật team" : "Tạo mới team"}
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
        {/* TelegramIds Input */}
        <div className="col-span-6 gap-1 mb-10">
          <label className="block text-sm font-medium text-gray-700">
            Telegram ID
          </label>
          <CreatableSelect
            isMulti
            value={telegramIds.map((id) => ({ value: id, label: id }))}
            onChange={handleTelegramIdsChange}
            placeholder="Nhập thông tin telegram id"
            styles={{
              control: (base) => ({
                ...base,
                fontSize: "12px",
                minHeight: "30px",
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: "12px",
                color: "#a0aec0",
              }),
              multiValue: (base) => ({
                ...base,
                fontSize: "12px",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "2px 8px",
                fontSize: "12px",
              }),
              input: (base) => ({
                ...base,
                fontSize: "12px",
              }),
              menu: (base) => ({
                ...base,
                fontSize: "12px",
              }),
            }}
          />
          {errors?.telegramIds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.telegramIds.message}
            </p>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalTeam;
