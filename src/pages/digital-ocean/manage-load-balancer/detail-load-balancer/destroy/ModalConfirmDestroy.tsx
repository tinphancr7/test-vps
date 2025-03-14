import digitalOceanApi from "@/apis/digital-ocean.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { getListLoadBalancer } from "@/stores/slices/digital-ocean-slice/digital-ocean-load-balancer.slice";
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
    const currentPath = window.location.pathname;
    const handleChangeInputName = (e: any) => {
        setInputName(e.target.value);
    };
    const dispatch = useAppDispatch();
    const { search } = useAppSelector((state) => state.digitalOceanLoadBalancer);
    const handleDestroyLoadBalancer = async () => {
        setIsLoading(true);
        const result = await digitalOceanApi.destroyLoadBalancerDigitalOcean(
            info
        );
        setIsLoading(false);
        if (!result?.data?.status) {
            showToast("Lỗi khi hủy Load Balancer", "error");
            return;
        }
        showToast("Hủy Load Balancer thành công", "success");
        if (currentPath !== "/vps/load-balancer-digital-ocean") {
            navigate("/vps/load-balancer-digital-ocean");
        } else {
            setOpenModalConfirm(false);
            dispatch(getListLoadBalancer(search));
        }
    };

    const handleClose = () => {
        setInputName(""); // Reset lại inputName khi modal đóng
        setOpenModalConfirm(false); // Đóng modal
    };
    const isDisable = info?.name_load_balancer !== inputName;
    return (
        <Modal isOpen={openModalConfirm} onOpenChange={handleClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Xác nhận hủy Load Balancer
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Nhập tên của Load Balancer để hủy vĩnh viễn Load
                                Balancer này
                            </p>
                            <Input
                                type="text"
                                label=""
                                readOnly
                                radius="none"
                                value={info?.name_load_balancer}
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
                                onPress={handleDestroyLoadBalancer}
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
