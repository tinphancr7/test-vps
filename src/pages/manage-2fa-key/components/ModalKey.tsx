/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import NotifyMessage from "@/utils/notify";
import CustomModal from "@/components/modal/CustomModal";
import { manage2FaKeySchema } from "@/utils/validation";
import manage2FaKeyApi from "@/apis/manage_2_fa_key.api";
const listType = [
  { label: "Dựa theo thời gian (khuyến khích sử dụng)", value: "TOTP" },
  { label: "Dựa theo bộ đếm", value: "HOTP" },
];
const ModalKey = ({ isOpen, onClose, onOpenChange, reloadTable }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      key: "",
      type: null,
    },
    resolver: yupResolver(manage2FaKeySchema as any),
  });

  const listData = [
    {
      label: "Tên khóa bảo mật",
      name: "name",
      kind: "input",
      placeholder: "Nhập dữ liệu",
      width: "col-span-4",
      isRequired: true,
    },
    {
      label: "Secret Key",
      name: "key",
      kind: "input",
      placeholder: "Nhập dữ liệu",
      width: "col-span-4",
      isRequired: true,
    },
    {
      label: "Loại khóa",
      name: "type",
      kind: "multiSelect",
      width: "col-span-4",
      isRequired: true,
      isMulti: false,
      options: listType,
    },
  ];

  const resetForm = () => {
    onClose();
    setValue("name", "");
    setValue("key", "");
  };

  const onSubmit = handleSubmit(async (values: any) => {
    const newValues = {
      ...values,
      type: values?.type?.value,
    };

    const action = manage2FaKeyApi.callCreateKey(newValues);

    const successMessage = "Thêm mới key thành công";
    const errorMessage = "Thêm mới key không thành công";

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
      title={"Tạo mới key"}
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

export default ModalKey;
