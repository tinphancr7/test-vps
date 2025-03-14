import {yupResolver} from "@hookform/resolvers/yup";

import {useForm} from "react-hook-form";

import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import NotifyMessage from "@/utils/notify";
import CustomModal from "@/components/modal/CustomModal";
import {changePasswordSchema} from "@/utils/validation";

import userApis from "@/apis/user-api";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6";
import {useState} from "react";

const ModalChangePassword = ({isOpen, onOpenChange}: any) => {
	const [showTextPassWord, setShowTextPassWord] = useState({
		password: false,
		newPassword: false,
		confirmNewPassword: false,
	});
	const {
		handleSubmit,

		control,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues: {
			password: "",
			newPassword: "",
			confirmNewPassword: "",
		},
		resolver: yupResolver(changePasswordSchema),
	});

	const listData = [
		{
			label: "Mật khẩu cũ",
			name: "password",
			kind: "input",
			type: showTextPassWord.password ? "text" : "password",
			placeholder: "Nhập dữ liệu",
			width: "col-span-12",
			isRequired: true,
			IconComp: (
				<>
					<div
						className="px-1 cursor-pointer"
						onClick={() =>
							setShowTextPassWord({
								...showTextPassWord,
								password: !showTextPassWord.password,
							})
						}
					>
						{showTextPassWord?.password ? <FaRegEyeSlash /> : <FaRegEye />}
					</div>
				</>
			),
		},
		{
			label: "Mật khẩu mới",
			name: "newPassword",
			kind: "input",
			type: showTextPassWord.newPassword ? "text" : "password",
			placeholder: "Nhập dữ liệu",
			width: "col-span-12",
			isRequired: true,
			IconComp: (
				<>
					<div
						className="px-1 cursor-pointer"
						onClick={() =>
							setShowTextPassWord({
								...showTextPassWord,
								newPassword: !showTextPassWord.newPassword,
							})
						}
					>
						{showTextPassWord?.newPassword ? <FaRegEyeSlash /> : <FaRegEye />}
					</div>
				</>
			),
		},
		{
			label: "Xác nhận mật khẩu mới",
			name: "confirmNewPassword",
			kind: "input",
			type: showTextPassWord.confirmNewPassword ? "text" : "password",
			placeholder: "Nhập dữ liệu",
			width: "col-span-12",
			isRequired: true,
			IconComp: (
				<>
					<div
						className="px-1 cursor-pointer"
						onClick={() =>
							setShowTextPassWord({
								...showTextPassWord,
								confirmNewPassword: !showTextPassWord.confirmNewPassword,
							})
						}
					>
						{showTextPassWord?.confirmNewPassword ? (
							<FaRegEyeSlash />
						) : (
							<FaRegEye />
						)}
					</div>
				</>
			),
		},
	];

	const onSubmit = handleSubmit(async (values) => {
		const body = {
			password: values.newPassword,
			oldPw: values.password,
		};
		try {
			await userApis.changePassword(body as any);
			NotifyMessage("Đổi mật khẩu thành công", "success");
			onOpenChange();
		} catch (error :any) {
			console.log("error", error);
			NotifyMessage(
				error?.response?.data?.message || "Đổi mật khẩu không thành công",
				"error"
			);
		}
	});

	return (
		<CustomModal
			title={"Đổi mật khẩu"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
			isSubmitting={isSubmitting}
			resetForm={onOpenChange}
			size={"3xl"}
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

export default ModalChangePassword;
