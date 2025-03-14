import { FaCircleInfo } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { Tooltip } from "@heroui/tooltip";
import { useAppDispatch, useAppSelector } from "@/stores";
import { convertPriceMonthlyWithStr } from "@/utils/digital-ocean";
import { Input } from "@heroui/react";
import { setDataLBScalingDigitalOcean } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-scaling.slice";
import { useEffect } from "react";
const configNode = {
    per_connections: 10000,
    per_request: 10000,
    per_ssl_connections: 250,
    minValueNode: 1,
    maxValueNode: 3,
};
function ScalingConfigurationLoadBalancer() {
    const { valueOfNode } = useAppSelector(
        (state) => state.digitalOceanLBScaling
    );
    const dispatch = useAppDispatch();
    const connections = valueOfNode * configNode?.per_connections;
    const second = valueOfNode * configNode?.per_request;
    const ssl = valueOfNode * configNode?.per_ssl_connections;

    const COST_NODE_PER_MONTH = 12;
    const sumMoney = COST_NODE_PER_MONTH * valueOfNode;

    const renderErrorMess = () => {
        let errorMessage = "";
        let statusValueNode = true;

        if (valueOfNode > 3) {
            errorMessage = `Số lượng Node tối đa là ${configNode.maxValueNode}`;
            statusValueNode = false;
        } else if (valueOfNode < 1) {
            errorMessage = `Số lượng Node tối thiểu là ${configNode.minValueNode}`;
            statusValueNode = false;
        }

        dispatch(setDataLBScalingDigitalOcean({ statusValueNode }));
        return errorMessage;
    };
    useEffect(() => {
        dispatch(
            setDataLBScalingDigitalOcean({
                statusValueNode: true,
                valueOfNode: 2,
            })
        );
    }, []);
    return (
        <>
            <div className="titleBalancer my-5">
                <h2 className="font-bold text-[20px]">Cấu hình mở rộng</h2>
                <div className="grid md:grid-cols-2 grid-cols-1 mt-4  bg-white ">
                    <div className=" border">
                        <div className="numOfNode grid grid-cols-12 p-8 ">
                            <div className="w-full  col-span-4 my-auto">
                                <span className="mx-auto flex gap-1">
                                    <span className="">Số lượng Node</span>
                                    <div>
                                        <Tooltip
                                            size="md"
                                            delay={100}
                                            closeDelay={100}
                                            color="foreground"
                                            content={
                                                <div className="p-3 w-56 text-white flex justify-center text-center">
                                                    <p className="text-medium ">
                                                        Yêu cầu tối thiểu là 1
                                                        node, mỗi node tính cố
                                                        định 12$/tháng
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
                                    step={1}
                                    variant="bordered"
                                    radius="sm"
                                    defaultValue={String(valueOfNode)}
                                    classNames={{
                                        input: "text-center font-bold",
                                    }}
                                    onBlur={() => {
                                        if (!valueOfNode) {
                                            dispatch(
                                                setDataLBScalingDigitalOcean({
                                                    valueOfNode: 2,
                                                })
                                            );
                                        }
                                    }}
                                    onChange={(e) => {
                                        dispatch(
                                            setDataLBScalingDigitalOcean({
                                                valueOfNode: e.target.value,
                                            })
                                        );
                                    }}
                                    value={String(valueOfNode)}
                                />
                                <div className="w-full flex justify-center">
                                    <p className="text-red-500 text-[12px] h-2 ">
                                        {renderErrorMess()}
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
                                                        Số lượng kết nối đang
                                                        hoạt động mà Load
                                                        Balancer có thể xử lý
                                                        bất cứ lúc nào{" "}
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
                                    <p>{connections.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 ">
                                <span className=" flex gap-1 justify-start col-span-8">
                                    <span>Yêu cầu mỗi giây</span>
                                </span>
                                <div className="col-span-4 justify-end flex">
                                    <p>{second.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12">
                                <span className=" flex gap-1 justify-start col-span-8">
                                    <span> Kết nối SSL mỗi giây</span>
                                    <div>
                                        <Tooltip
                                            size="md"
                                            delay={100}
                                            closeDelay={100}
                                            color="foreground"
                                            content={
                                                <div className="p-3 w-56 text-white flex justify-center text-center">
                                                    <p className="text-medium ">
                                                        Đây là những kết nối cần
                                                        giải mã các SSL
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
                                    <p>{ssl.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 ">
                                <span className=" flex gap-1 justify-start col-span-8">
                                    <span> Tính khả dụng cao</span>
                                    <div>
                                        <Tooltip
                                            size="md"
                                            delay={100}
                                            closeDelay={100}
                                            color="foreground"
                                            content={
                                                <div className="p-3 w-56 text-white flex justify-center text-center">
                                                    <p className="text-medium ">
                                                        Thêm nhiều Node để đảm
                                                        bảo dịch vụ của bạn có
                                                        tính khả dụng cao
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
                                    {valueOfNode > 1 ? (
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
                                {convertPriceMonthlyWithStr(sumMoney)}
                            </p>
                            <p>
                                {convertPriceMonthlyWithStr(
                                    COST_NODE_PER_MONTH
                                )}{" "}
                                / Node
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 p-2 my-auto mt-4">
                        <FaCircleInfo className="w-3/12 mt-1" color="#0069ff" />
                        <div>
                            <p className="font-bold">
                                {" "}
                                Bạn không biết nên chọn kích thước nào?
                            </p>
                            <p>
                                Bắt đầu với hai Node để triển khai sản xuất hoặc
                                một Node để thử nghiệm. Sau khi tạo Load
                                Balancer, hãy theo dõi các số liệu trên và tăng
                                hoặc giảm quy mô bất kỳ lúc nào khi cần.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ScalingConfigurationLoadBalancer;
