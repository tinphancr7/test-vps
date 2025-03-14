import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { userAaPanelSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import NotifyMessage from "@/utils/notify";
import { useEffect, useState } from "react";
import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import CustomModal from "@/components/modal/CustomModal";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetDetaiVpsOrtherById } from "@/stores/async-thunks/detail-vps-orther-thunk";
import vpsOrtherApis from "@/apis/vps-orther.api";
const ModalAapanel = ({ id, isOpen, onOpenChange, onCopyPwAaPanel }: any) => {
  const dispatch = useAppDispatch();

  const { data } = useAppSelector((state) => state.detailVpsOrther);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userAaPanel: "",
      passWorkAaPanel: "",
      uRLAaPanel: "",
    },
    resolver: yupResolver(userAaPanelSchema),
  });

  useEffect(() => {
    setValue("userAaPanel", data?.userAaPanel as string);
    setValue("uRLAaPanel", data?.uRLAaPanel as string);
  }, [data]);

  const [showPassword, setShowPassword] = useState(false);
  const listData = [
    {
      label: "User aaPanel",
      name: "userAaPanel",
      kind: "input",
      placeholder: "Nhập dữ liệu",
      width: "col-span-12",
      isRequired: true,
    },
    {
      label: "Mật khẩu aaPanel",
      name: "passWorkAaPanel",
      kind: "input",
      type: showPassword ? "text" : "password",
      placeholder: "Nhập dữ liệu",
      width: "col-span-12",
      isRequired: true,

      IconComp: (
        <>
          <div
            className="px-1 cursor-pointer"
            onClick={() => {
              setShowPassword(!showPassword);
              if (!showPassword) onCopyPwAaPanel();
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
    },
  ];

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await vpsOrtherApis.updateAccountAapanel(
        id as string,
        values
      );
      if (res?.data?.status === 1) {
        onOpenChange();
        dispatch(asyncThunkGetDetaiVpsOrtherById(id as string));
        NotifyMessage("Cập nhật thành công", "success");
      }
    } catch (error) {
      console.log("error: ", error);
      NotifyMessage("Cập nhật thất bại", "error");
    }
  });
  useEffect(() => {
    const handleFetchPwAaPanel = async () => {
      try {
        const { data } = await vpsOrtherApis.getPwAaPanel(id as string);

        if (data?.status === 1) {
          setValue("passWorkAaPanel", data?.data);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
    handleFetchPwAaPanel();
  }, [id]);
  return (
    <div>
      <CustomModal
        title="Cập nhật aaPanel"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        resetForm={onOpenChange}
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
