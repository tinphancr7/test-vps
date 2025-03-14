import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import CustomModal from "@/components/modal/CustomModal";
import { userAaPanelSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const ModalAapanel = ({ isOpen, onClose, aapanel }: any) => {
  useEffect(() => {
    setValue("userAaPanel", aapanel?.userAaPanel);
    setValue("passWorkAaPanel", aapanel?.passWorkAaPanel);
    setValue("uRLAaPanel", aapanel?.uRLAaPanel);
  }, [aapanel]);
  const [showPassword, setShowPassword] = useState(false);
  const listData = [
    {
      label: "User aaPanel",
      name: "userAaPanel",
      kind: "input",
      placeholder: "Nhập dữ liệu",
      width: "col-span-12",
      isRequired: true,
      disabled: true,
    },
    {
      label: "Mật khẩu aaPanel",
      name: "passWorkAaPanel",
      kind: "input",
      type: showPassword ? "text" : "password",
      placeholder: "Nhập dữ liệu",
      width: "col-span-12",
      isRequired: true,
      disabled: true,
      IconComp: (
        <>
          <div
            className="px-1 cursor-pointer"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </div>
        </>
      ),
    },
    {
      label: "URL aaPanel",
      name: "uRLAaPanel",
      kind: "input",
      placeholder: "Nhập dữ liệu",
      width: "col-span-12",
      isRequired: true,
      disabled: true,
    },
  ];
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userAaPanel: "",
      passWorkAaPanel: "",
      uRLAaPanel: "",
    },
    resolver: yupResolver(userAaPanelSchema),
  });
  return (
    <div>
      <CustomModal
        title="Xem thông tin aaPanel"
        isOpen={isOpen}
        onOpenChange={() => {}}
        onSubmit={() => {}}
        isShowFooter={false}
        isSubmitting={false}
        resetForm={onClose}
        size={"lg"}
      >
        <div>
          <div className="grid grid-cols-12 gap-4 ">
            {listData?.map((item, index) => (
              <div key={index} className={item?.width}>
                <RenderFormData item={item} control={control} errors={errors} />
              </div>
            ))}
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ModalAapanel;
