import digitalOceanApi from "@/apis/digital-ocean.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { getListVPS } from "@/stores/slices/digital-ocean-slice/digital-ocean-vps.slice";
import showToast from "@/utils/toast";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ModalConfirmDestroy({
    openModalConfirm,
    setOpenModalConfirm,
    info,
}: any) {
    const navigate = useNavigate();
    const [inputName, setInputName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { search } = useAppSelector((state) => state.digitalOceanVPS);
    const handleChangeInputName = (e: any) => {
        setInputName(e.target.value);
    };
    const currentPath = window.location.pathname;
    const handleDestroyVPS = async () => {
        setIsLoading(true);
        const result = await digitalOceanApi.destroyVPSDigitalOcean(info);
        setIsLoading(false);
        if (!result?.data?.status) {
            showToast("Lỗi khi hủy VPS", "error");
            return;
        }
        showToast("Hủy VPS thành công", "success");

        if (currentPath !== "/vps/digital-ocean") {
            navigate("/vps/digital-ocean");
        } else {
            setOpenModalConfirm(false);
            dispatch(getListVPS(search));
        }
    };

    const handleClose = () => {
        setInputName(""); // Reset lại inputName khi modal đóng
        setOpenModalConfirm(false); // Đóng modal
    };
    const isDisable = info?.nameVPS !== inputName;
    return (
        <Modal isOpen={openModalConfirm} onOpenChange={handleClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Xác nhận hủy VPS
                        </ModalHeader>
                        <ModalBody>
                            <p>Nhập tên của VPS để hủy vĩnh viễn VPS này</p>
                            <Input
                                type="text"
                                label=""
                                readOnly
                                radius="none"
                                value={info?.nameVPS}
                            />
                            <Input
                                type="text"
                                label=""
                                radius="none"
                                variant="bordered"
                                placeholder="Nhập tên VPS"
                                value={inputName}
                                onChange={(e) => {
                                    handleChangeInputName(e);
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Đóng
                            </Button>
                            <Button
                                color="primary"
                                isDisabled={isDisable}
                                onPress={handleDestroyVPS}
                                isLoading={isLoading}
                            >
                                Hủy
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ModalConfirmDestroy;
