import digitalOceanApi from "@/apis/digital-ocean.api";
import paths from "@/routes/paths";
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
import { HttpStatusCode } from "axios";
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

    const handleChangeInputName = (e: any) => {
        setInputName(e.target.value);
    };

    const handleDestroyVPS = async () => {
        setIsLoading(true);
        const result = await digitalOceanApi.destroyVPSBuCloudDigitalOcean(
            info
        );
        setIsLoading(false);
        if (result?.status !== HttpStatusCode.Created) {
            showToast("Lỗi khi hủy VPS", "error");
            return;
        }
        showToast("Hủy VPS thành công", "success");
        navigate(paths.vps_manage_bu_cloud, {
            state: { keyTab: "digital-ocean" },
        });
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
