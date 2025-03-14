import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";

interface ModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onSubmit: () => void;
	children: React.ReactNode;
	idItem?: string;
	isSubmitting: boolean;
	size?:
		| "sm"
		| "md"
		| "lg"
		| "xl"
		| "xs"
		| "2xl"
		| "3xl"
		| "4xl"
		| "5xl"
		| "full";
	title?: string;
}

const ModalNextUI = ({
	isOpen,
	onOpenChange,
	onSubmit,
	children,
	idItem,
	isSubmitting,
	size = "xl",
	title = "",
}: ModalProps) => {
	return (
		<Modal
			size={size}
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onOpenChange}
			scrollBehavior="inside"
			isDismissable={false}
		>
			<form className="w-full " onSubmit={onSubmit}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col py-3 gap-1 border-b">
								{title}
							</ModalHeader>
							<ModalBody>{children}</ModalBody>
							<ModalFooter className=" border-t">
								<Button
									type="button"
									className="py-2.5 px-5 text-xs bg-gray-100 text-gray-700   font-bold  data-[hover=true]:!opacity-100  "
									radius="full"
									onPress={onClose}
								>
									Hủy
								</Button>
								<Button
									type="submit"
									className="py-2.5 px-5 text-xs  bg-primary text-white font-semibold   data-[hover=true]:!opacity-100 "
									radius="full"
									isDisabled={isSubmitting}
									isLoading={isSubmitting}
								>
									{idItem ? "Cập nhật" : "Thêm mới"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</form>
		</Modal>
	);
};

export default ModalNextUI;
