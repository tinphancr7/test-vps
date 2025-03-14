import { Button, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import ModalConfirmDestroy from "./ModalConfirmDestroy";
import ModalConfirmRebuild from "./ModalConfirmRebuild";

function DestroyVPSDigitalOcean({ info }: any) {
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [openModalConfirmRebuild, setOpenModalConfirmRebuild] =
        useState(false);

    const [disableRebuild, setDisableRebuild] = useState(true);
    const [selectedRebuild, setSelectedRebuild] = useState(new Set([]));

    const handleOpenModalConfirm = () => {
        setOpenModalConfirm(true);
    };
    const handleOpenModalConfirmRebuild = () => {
        setOpenModalConfirmRebuild(true);
    };

    const hanldeChangeRebuild = (value: any) => {
        setSelectedRebuild(value);
        setDisableRebuild(false);
    };

    const isDisable =
        info?.status === "terminated" || info?.status === "in-progress";

    return (
        <>
            <div className="p-4">
                <div className="my-4">
                    <h3 className="text-2xl">Hủy VPS</h3>
                    <p className="my-4">
                        Điều này không thể hoàn tác. Chúng tôi sẽ hủy VPS của
                        bạn và tất cả dữ liệu trong VPS sẽ bị xóa và không thể
                        khôi phục
                    </p>
                    <Button
                        className="bg-primary font-bold"
                        onPress={handleOpenModalConfirm}
                        isDisabled={isDisable}
                    >
                        Hủy VPS
                    </Button>
                </div>
                <div className="my-4">
                    <h3 className="text-2xl">Cài đặt lại VPS</h3>
                    <p className="my-4">
                        Điều này không thể hoàn tác. Chúng tôi sẽ cài đặt lại
                        VPS của bạn và tất cả dữ liệu trong VPS sẽ bị xóa và
                        không thể khôi phục. Vui lòng sao lưu mọi thứ bạn muốn
                        giữ lại
                    </p>
                    <p className="my-4">
                        Việc cài đặt lại VPS, chúng tôi chỉ cho bạn chọn những
                        hệ điều hành bạn đã chọn VPS lúc trước
                    </p>

                    <div className="flex gap-4">
                        <Select
                            className="max-w-xs"
                            radius="none"
                            variant="bordered"
                            aria-label="datacenter"
                            // selectedKeys={info?.selectedImage?.data[0].slug}
                            onSelectionChange={(value: any) => {
                                hanldeChangeRebuild(value);
                            }}
                            disallowEmptySelection={true}
                            popoverProps={{
                                classNames: {
                                    base: "p-0",
                                    content: "rounded-none p-0",
                                },
                            }}
                            listboxProps={{
                                className: "p-0",
                                itemClasses: {
                                    base: " rounded-none",
                                },
                            }}
                            classNames={{
                                trigger: "border",
                            }}
                        >
                            {(info?.selectedImage?.data || [])?.map(
                                (item: any) => (
                                    <SelectItem
                                        key={item?.slug}
                                        textValue={`${item?.description}`}
                                    >
                                        {item.description}
                                    </SelectItem>
                                )
                            )}
                        </Select>
                        <Button
                            className="bg-primary font-bold"
                            onPress={handleOpenModalConfirmRebuild}
                            isDisabled={isDisable || disableRebuild}
                        >
                            Cài đặt lại VPS
                        </Button>
                    </div>
                </div>
            </div>
            <ModalConfirmDestroy
                openModalConfirm={openModalConfirm}
                setOpenModalConfirm={setOpenModalConfirm}
                info={info}
            />

            <ModalConfirmRebuild
                openModalConfirm={openModalConfirmRebuild}
                setOpenModalConfirm={setOpenModalConfirmRebuild}
                info={info}
                rebuildInfo={selectedRebuild}
            />
        </>
    );
}

export default DestroyVPSDigitalOcean;
