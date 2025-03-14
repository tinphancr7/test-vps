import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
interface CustomModalProps {
	title: string;
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: () => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	size?: any;
	resetForm?: () => void;
	isSubmitting?: boolean;
	isShowFooter?: boolean;
}
const CustomModal = ({
	title,
	children,
	isOpen,
	onOpenChange,
	onSubmit,
	size,
	isSubmitting = false,
	isShowFooter = true,
	resetForm,
}: CustomModalProps) => {
	return (
		<Modal
			scrollBehavior={"inside"}
			backdrop="opaque"
			isOpen={isOpen}
			isDismissable={false}
			onOpenChange={onOpenChange}
			// hideCloseButton
			onClose={resetForm}
			size={size || "5xl"}
			placement="top-center"
			classNames={{
				wrapper: "!items-center",
				body: `py-6 bg-white ${!isShowFooter && "rounded-b-xl"}`,
				backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
				base: "border-gray-200 bg-white dark:bg-[#19172c] text-black ",
				header: "border-b-[1px] border-gray-200 bg-white rounded-t-xl",
				footer: "border-t-[1px] border-gray-200 bg-white rounded-b-xl",
				closeButton: "hover:bg-gray-500/5 active:bg-white/10",
			}}
			motionProps={{
				variants: {
					enter: {
						y: 0,
						opacity: 1,
						transition: {
							duration: 0.3,
							ease: "easeOut",
						},
					},
					exit: {
						y: -20,
						opacity: 0,
						transition: {
							duration: 0.2,
							ease: "easeIn",
						},
					},
				},
			}}
		>
			<form onSubmit={onSubmit}>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className="flex flex-col gap-1 uppercase">
								{title}
							</ModalHeader>
							<ModalBody>{children}</ModalBody>
							{isShowFooter && (
								<ModalFooter>
									<Button
										className="bg-primary text-white"
										type="submit"
										disabled={isSubmitting}
										isLoading={isSubmitting}
									>
										Xác nhận
									</Button>
									<Button className="bg-red-600 text-white" onPress={resetForm}>
										Hủy
									</Button>
								</ModalFooter>
							)}
						</>
					)}
				</ModalContent>
			</form>
		</Modal>
	);
};

export default CustomModal;
