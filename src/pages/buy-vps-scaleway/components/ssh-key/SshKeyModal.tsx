import scaleWayApi from "@/apis/scaleway.api";
import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import CustomModal from "@/components/modal/CustomModal";
import {AppDispatch} from "@/stores";
import {fetchSSHKeys} from "@/stores/slices/vps-scaleway-slice";
import NotifyMessage from "@/utils/notify";
import {sshKeySchema} from "@/utils/validation";
import {yupResolver} from "@hookform/resolvers/yup";

import {useForm} from "react-hook-form";
import {MdContentCopy} from "react-icons/md";
import {useDispatch} from "react-redux";

const SshKeyModal = ({isOpen, onOpenChange}: any) => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		handleSubmit,
		control,
		reset,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues: {
			name: "",
			publicKey: "",
		},
		resolver: yupResolver(sshKeySchema),
	});
	// Function to copy text to clipboard
	const handleCopy = () => {
		const textToCopy =
			'ssh-keygen -t ed25519 -C "login" -Z aes256-gcm@openssh.com';
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				alert("Command copied to clipboard!");
			})
			.catch((error) => {
				console.error("Failed to copy text:", error);
			});
	};

	const onSubmit = handleSubmit(async (values) => {
		const successMessage = "Thêm mới ssh key thành công";
		const errorMessage = "Thêm mới ssh key không thành công";

		try {
			await scaleWayApi.callCreateSShKey(values);
			NotifyMessage(successMessage, "success");
			resetForm();
			dispatch(
				fetchSSHKeys({
					page: 1,
					perPage: 100,
				})
			);
		} catch (error: any) {
			NotifyMessage(error?.response?.data?.message || errorMessage, "error");
		}
	});
	const listData = [
		{
			label: "SSH key name",
			name: "name",
			kind: "input",
			placeholder: "Enter SSH key name",
			width: "col-span-12",
			isRequired: true,
		},
		{
			label: "Public key",
			name: "publicKey",
			kind: "textarea",
			placeholder: "Paste the fingerprint here",
			width: "col-span-12",
			isRequired: true,
		},
	];

	const resetForm = () => {
		reset();
		onOpenChange();
	};
	return (
		<CustomModal
			title={"Add an SSH key"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
			isSubmitting={isSubmitting}
			resetForm={resetForm}
			size={"2xl"}
		>
			<div className="">
				<p className="mb-6 text-gray-600">
					Upload an SSH key to connect to your Instance using a secure way. You
					can manage all your SSH keys from your Project dashboard.
				</p>
				<div className="grid grid-cols-12 gap-4">
					{listData?.map((item, index) => (
						<div key={index} className={item?.width}>
							<RenderFormData item={item} control={control} errors={errors} />
						</div>
					))}
				</div>

				<p className="my-4 text-gray-600">
					<strong>Need to generate a key pair?</strong> Run the following
					command in your terminal:
				</p>

				<div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
					<code className="text-base">
						ssh-keygen -t ed25519 -C "login" -Z aes256-gcm@openssh.com
					</code>
					<button
						className="text-gray-500 hover:text-gray-700"
						onClick={handleCopy}
					>
						<MdContentCopy size={20} />
					</button>
				</div>
			</div>
		</CustomModal>
	);
};

export default SshKeyModal;
