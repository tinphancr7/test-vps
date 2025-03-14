/* eslint-disable react-hooks/exhaustive-deps */
import digitalOceanApi from "@/apis/digital-ocean.api";
import teamApi from "@/apis/team.api";
import { useAppSelector } from "@/stores";
import {
    convertPriceMonthly,
    handleDisplayMemory,
} from "@/utils/digital-ocean";
import showToast from "@/utils/toast";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function ModalConfirmInfoVPS({
    isOpenModalConfirm,
    onOpenModalConfirm,
    type,
}: any) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { selectedRegion, selectedDataCenter } = useAppSelector(
        (state) => state.digitalOceanRegion
    );
    const { nameVPS } = useAppSelector((state) => state.digitalOceanNameVPS);
    const { selectedImage, selectedVersionImage }: any = useAppSelector(
        (state) => state.digitalOceanImage
    );

    const getNameOfImage = () => {
        const data = selectedImage?.data?.find((item: any) => {
            const [slugImage] = [...selectedVersionImage];
            return item?.slug === slugImage;
        });
        return data?.description;
    };
    const { selectedSize }: any = useAppSelector(
        (state) => state.digitalOceanSize
    );

    const { addStorage, isSelectAddStorage } = useAppSelector(
        (state) => state.digitalOceanAddStorage
    );

    const { backupsOption } = useAppSelector(
        (state) => state.digitalOceanBackup
    );
    const sumTotal = useMemo(() => {
        return (
            selectedSize?.price_monthly +
            (addStorage?.price_monthly || 0) +
            (backupsOption?.backups
                ? selectedSize?.price_monthly *
                  (backupsOption?.rateCostForBackup / 100)
                : 0)
        );
    }, [
        selectedSize?.price_monthly,
        addStorage?.price_monthly,
        backupsOption?.backups,
    ]);

    const [listTeam, setListTeam] = useState<any>([]);
    const [selectedTeam, setSelectedTeam] = useState<any>({});
    const getAllYourTeam = async () => {
        const getTeam = await teamApi.getAllYourTeam();
        setListTeam(getTeam?.data);
        setSelectedTeam(getTeam?.data?.data[0]);
    };
    const infoTeam: any = {
        teamId: selectedTeam?._id,
        teamName: selectedTeam?.name,
    };

    const handleChangeTeam = (value: any) => {
        const data = listTeam?.data.filter((item: any) => {
            return item?._id === [...value][0];
        });
        setSelectedTeam(data[0]);
    };

    useEffect(() => {
        getAllYourTeam();
    }, []);
    const handleCreateVPSDigitalOcean = async () => {
        setIsLoading(true);
        const dataCreateVPS = {
            nameVPS,
            selectedRegion,
            selectedDataCenter: [...selectedDataCenter][0],
            selectedImage,
            selectedVersionImage: [...selectedVersionImage][0],
            selectedSize,
            backupsOption,
            addStorage,
            ipv6: true, //Cố định true,
            monitoring: true, //Cố định true,
            selectedTeam: infoTeam,
        };
        let createVPS: any = {};
        try {
            if (type !== "bu-cloud") {
                createVPS = await digitalOceanApi.createVPSDigitalOcean(
                    dataCreateVPS
                );
            } else {
                createVPS = await digitalOceanApi.createVPSDigitalOceanBuCloud(
                    dataCreateVPS
                );
            }

            setIsLoading(false);
            if (createVPS?.data?.status === 502) {
                showToast("Lỗi khi tạo VPS", "error");
                return;
            }
            if (createVPS?.data?.status === 0) {
                if (
                    createVPS?.data?.message ===
                    "user_not_enough_credit_viettel"
                ) {
                    showToast(
                        "Tài khoản không đủ tiền, vui lòng liên hệ admin",
                        "error"
                    );
                    return;
                }
                if (
                    createVPS?.data?.message === "payment_credit_fail_viettel"
                ) {
                    showToast(
                        "Lỗi khi thanh toán, vui lòng thử lại sau",
                        "error"
                    );
                    return;
                }
                showToast(createVPS?.data?.message, "error");
                return;
            }
            showToast(createVPS?.data?.message, "success");
            onOpenModalConfirm(false);
            // navigate tới quản lý vps
            if (type !== "bu-cloud") {
                navigate("/vps/digital-ocean");
            } else {
                navigate("/vps/bu-cloud", {
                    state: { keyTab: "digital-ocean" },
                });
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            showToast("Lỗi khi thanh toán, vui lòng thử lại sau", "error");
            return;
        }
    };

    return (
        <Modal isOpen={isOpenModalConfirm} onOpenChange={onOpenModalConfirm}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Xác nhận mua VPS
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-center font-bold">
                                Thông tin VPS
                            </p>
                            <div className="flex justify-between">
                                <p>Tên VPS:</p>
                                <p className="font-bold">{nameVPS}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Khu Vực:</p>
                                <p className="font-bold">
                                    {selectedRegion?.label} -{" "}
                                    {...selectedDataCenter}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p>Hệ điều hành:</p>
                                <p className="font-bold">{getNameOfImage()}</p>
                            </div>
                            <div>
                                <p>Cấu hình :</p>
                                <div className="pl-5 mt-3">
                                    <div className="flex justify-between">
                                        <p>- CPU: </p>
                                        <p className="font-bold">
                                            {selectedSize?.vcpus} CPUs
                                        </p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>- RAM: </p>
                                        <p className="font-bold">
                                            {handleDisplayMemory(
                                                selectedSize?.memory
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>- Ổ cứng: </p>
                                        <p className="font-bold">
                                            {selectedSize?.disk} GB{" "}
                                            {isSelectAddStorage &&
                                                `+ ${addStorage?.size_gigabytes} GB`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <p>Tổng thanh toán:</p>
                                    <p className="font-bold">
                                        {convertPriceMonthly(sumTotal)}/tháng
                                    </p>
                                </div>
                                <div className="pl-5 mt-3">
                                    <div className="flex justify-between">
                                        <p>- VPS: </p>
                                        <p className="font-bold">
                                            {convertPriceMonthly(
                                                selectedSize?.price_monthly
                                            )}
                                            /tháng
                                        </p>
                                    </div>
                                    {isSelectAddStorage && (
                                        <div className="flex justify-between">
                                            <p>- Thêm dung lượng: </p>
                                            <p className="font-bold">
                                                {convertPriceMonthly(
                                                    addStorage?.price_monthly
                                                )}
                                                /tháng
                                            </p>
                                        </div>
                                    )}
                                    {backupsOption?.backups && (
                                        <div className="flex justify-between">
                                            <p>- Bật sao lưu: </p>
                                            <p className="font-bold">
                                                {convertPriceMonthly(
                                                    selectedSize?.price_monthly *
                                                        (backupsOption?.rateCostForBackup /
                                                            100)
                                                )}
                                                /tháng
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p>Chọn Team để tạo</p>
                            <Select
                                className="max-w-xs"
                                radius="none"
                                variant="bordered"
                                aria-label="datacenter"
                                selectedKeys={new Set([infoTeam.teamId])}
                                onSelectionChange={(value: any) => {
                                    handleChangeTeam(value);
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
                                {(listTeam?.data || [])?.map((item: any) => (
                                    <SelectItem
                                        key={item?._id}
                                        textValue={`${item?.name}`}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <div>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Đóng
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleCreateVPSDigitalOcean}
                                    isLoading={isLoading}
                                >
                                    Tạo VPS
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ModalConfirmInfoVPS;
