import { useAppDispatch, useAppSelector } from "@/stores";
import { deleteVPSInOrder } from "@/stores/slices/order.slice";
import showToast from "@/utils/toast";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
function ButtonDeleteVPS({
  itemVPS,
  _idOrder,
  setOrderDetail,
  isDisable = false,
}: {
  itemVPS: any;
  _idOrder: string;
  setOrderDetail: any;
  isDisable?: boolean;
}) {
  const [isOpenModal, opOpenchange] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoadingDeleteVPS } = useAppSelector((state) => state.order);
  const handleDeleteVPSOrder = async () => {
    const { payload: result } = await dispatch(deleteVPSInOrder({ _idOrder, ipVPS: itemVPS?.ip }));
    if (!result?.status) {
      showToast("Xóa VPS trong order không thành công!", "error");
      return;
    }
    showToast("Xóa VPS trong order thành công!", "success");
    setOrderDetail(result?.data);
    opOpenchange(false);
    console.log(result);
  };
  return (
    <div>
      <Button
        startContent={<MdOutlineDeleteForever />}
        variant="bordered"
        onPress={() => opOpenchange(true)}
        color="danger"
        isDisabled={isDisable}
      >
        Xóa
      </Button>
      <Modal isOpen={isOpenModal} onOpenChange={opOpenchange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
              <ModalBody>
                <div className="my-2">
                  Bạn có chắc chắn xóa VPS có IP: <strong>{itemVPS?.ip}</strong>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  variant="solid"
                  className={`bg-primary text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                  onPress={handleDeleteVPSOrder}
                  isLoading={isLoadingDeleteVPS}
                >
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ButtonDeleteVPS;
