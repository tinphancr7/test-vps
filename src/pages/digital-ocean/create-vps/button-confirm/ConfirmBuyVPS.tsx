import { useAppSelector } from "@/stores";
import { Button } from "@heroui/react";
import ModalConfirmInfoVPS from "./ModalConfirmInfoVPS";
import { useState } from "react";

function ConfirmBuyVPS({ type }: any) {
    const [openModal, setOpenModal] = useState(false);
    const { isValidName } = useAppSelector(
        (state) => state.digitalOceanNameVPS
    );
    const { statusCustomStorage, isSelectedCustomStorage, isSelectAddStorage } =
        useAppSelector((state) => state.digitalOceanAddStorage);
    const isValidCreate = () => {
        if (isSelectAddStorage) {
            if (isSelectedCustomStorage) {
                return isValidName && statusCustomStorage === "VALID";
            }
        }
        return isValidName;
    };

    return (
        <div className="z-50 mt-10 w-full h-[100px] sticky bottom-0 bg-white border-t-[#dfdfdf] border-t border-solid p-4 flex justify-between items-center">
            <div className="grid ">
                <Button
                    className="bg-primary text-white font-bold"
                    radius="sm"
                    isDisabled={!isValidCreate()}
                    onClick={() => setOpenModal(true)}
                    //   isLoading={isLoading}
                >
                    Tạo VPS
                </Button>
            </div>
            <ModalConfirmInfoVPS
                isOpenModalConfirm={openModal}
                onOpenModalConfirm={setOpenModal}
                type={type}
            />
        </div>
    );
}

export default ConfirmBuyVPS;
