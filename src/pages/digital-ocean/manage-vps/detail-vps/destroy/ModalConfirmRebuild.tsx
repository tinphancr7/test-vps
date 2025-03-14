import digitalOceanApi from "@/apis/digital-ocean.api";
import showToast from "@/utils/toast";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ModalConfirmRebuild({
    openModalConfirm,
    setOpenModalConfirm,
    info,
    rebuildInfo,
}: any) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const findDescription = info?.selectedImage?.data.filter((item: any) => {
        return item?.slug === [...rebuildInfo][0];
    });
    const handleRebuildVPS = async () => {
        setIsLoading(true);
        const result = await digitalOceanApi.createActionDigitalOcean({
            key: "rebuild",
            item: info,
            image: [...rebuildInfo][0],
        });
        setIsLoading(false);
        if (!result?.data?.status) {
            showToast("Lỗi khi yêu cầu cài đặt lại VP", "error");
            return;
        }
        showToast("Đang cài đặt lại VPS", "success");
        navigate("/vps/digital-ocean");
    };

    const handleClose = () => {
        setOpenModalConfirm(false); // Đóng modal
    };
    return (
        <Modal isOpen={openModalConfirm} onOpenChange={handleClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Xác nhận cài đặt lại VPS
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Bạn có chắc chắn cài đặt lại bằng hệ điều hành{" "}
                                <strong>
                                    {findDescription[0]?.description}
                                </strong>{" "}
                                ?
                            </p>
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
                                onPress={handleRebuildVPS}
                                isLoading={isLoading}
                            >
                                Đồng ý
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ModalConfirmRebuild;
