import awsLightsailApis from "@/apis/aws-lightsail.api";
import Access from "@/components/Access/access";
import Container from "@/components/container";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { AWS_INSTANCE_STATUS } from "@/enums/aws.enum";
import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetInstanceAwsLightsailByVpsId } from "@/stores/async-thunks/aws-lightsail-thunk";
import {
    genAWSImageBlueprint,
    genAWSShortNameZone,
    genLocationImageByAWSRegion,
    regionWithCountry,
} from "@/utils/collections/aws";
import showToast from "@/utils/toast";
import { Button, Chip, Spinner, Tooltip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { IconType } from "react-icons";
import { FaPowerOff, FaRegCopy } from "react-icons/fa6";
import { HiOutlineArrowLeft } from "react-icons/hi";
import {
    IoMdCheckmarkCircleOutline,
    IoMdInformationCircleOutline,
    IoMdPower,
} from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import { MdContentCopy, MdRestartAlt } from "react-icons/md";
import { VscDebugStart } from "react-icons/vsc";
import { useNavigate, useParams } from "react-router-dom";
import ConnectTab from "./components/connect-tab";
import StorageTab from "./components/storage-tab";
import NetworkingTab from "./components/networking-tab";

interface ActionItem {
    key: string;
    label: string;
    icon: IconType;
    color: string;
    bg: string;
    onClick?: () => void;
    isDisabled?: boolean;
}

const tabs = [
    {
        id: "connect",
        name: "Connect",
    },
    // {
    //   id: 'snapshots',
    //   name: 'Snapshots'
    // },
    {
        id: "storage",
        name: "Storage",
    },
    {
        id: "networking",
        name: "Networking",
    },
    // {
    //   id: 'domains',
    //   name: 'Domains'
    // },
    // {
    //   id: 'history',
    //   name: 'History'
    // }
];

function DetailVpsAwsLightsail() {
    const dispatch = useAppDispatch();
    const { instance, isLoading } = useAppSelector(
        (state) => state.awsLightsail
    );
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tab, setTab] = useState("connect");

    useEffect(() => {
        dispatch(asyncThunkGetInstanceAwsLightsailByVpsId(id));

        return () => {};
    }, []);

    const handleNavigate = () => {
        navigate(paths.vps_manage_bu_cloud, {
            state: { keyTab: "amazon-lightsail" },
        });
    };

    const actionsList: Array<ActionItem> = [
        {
            key: "stop",
            label: "Stop",
            icon: FaPowerOff,
            color: "text-danger",
            bg: "bg-danger-100",
        },
        {
            key: "start",
            label: "Start",
            icon: VscDebugStart,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            key: "reboot",
            label: "Reboot",
            icon: MdRestartAlt,
            color: "text-blue-400",
            bg: "bg-primary-100",
        },
        {
            key: "refresh",
            label: "Làm mới",
            icon: IoRefresh,
            color: "text-default-500",
            bg: "bg-default-200",
        },
    ];

    const handleShutdownVps = async () => {
        try {
            setIsSubmitting(true);

            const { data } = await awsLightsailApis.stopInstance(id as string);

            if (data?.status === 1) {
                showToast(
                    "Đang Stop VPS!. Vui lòng đợi trong giây lát...",
                    "success"
                );
            }
        } catch (error) {
            console.log("error: ", error);

            showToast("Có lỗi xảy ra", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRebootVps = async () => {
        try {
            setIsSubmitting(true);

            const { data } = await awsLightsailApis.rebootInstance(
                id as string
            );

            if (data?.status === 1) {
                showToast("Reboot VPS thành công", "success");
            }
        } catch (error) {
            console.log("error: ", error);
            showToast("Có lỗi xảy ra", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartVps = async () => {
        try {
            setIsSubmitting(true);

            const { data } = await awsLightsailApis.startInstance(id as string);

            if (data?.status === 1) {
                showToast(
                    "Đang Start VPS!. Vui lòng đợi trong giây lát...",
                    "success"
                );
            }
        } catch (error: any) {
            console.log("error: ", error);
            showToast("Có lỗi xảy ra", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onActionClick = async (key: string) => {
        switch (key) {
            case "stop":
                handleShutdownVps();
                break;

            case "start":
                handleStartVps();
                break;

            case "reboot":
                handleRebootVps();
                break;

            case "refresh":
                dispatch(asyncThunkGetInstanceAwsLightsailByVpsId(id));
                break;
        }
    };

    const disabledKeys = useMemo(() => {
        const arrKeys = [];

        if (
            !instance?.["vps_id"]?.state ||
            ["pending", "stopping"].includes(instance?.["vps_id"]?.state?.name)
        ) {
            arrKeys.push(...["stop", "start", "reboot"]);
        }

        if (instance?.["vps_id"]?.state?.name === "running") {
            arrKeys.push(...["start"]);
        }

        if (instance?.["vps_id"]?.state?.name === "stopped") {
            arrKeys.push(...["stop", "reboot"]);
        }

        return arrKeys;
    }, [instance]);

    const render: any = {
        connect: <ConnectTab />,
        storage: <StorageTab />,
        networking: <NetworkingTab />,
    };

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
    };

    return (
        <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
            <div className="h-full overflow-auto scroll-main">
                {/* Header */}
                <Container className="flex justify-between p-4">
                    <div className="flex items-start justify-start gap-6">
                        {/* Back to VPS VNG Page */}
                        <Button
                            color="primary"
                            className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg mt-1"
                            onPress={handleNavigate}
                        >
                            <HiOutlineArrowLeft />
                        </Button>

                        <div className="flex flex-col">
                            <Chip
                                radius="sm"
                                color="warning"
                                variant="flat"
                                classNames={{
                                    base: "h-auto bg-transparent",
                                    content:
                                        "font-semibold tracking-wider text-2xl py-1 text-primary-500",
                                }}
                            >
                                {isLoading ? (
                                    <Spinner color="primary" size="sm" />
                                ) : (
                                    instance?.["vps_id"]?.["name"]
                                )}
                            </Chip>

                            <div className="text-xs text-gray-500 ml-4">
                                <span className="font-bold">
                                    {
                                        instance?.["vps_id"]?.hardware
                                            ?.ramSizeInGb
                                    }{" "}
                                </span>
                                <span className="text-sm">GB RAM,</span>{" "}
                                <span className="font-bold">
                                    {instance?.["vps_id"]?.hardware?.cpuCount}{" "}
                                </span>
                                <span className="text-sm">vCPU,</span>{" "}
                                <span className="font-bold">
                                    {
                                        instance?.["vps_id"]?.hardware
                                            ?.disks?.[0]?.sizeInGb
                                    }{" "}
                                </span>
                                <span className="text-sm">GB SSD</span>{" "}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center flex-row gap-5 px-2">
                        {/* <span className="capitalize text-base tracking-wider font-medium">
                            {instance?.['vps_id']?.['state']?.['name']}
                        </span> */}

                        {actionsList?.map((item, index) => {
                            if (!disabledKeys.includes(item?.key))
                                return (
                                    <Button
                                        key={index}
                                        variant="bordered"
                                        radius="md"
                                        className={`text-primary-500 bg-white border-primary-500 font-bold tracking-wide min-w-0 w-max min-h-max`}
                                        onPress={() => onActionClick(item?.key)}
                                        isLoading={item?.key !== "refresh" && (instance?.["vps_id"]?.["state"]?.["name"] === "pending" || isSubmitting)}

                                    >
                                        <Tooltip
                                            content={item?.label}
                                            classNames={{
                                                base: "",
                                                content: `${item?.color} bg-white`,
                                            }}
                                        >
                                            {item?.label}
                                        </Tooltip>
                                    </Button>
                                );
                        })}
                    </div>
                </Container>

                {/* Instance Info */}
                <Container className="p-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={genAWSImageBlueprint(
                                instance?.["vps_id"]?.blueprintId
                            )}
                            className="w-[42px]"
                            alt={instance?.["vps_id"]?.blueprintName}
                        />
                        <div className="text-left">
                            <div className="text-2xl tracking-wider font-medium">
                                {instance?.["vps_id"]?.blueprintName}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="col-span-1 border-r">
                            <div className="text-lg font-semibold">
                                AWS Region
                            </div>
                            <div className="mt-3 flex items-center gap-4">
                                <img
                                    className="w-[38px]"
                                    src={genLocationImageByAWSRegion(
                                        instance?.["vps_id"]?.location
                                            ?.regionName
                                    )}
                                    alt={
                                        instance?.["vps_id"]?.location
                                            ?.regionName
                                    }
                                />

                                <div>
                                    <div className="text-base font-semibold">
                                        {
                                            regionWithCountry[
                                                instance?.["vps_id"]?.location
                                                    ?.regionName
                                            ]
                                        }{" "}
                                        - Zone{" "}
                                        {genAWSShortNameZone(
                                            instance?.["vps_id"]?.location
                                                ?.availabilityZone
                                        )}
                                    </div>
                                    <div className="text-xs italic text-gray-500">
                                        {
                                            instance?.["vps_id"]?.location
                                                ?.availabilityZone
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="text-lg font-semibold">
                                    Networking type
                                </div>
                                <div className="text-lg tracking-wide">
                                    {instance?.["vps_id"]?.ipAddressType}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 border-r">
                            <div>
                                <div className="font-medium tracking-wide">
                                    Public IPv4 address
                                </div>
                                <div className="flex items-center gap-1 tracking-wide">
                                    {instance?.["vps_id"]?.publicIpAddress ||
                                    instance?.["vps_id"]?.state?.name ===
                                        AWS_INSTANCE_STATUS.RUNNING ? (
                                        <>
                                            <Tooltip
                                                radius="sm"
                                                content={
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <FaRegCopy />
                                                        Sao chép public IPv4
                                                        address
                                                    </div>
                                                }
                                            >
                                                <button
                                                    className="text-lg text-primary-500"
                                                    onClick={() =>
                                                        handleCopy(
                                                            instance?.["vps_id"]
                                                                ?.publicIpAddress
                                                        )
                                                    }
                                                >
                                                    <MdContentCopy />
                                                </button>
                                            </Tooltip>
                                            {
                                                instance?.["vps_id"]
                                                    ?.publicIpAddress
                                            }
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="font-medium tracking-wide">
                                    Private IPv4 address
                                </div>
                                <div className="flex items-center gap-1 tracking-wide">
                                    <Tooltip
                                        radius="sm"
                                        content={
                                            <div className="flex items-center gap-1 text-xs">
                                                <FaRegCopy />
                                                Sao chép private IPv4 address
                                            </div>
                                        }
                                    >
                                        <button
                                            className="text-lg text-primary-500"
                                            onClick={() =>
                                                handleCopy(
                                                    instance?.["vps_id"]
                                                        ?.privateIpAddress
                                                )
                                            }
                                        >
                                            <MdContentCopy />
                                        </button>
                                    </Tooltip>
                                    {instance?.["vps_id"]?.privateIpAddress}
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="font-medium tracking-wide">
                                    Public IPv6 address
                                </div>
                                <div className="flex items-center gap-1 tracking-wide">
                                    <button
                                        className="text-lg text-primary-500"
                                        onClick={() =>
                                            handleCopy(
                                                instance?.["vps_id"]
                                                    ?.ipv6Addresses
                                            )
                                        }
                                    >
                                        <MdContentCopy />
                                    </button>
                                    {instance?.["vps_id"]?.ipv6Addresses}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="font-semibold">Instance status</div>
                            <div
                                className={`flex items-center gap-2 ${
                                    instance?.["vps_id"]?.state?.name ===
                                    AWS_INSTANCE_STATUS.RUNNING
                                        ? "text-green-500"
                                        : instance?.["vps_id"]?.state?.name ===
                                          AWS_INSTANCE_STATUS.STOPPED
                                        ? "text-red-500"
                                        : "text-yellow-400"
                                }`}
                            >
                                <div className="text-xl">
                                    {instance?.["vps_id"]?.state?.name ===
                                    AWS_INSTANCE_STATUS.RUNNING ? (
                                        <IoMdCheckmarkCircleOutline />
                                    ) : instance?.["vps_id"]?.state?.name ===
                                      AWS_INSTANCE_STATUS.STOPPED ? (
                                        <IoMdPower />
                                    ) : (
                                        <IoMdInformationCircleOutline />
                                    )}
                                </div>
                                <div className="text-lg capitalize font-semibold">
                                    {instance?.["vps_id"]?.state?.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>

                {/* tabs */}
                <div className="flex w-full justify-center border-b">
                    <div className="mt-4 flex flex-wrap items-center">
                        {tabs?.map((item, index) => (
                            <button
                                onClick={() => setTab(item?.id)}
                                className={`pb-2 ${
                                    item?.id === tab
                                        ? "border-b-[4px] border-primary-500 text-primary-500"
                                        : ""
                                }`}
                            >
                                <div
                                    className={`${
                                        index === tabs?.length - 1
                                            ? ""
                                            : "border-r"
                                    } px-8 font-semibold`}
                                >
                                    {item?.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="pt-8 pb-20 flex w-full justify-center">
                    <div className="w-full lg:w-[70%]">{render[tab]}</div>
                </div>
            </div>
        </Access>
    );
}

export default DetailVpsAwsLightsail;
