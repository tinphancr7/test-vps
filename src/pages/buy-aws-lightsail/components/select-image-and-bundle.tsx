import { useMemo, useState } from "react";
import { blueprints, bundles } from "@/mocks/aws";
import { AWS_PLATFORM, AWS_PLATFORM_TYPE } from "@/enums/aws.enum";
import { BlueprintType, BundleType } from "@/types/aws.type";
import { genAWSImageBlueprint } from "@/utils/collections/aws";
import { formatPriceUsd } from "@/utils/format-price-usd";

const SelectionItem = ({
    image,
    name,
    extra,
    className = "",
    onClick = () => null,
    value = "",
    isActive = false,
}: {
    image: string;
    name: string;
    extra: string;
    className?: string;
    onClick?: (e: any) => void;
    value?: string | BlueprintType;
    isActive?: boolean;
}) => {
    return (
        <button
            className={`flex cursor-pointer items-center gap-2 rounded-[8px] border-[2px] ${
                isActive ? "border-primary bg-primary-light" : ""
            } p-2 ${className}`}
            onClick={() => onClick(value)}
        >
            <img src={image} className="w-[42px]" alt={name} />
            <div className="text-left">
                <div className="text-md font-semibold leading-[16px]">
                    {name}
                </div>
                <div className="mt-1 text-xs text-secondary-dark">{extra}</div>
            </div>
        </button>
    );
};

type Props = {
    blueprint: BlueprintType;
    setBluesprint: (e: BlueprintType) => void;
    bundle: BundleType;
    setBundle: (e: BundleType) => void;
};

function SelectImageAndBundle({
    blueprint,
    setBluesprint,
    bundle,
    setBundle,
}: Props) {
    const [platform, setPlatform] = useState(AWS_PLATFORM.LINUX_UNIX);
    const [type, setType] = useState(AWS_PLATFORM_TYPE.APP);

    const genPlatformOptions = () => {
        return [
            {
                name: "Linux/Unix",
                value: AWS_PLATFORM.LINUX_UNIX,
                extra:
                    blueprints
                        ?.filter((e) => e?.platform === AWS_PLATFORM.LINUX_UNIX)
                        ?.length?.toString() || "0",
                image: "/imgs/aws/linux.png",
            },
            {
                name: "Micorsoft Windows",
                value: AWS_PLATFORM.WINDOWS,
                extra:
                    blueprints
                        ?.filter((e) => e?.platform === AWS_PLATFORM.WINDOWS)
                        ?.length?.toString() || "0",
                image: "/imgs/aws/windows.png",
            },
        ];
    };

    const blueprintOptions = useMemo(() => {
        const result = blueprints?.filter(
            (e) => e?.platform === platform && e?.type === type
        );
        setBluesprint(result?.[0]);
        return result || [];
    }, [type, platform]);

    const genBundleOptions = useMemo(() => {
        const result = bundles?.filter(
            (e) => e?.supportedPlatforms?.[0] === platform
        );
        setBundle(result?.[0]);
        return result || [];
    }, [platform]);

    return (
        <>
            <div className="mt-4 border-b pb-4">
                <div className="text-[18px] font-semibold">
                    2. Chọn hình ảnh cho phiên bản của bạn
                </div>
                <div className="mt-2 text-[16px] font-normal">
                    - Chọn nền tảng
                </div>
                <div className="mt-2 flex items-center gap-4">
                    {genPlatformOptions()?.map((item) => (
                        <SelectionItem
                            className="flex-1"
                            key={item?.value}
                            image={item?.image}
                            name={item?.name}
                            extra={`${item?.extra} blueprints`}
                            value={item?.value}
                            isActive={item?.value === platform}
                            onClick={(e) => setPlatform(e)}
                        />
                    ))}
                </div>
                <div className="mt-4 text-[16px] font-normal">
                    - Chọn bản thiết kế (hoặc cấu hình sẵn)
                </div>
                <div className="mt-2 flex items-center">
                    <button
                        className={`lg:text-md w-[200px] cursor-pointer rounded-l-[999px] border-[2px] border-r-[0px] border-primary px-4 py-2 text-center text-sm font-semibold ${
                            type === AWS_PLATFORM_TYPE.APP
                                ? "bg-primary text-white"
                                : "text-black"
                        } lg:w-[250px]`}
                        onClick={() => setType(AWS_PLATFORM_TYPE.APP)}
                    >
                        Apps + OS
                    </button>
                    <button
                        onClick={() => setType(AWS_PLATFORM_TYPE.OS)}
                        className={`lg:text-md w-[200px] cursor-pointer rounded-r-[999px] border-[2px] border-primary px-4 py-2 text-center text-sm font-semibold ${
                            type === AWS_PLATFORM_TYPE.OS
                                ? "bg-primary text-white"
                                : "text-black"
                        } lg:w-[250px]`}
                    >
                        Operating System (OS) only
                    </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {blueprintOptions?.map((item) => (
                        <SelectionItem
                            className="col-span-1"
                            key={item?.blueprintId}
                            image={genAWSImageBlueprint(item?.blueprintId)}
                            name={item?.name}
                            extra={item?.version}
                            value={item}
                            isActive={
                                item?.blueprintId === blueprint?.blueprintId
                            }
                            onClick={(e) => setBluesprint(e)}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-4 border-b pb-4">
                <div className="text-[18px] tracking-wider font-semibold">
                    3. Chọn gói phiên bản của bạn
                </div>
                <div className="mt-2 text-[16px] font-normal">
                    - Chọn kích thước
                </div>
                <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {genBundleOptions?.map((item) => (
                        <button
                            onClick={() => {
                                setBundle(item);
                            }}
                            key={item?.bundleId}
                            className={`rounded-[12px] border-[2px] py-4 ${
                                bundle?.bundleId === item?.bundleId
                                    ? "border-primary bg-primary-light"
                                    : ""
                            }`}
                        >
                            <div className="text-2xl font-semibold tracking-wider">
                                {formatPriceUsd(item?.price)}
                            </div>
                            <div className="text-base tracking-wider font-bold text-primary">
                                USD mỗi tháng
                            </div>

                            <div className="mt-3 w-full border-t pt-2">
                                <div>
                                    <b>
                                        {item?.ramSizeInGb < 1
                                            ? `${item?.ramSizeInGb * 1024} MB`
                                            : `${item?.ramSizeInGb} GB`}
                                    </b>{" "}
                                    <i className="text-base text-primary-500">
                                        Memory
                                    </i>
                                </div>

                                <div>
                                    <b>{item?.cpuCount} vCPUs</b>{" "}
                                    <i className="text-base text-primary-500">
                                        Processing
                                    </i>
                                </div>

                                <div>
                                    <b>{item?.diskSizeInGb} GB SSD</b>{" "}
                                    <i className="text-base text-primary-500">
                                        Storage
                                    </i>
                                </div>

                                <div>
                                    <b>
                                        {item?.transferPerMonthInGb / 1024} TB
                                    </b>{" "}
                                    <i className="text-base text-primary-500">
                                        Transfer
                                    </i>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SelectImageAndBundle;
