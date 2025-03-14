import { useAppSelector } from "@/stores";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

function ModalConfirm({ isOpenModal, opOpenchange, data, handleConfirm }: any) {
  const { isLoadingUpdate } = useAppSelector((state) => state.order);
  let type = "Hủy";
  if (data.type === "accept") {
    type = "Duyệt";
  } else if (data.type === "reject") {
    type = " Không duyệt";
  }
  return (
    <Modal isOpen={isOpenModal} onOpenChange={opOpenchange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
            <ModalBody>
              <div className="my-2">
                Bạn có chắc chắn <strong>{type}</strong> đơn hàng có mã{" "}
                <strong>{data.orderId}</strong>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button
                variant="solid"
                className={`bg-primary text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                onPress={handleConfirm}
                isLoading={isLoadingUpdate}
              >
                Xác nhận
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalConfirm;
