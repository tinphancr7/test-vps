import { useAppSelector } from "@/stores";
import { useMemo, useState } from "react";
import { RiArrowDropUpLine } from "react-icons/ri";
import { calculatorFeeProvisionedPerformance } from "./utils";

const ViewPrice = () => {
    const [showDetail, setShowDetail] = useState(false);
    const {
        price,
        isLoading,
        provisionedIops,
        provisionedIopsEnabled,
        category,
    } = useAppSelector((state) => state.alibabaEcs);

    const generateResourceName = (resource: string) => {
        switch (resource) {
            case "instanceType":
                return "Instance Type";

            case "bandwidth":
                return "Bandwidth";

            case "image":
                return "Image";

            case "systemDisk":
                return "System Disk";

            default:
                return resource;
        }
    };

    /**
     * ESSD AutoPL disk
     * https://www.alibabacloud.com/help/en/ecs/user-guide/essd-autopl-disks#section-qy1-o3d-f7h
     * Unit price of provisioned performance: USD 0.000006 per IOPS per hour
     * */
    const provisionedPerformanceFee = useMemo(() => {
        if (
            category === "cloud_auto" &&
            provisionedIopsEnabled &&
            provisionedIops
        ) {
            return calculatorFeeProvisionedPerformance(provisionedIops);
        }

        return 0;
    }, [category, provisionedIops, provisionedIopsEnabled]);

    if (isLoading?.price) {
        return (
            <h3 className="text-primary font-medium text-xl text-right my-5">
                Đang tính giá...
            </h3>
        );
    }

    return (
        <>
            <div className="price">
                {showDetail && (
                    <div className={`p-2 bg-gray-100/70 text-sm`}>
                        {price?.DetailInfos?.DetailInfo?.map(
                            (info: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex justify-between mb-2"
                                >
                                    <span>
                                        {generateResourceName(info?.Resource)}
                                    </span>
                                    <p className="tracking-wide">
                                        $ {info?.OriginalPrice} USD
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}
                <div className="price my-2">
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-sm">
                            Giá Instance:
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-[#ff6a00] text-base">
                                {" "}
                                $
                            </span>
                            <span className="text-[#ff6a00] font-medium ml-[1px]">
                                {price?.OriginalPrice}
                            </span>
                            <span className="text-[#333] text-sm font-medium">
                                {" "}
                                USD
                            </span>
                        </div>
                    </div>

                    {!!provisionedPerformanceFee && (
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-sm">
                                Phí hiệu suất được cung cấp:
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="text-[#ff6a00] text-base">
                                    {" "} $
                                </span>
                                <span className="text-[#ff6a00] font-medium ml-[1px]">
                                    {provisionedPerformanceFee}
                                </span>
                                <span className="text-[#333] text-sm font-medium">
                                    {" "} USD / Month
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="my-2 text-[#ff6a00] text-base flex items-center justify-end gap-1 cursor-pointer select-none"
                onClick={() => setShowDetail(!showDetail)}
            >
                <span>Xem chi tiết</span>
                <RiArrowDropUpLine className={`text-2xl transition-transform duration-200 ease-linear ${showDetail ? 'rotate-0' : 'rotate-180'}`} />
            </div>
        </>
    );
};

export default ViewPrice;
