import { useAppDispatch, useAppSelector } from "@/stores";
import {
    setDataSettingLoadBalancer,
    updateSettingLoadBalancer,
} from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting.slice";
import { convertPriceMonthlyWithStr } from "@/utils/digital-ocean";
import showToast from "@/utils/toast";
import { Button, Input, Tooltip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import ButtonEdit from "./ButtonEdit";
const configNode = {
    per_connections: 10000,
    per_request: 10000,
    per_ssl_connections: 250,
    minValueNode: 1,
    maxValueNode: 3,
};
function ScalingConfiguration({ info, setRender }: any) {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const {
        detailSettingLoadBalancer,
        dataChangeSetting,
        result,
        hiddenButtonEditSetting,
    }: any = useAppSelector((state) => state.loadBalancerEditDigitalOcean);
    const connections =
        detailSettingLoadBalancer?.size_unit * configNode.per_connections;
    const second =
        detailSettingLoadBalancer?.size_unit * configNode.per_request;
    const ssl =
        detailSettingLoadBalancer?.size_unit * configNode.per_ssl_connections;
    const [enableEdit, setEnableEdit] = useState(false);
    useEffect(() => {
        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    scalingConfiguration: {
                        valueOfNode: detailSettingLoadBalancer?.size_unit,
                        statusValueNode: true,
                    },
                },
            })
        );
    }, [detailSettingLoadBalancer, enableEdit]);
    const priceInfo = info?.size_unit * 12;

    const price = dataChangeSetting?.scalingConfiguration?.valueOfNode * 12;

    const renderErrorMess = useMemo(() => {
        let errorMessage = "";
        let statusValueNode = true;

        if (dataChangeSetting?.scalingConfiguration?.valueOfNode > 3) {
            errorMessage = `Số lượng Node tối đa là ${configNode.maxValueNode}`;
            statusValueNode = false;
        } else if (dataChangeSetting?.scalingConfiguration?.valueOfNode < 1) {
            errorMessage = `Số lượng Node tối thiểu là ${configNode.minValueNode}`;
            statusValueNode = false;
        }

        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    ...dataChangeSetting,
                    scalingConfiguration: {
                        ...dataChangeSetting.scalingConfiguration,
                        statusValueNode,
                    },
                },
                isConfirmUpdateNode: statusValueNode,
            })
        );
        return errorMessage;
    }, [dataChangeSetting?.scalingConfiguration?.valueOfNode]);

    const handleChangeSettingLoadBalancer = async () => {
        if (
            info?.size_unit ===
            Number(dataChangeSetting?.scalingConfiguration?.valueOfNode)
        ) {
            setEnableEdit(false);
            dispatch(
                setDataSettingLoadBalancer({
                    hiddenButtonEditSetting: false,
                })
            );
            return;
        }
        setIsLoading(true);
        setEnableEdit(false);
        showToast("Đang cập nhật thay đổi", "info");

        await dispatch(
            updateSettingLoadBalancer({
                _id: info?._id,
                dataChangeSetting: {
                    scalingConfiguration:
                        dataChangeSetting?.scalingConfiguration,
                },
                region: info?.slugDataCenter,
                forwarding_rules: info?.forwarding_rules,
                name: info?.name_load_balancer,
            })
        );
        setEnableEdit(false);
        dispatch(
            setDataSettingLoadBalancer({
                hiddenButtonEditSetting: false,
            })
        );
        setIsLoading(false);
    };

    useEffect(() => {
        if (!result?.status && Object.keys(result).length > 0) {
            showToast(result?.data, "error");
            return;
        }
        setRender((prev: any) => !prev);
        showToast(result?.data, "success");
    }, [isLoading]);
    const isDisable = info?.status === "terminated";

    return (
        <>
            {!enableEdit ? (
                <div className=" grid grid-cols-4 my-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        Cấu hình mở rộng:
                    </h3>
                    <div className=" col-span-2 grid grid-cols-2 lg:grid-cols-5 my-auto gap-4  text-center">
                        <span>
                            <p>Số lượng node</p>
                            <strong>{info?.size_unit}</strong>
                        </span>
                        <span>
                            <p>Kết nối đồng thời</p>
                            <strong>{connections.toLocaleString()}</strong>
                        </span>
                        <span>
                            <p>Yêu cầu mỗi giây</p>
                            <strong>{second.toLocaleString()}</strong>
                        </span>
                        <span>
                            <p>Kết nối SSL mỗi giây</p>
                            <strong> {ssl.toLocaleString()}</strong>
                        </span>
                        <span>
                            <p>Giá</p>
                            <strong>
                                {convertPriceMonthlyWithStr(priceInfo)}
                            </strong>
                        </span>
                    </div>
                    <div className="col-span-1 my-auto flex justify-center">
                        {!hiddenButtonEditSetting ? (
                            <Button
                                onPress={() => {
                                    setEnableEdit(true);
                                    dispatch(
                                        setDataSettingLoadBalancer({
                                            hiddenButtonEditSetting: true,
                                            result: {},
                                        })
                                    );
                                }}
                                isDisabled={isDisable}
                                className="bg-primary"
                            >
                                Thay đổi
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="my-4">
                        <div>
                            <div className="titleBalancer my-5">
                                <h2 className="font-bold text-[20px]">
                                    Cấu hình mở rộng
                                </h2>
                                <div className="grid md:grid-cols-2 grid-cols-1 mt-4  bg-white ">
                                    <div className=" border">
                                        <div className="numOfNode grid grid-cols-12 p-8 ">
                                            <div className="w-full  col-span-4 my-auto">
                                                <span className="mx-auto flex gap-1">
                                                    <span className="">
                                                        Số lượng Node
                                                    </span>
                                                    <div>
                                                        <Tooltip
                                                            size="md"
                                                            delay={100}
                                                            closeDelay={100}
                                                            color="foreground"
                                                            content={
                                                                <div className="p-3 w-56 text-white flex justify-center text-center">
                                                                    <p className="text-medium ">
                                                                        Yêu cầu
                                                                        tối
                                                                        thiểu là
                                                                        1 node,
                                                                        mỗi node
                                                                        tính cố
                                                                        định
                                                                        12$/tháng
                                                                    </p>
                                                                </div>
                                                            }
                                                        >
                                                            <span className="w-4 h-5 text-center bg-[#ececec] text-[#999] inline-block cursor-pointer rounded-sm hover:bg-primary-500 hover:text-white duration-200 transition-all ease-in-out text-[14px]">
                                                                ?
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </span>
                                            </div>
                                            <div className=" flex-wrap flex justify-end  gap-1 col-start-11 col-span-2 ">
                                                <Input
                                                    type="number"
                                                    width={"50px"}
                                                    min={1}
                                                    max={3}
                                                    step={1} // Đặt step để chỉ cho phép nhập số nguyên
                                                    variant="bordered"
                                                    radius="sm"
                                                    defaultValue={String(
                                                        dataChangeSetting
                                                            ?.scalingConfiguration
                                                            ?.valueOfNode
                                                    )}
                                                    classNames={{
                                                        input: "text-center font-bold",
                                                    }}
                                                    onBlur={() => {
                                                        if (
                                                            !dataChangeSetting
                                                                ?.scalingConfiguration
                                                                ?.valueOfNode
                                                        ) {
                                                            dispatch(
                                                                setDataSettingLoadBalancer(
                                                                    {
                                                                        dataChangeSetting:
                                                                            {
                                                                                scalingConfiguration:
                                                                                    {
                                                                                        valueOfNode: 2,
                                                                                    },
                                                                            },
                                                                    }
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        dispatch(
                                                            setDataSettingLoadBalancer(
                                                                {
                                                                    dataChangeSetting:
                                                                        {
                                                                            scalingConfiguration:
                                                                                {
                                                                                    valueOfNode:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                        },
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    value={String(
                                                        dataChangeSetting
                                                            ?.scalingConfiguration
                                                            ?.valueOfNode
                                                    )}
                                                />
                                                <div className="w-full flex justify-center">
                                                    <p className="text-red-500 text-[12px] h-2 ">
                                                        {renderErrorMess}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="detaildOfNode bg-[#FAFAFA] p-8 leading-5 flex flex-col gap-8  border-b-2 border-t-2">
                                            <div className="grid grid-cols-12 ">
                                                <span className=" flex gap-1 justify-start col-span-8">
                                                    Kết nối đồng thời
                                                    <div>
                                                        <Tooltip
                                                            size="md"
                                                            delay={100}
                                                            closeDelay={100}
                                                            color="foreground"
                                                            content={
                                                                <div className="p-3 w-56 text-white flex justify-center text-center">
                                                                    <p className="text-medium ">
                                                                        Số lượng
                                                                        kết nối
                                                                        đang
                                                                        hoạt
                                                                        động mà
                                                                        Load
                                                                        Balancer
                                                                        có thể
                                                                        xử lý
                                                                        bất cứ
                                                                        lúc nào{" "}
                                                                    </p>
                                                                </div>
                                                            }
                                                        >
                                                            <span className="w-4 h-5 text-center bg-[#ececec] text-[#999] inline-block cursor-pointer rounded-sm hover:bg-primary-500 hover:text-white duration-200 transition-all ease-in-out text-[14px]">
                                                                ?
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </span>
                                                <div className="col-span-4 justify-end flex">
                                                    <p>
                                                        {(
                                                            dataChangeSetting
                                                                ?.scalingConfiguration
                                                                ?.valueOfNode *
                                                            configNode.per_connections
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 ">
                                                <span className=" flex gap-1 justify-start col-span-8">
                                                    <span>
                                                        Yêu cầu mỗi giây
                                                    </span>
                                                </span>
                                                <div className="col-span-4 justify-end flex">
                                                    <p>
                                                        {(
                                                            dataChangeSetting
                                                                ?.scalingConfiguration
                                                                ?.valueOfNode *
                                                            configNode.per_request
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12">
                                                <span className=" flex gap-1 justify-start col-span-8">
                                                    <span>
                                                        {" "}
                                                        Kết nối SSL mỗi giây
                                                    </span>
                                                    <div>
                                                        <Tooltip
                                                            size="md"
                                                            delay={100}
                                                            closeDelay={100}
                                                            color="foreground"
                                                            content={
                                                                <div className="p-3 w-56 text-white flex justify-center text-center">
                                                                    <p className="text-medium ">
                                                                        Đây là
                                                                        những
                                                                        kết nối
                                                                        cần giải
                                                                        mã các
                                                                        SSL
                                                                    </p>
                                                                </div>
                                                            }
                                                        >
                                                            <span className="w-4 h-5 text-center bg-[#ececec] text-[#999] inline-block cursor-pointer rounded-sm hover:bg-primary-500 hover:text-white duration-200 transition-all ease-in-out text-[14px]">
                                                                ?
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </span>
                                                <div className="col-span-4 flex justify-end">
                                                    <p>
                                                        {(
                                                            dataChangeSetting
                                                                ?.scalingConfiguration
                                                                ?.valueOfNode *
                                                            configNode.per_ssl_connections
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 ">
                                                <span className=" flex gap-1 justify-start col-span-8">
                                                    <span>
                                                        {" "}
                                                        Tính khả dụng cao
                                                    </span>
                                                    <div>
                                                        <Tooltip
                                                            size="md"
                                                            delay={100}
                                                            closeDelay={100}
                                                            color="foreground"
                                                            content={
                                                                <div className="p-3 w-56 text-white flex justify-center text-center">
                                                                    <p className="text-medium ">
                                                                        Thêm
                                                                        nhiều
                                                                        Node để
                                                                        đảm bảo
                                                                        dịch vụ
                                                                        của bạn
                                                                        có tính
                                                                        khả dụng
                                                                        cao
                                                                    </p>
                                                                </div>
                                                            }
                                                        >
                                                            <span className="w-4 h-5 text-center bg-[#ececec] text-[#999] inline-block cursor-pointer rounded-sm hover:bg-primary-500 hover:text-white duration-200 transition-all ease-in-out text-[14px]">
                                                                ?
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </span>
                                                <div className="col-span-4 justify-end flex">
                                                    {dataChangeSetting
                                                        ?.scalingConfiguration
                                                        ?.valueOfNode > 1 ? (
                                                        <p className="flex gap-1">
                                                            <FaCheckCircle
                                                                color="#15CD72"
                                                                className="my-auto"
                                                            />{" "}
                                                            Đã bật
                                                        </p>
                                                    ) : (
                                                        <p className="flex gap-2 ">
                                                            <FaCircleInfo
                                                                color="#0069ff"
                                                                className="my-auto"
                                                            />
                                                            Đã tắt
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="totalOfMonth p-8">
                                            <p className="text-[20px] font-bold">
                                                Chi phí hàng tháng:{" "}
                                                {convertPriceMonthlyWithStr(
                                                    price
                                                )}
                                            </p>
                                            <p>
                                                {convertPriceMonthlyWithStr(12)}{" "}
                                                / Node
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 p-2 my-auto mt-4">
                                        <FaCircleInfo
                                            className="w-3/12 mt-1"
                                            color="#0069ff"
                                        />
                                        <div>
                                            <p className="font-bold">
                                                {" "}
                                                Bạn không biết nên chọn kích
                                                thước nào?
                                            </p>
                                            <p>
                                                Bắt đầu với hai Node để triển
                                                khai sản xuất hoặc một Node để
                                                thử nghiệm. Sau khi tạo Load
                                                Balancer, hãy theo dõi các số
                                                liệu trên và tăng hoặc giảm quy
                                                mô bất kỳ lúc nào khi cần.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <ButtonEdit
                                handleChangeSettingLoadBalancer={
                                    handleChangeSettingLoadBalancer
                                }
                                setEnableEdit={setEnableEdit}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default ScalingConfiguration;
