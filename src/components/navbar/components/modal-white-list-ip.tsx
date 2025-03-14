import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import NotifyMessage from "@/utils/notify";
import CustomModal from "@/components/modal/CustomModal";
import { useEffect } from "react";
import * as yup from "yup";
import ipWhitelistApis from "@/apis/ip-whitelist.api";
import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";

// Regex để kiểm tra IPv4 và IPv6
const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const ipv6Regex =
  /^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}$|^:(:[0-9a-fA-F]{1,4}){1,7}$|^fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}$|^::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$|^([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/;

const ipWhitelistSchema = yup.object().shape({
  ipAddress: yup.string().test({
    name: "is-ip",
    message: "Địa chỉ IP không hợp lệ",
    test: function (value, context) {
      if (context.options.context?.isUpdating) return true;
      return !!value && (ipv4Regex.test(value) || ipv6Regex.test(value));
    },
  }),
  description: yup.string().nullable(),
  isActive: yup.boolean(),
});

const ModalIpWhitelist = ({
  isOpen,
  onClose,
  onOpenChange,
  reloadTable,
  dataInit,
  setDataInit,
}: any) => {
  const isUpdating = !!dataInit; // Xác định đang cập nhật hay thêm mới

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ipAddress: "",
      description: "",
      isActive: true,
    },
    resolver: yupResolver(ipWhitelistSchema),
    context: { isUpdating },
  });

  useEffect(() => {
    if (dataInit) {
      setValue("description", dataInit?.description);
      setValue("isActive", dataInit?.isActive);
    }
  }, [dataInit]);

  const listData = [
    {
      label: "Địa chỉ IP",
      name: "ipAddress",
      kind: "input",
      placeholder: "Nhập địa chỉ IP",
      width: "col-span-6",
      isRequired: true,
      hidden: isUpdating,
    },
    {
      label: "Mô tả",
      name: "description",
      kind: "input",
      placeholder: "Nhập mô tả",
      width: "col-span-6",
      isRequired: false,
    },
    {
      label: "Trạng thái hoạt động",
      name: "isActive",
      kind: "switch",
      statusLabel: ["Cho phép truy cập", "Chặn truy cập"],
      width: "col-span-6",
      isRequired: false,
    },
  ];

  const resetForm = () => {
    onClose();
    setDataInit(null);
    setValue("ipAddress", "");
    setValue("description", "");
    setValue("isActive", true);
  };

  const onSubmit = handleSubmit(async (values) => {
    const action = isUpdating
      ? ipWhitelistApis.updateIp(
          dataInit.ipAddress,
          values.description,
          values.isActive
        )
      : ipWhitelistApis.addIp(values.ipAddress, values.description);

    const successMessage = isUpdating
      ? "Cập nhật IP thành công"
      : "Thêm mới IP thành công";
    const errorMessage = isUpdating
      ? "Cập nhật IP không thành công"
      : "Thêm mới IP không thành công";

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
      if (error?.status === 409)
        return NotifyMessage("Địa chỉ IP đã tồn tại trong Whitelist!", "error");
      NotifyMessage(error?.message || errorMessage, "error");
    }
  });

  return (
    <CustomModal
      title={isUpdating ? "Cập nhật IP Whitelist" : "Thêm IP Whitelist"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      resetForm={resetForm}
    >
      <div className="grid grid-cols-12 gap-4">
        {listData.map((item, index) =>
          !item.hidden ? (
            <div key={index} className={item.width}>
              <RenderFormData item={item} control={control} errors={errors} />
            </div>
          ) : (
            <></>
          )
        )}
      </div>
    </CustomModal>
  );
};

export default ModalIpWhitelist;
