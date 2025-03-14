import { useState } from "react";
import ModalConfirmDestroy from "./ModalConfirmDestroy";
import { Button } from "@heroui/react";

function DestroyLoadBalancer({ info }: any) {
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const handleOpenModalConfirm = () => {
        setOpenModalConfirm(true);
    };
    const isDisable =
        info?.status === "terminated" || info?.status === "in-progress";
    return (
        <div className="p-4">
            <h3 className="font-bold">Hủy Load Balancer</h3>
            <p className="my-4">
                Load Balancer sẽ bị hủy vĩnh viễn. Bất kỳ những VPS đang sử dụng
                trong Load Balancer này sẽ bị ngắt kết nối. Những VPS đó sẽ
                không bị hủy.
            </p>
            <Button
                className="bg-primary font-bold"
                onPress={handleOpenModalConfirm}
                isDisabled={isDisable}
            >
                Hủy VPS
            </Button>
            <ModalConfirmDestroy
                openModalConfirm={openModalConfirm}
                setOpenModalConfirm={setOpenModalConfirm}
                info={info}
            />
        </div>
    );
}

export default DestroyLoadBalancer;
