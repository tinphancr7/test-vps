import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Spinner,
    Tooltip,
} from "@heroui/react";
import { IconType } from "react-icons";
import {} from "react-icons/vsc";
import { FaPowerOff } from "react-icons/fa6";
import {
    VscSettingsGear,
    VscDebugRestart,
    VscDebugStart,
} from "react-icons/vsc";
import React, { useEffect, useState } from "react";
import showToast from "@/utils/toast";
import alibabaEcsApis from "@/apis/alibaba-ecs.api";

interface ActionItem {
    key: string;
    label: string;
    icon: IconType;
    color: string;
    onClick?: () => void;
    isDisabled?: boolean;
}

function ActionsVps({ item }: { item: any }) {
    const iconClasses = "text-xl pointer-events-none flex-shrink-0";
    const [statusVps, setStatusVps] = useState("pending");
    const [disabledKeys, setDisabledKeys] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const actionsList: Array<ActionItem> = [
        {
            key: "stop",
            label: "Tắt nguồn",
            icon: FaPowerOff,
            color: "text-danger",
        },
        {
            key: "start",
            label: "Mở nguồn",
            icon: VscDebugStart,
            color: "text-primary",
        },
        {
            key: "reboot",
            label: "Khởi động lại",
            icon: VscDebugRestart,
            color: "text-blue-400",
        },
    ];

    const onAction = (key: React.Key) => {
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
        }
    };

    useEffect(() => {
        setStatusVps(item?.Status);

        const arrKeys: any = [];

        if (
            !item?.Status ||
            ["Pending", "Stopping"].includes(item?.Status)
        ) {
            arrKeys.push(...["stop", "start", "reboot"]);
        }

        if (item?.Status === "Running") {
            arrKeys.push(...["start"]);
        }

        if (item?.Status === "Stopped") {
            arrKeys.push(...["stop", "reboot"]);
        }

        setDisabledKeys(arrKeys);

        return () => {};
    }, [item]);

    const handleShutdownVps = async () => {
        try {
            setIsSubmitting(true);

            setStatusVps("pending");

            const { data } = await alibabaEcsApis.stopInstance(item?.InstanceId);

            if (data?.status === 1) {
                showToast(
                    "Đang Stop VPS!. Vui lòng đợi trong giây lát...",
                    "success"
                );
            }
        } catch (error) {
            console.log("error: ", error);

            showToast("Có lỗi xảy ra", "error");
            setStatusVps(statusVps);
        } finally {
          setIsSubmitting(false);
        }
    };

    const handleRebootVps = async () => {
        try {
            setIsSubmitting(true);

            setStatusVps("pending");
            const { data } = await alibabaEcsApis.rebootInstance(item?.InstanceId);

            if (data?.status === 1) {
                showToast("Reboot VPS thành công", "success");
                setStatusVps("running");
            }

        } catch (error) {
            console.log("error: ", error);
            showToast("Có lỗi xảy ra", "error");
            setStatusVps(statusVps);
        } finally {
          setIsSubmitting(false);
        }
    };

    const handleStartVps = async () => {
        try {
            setIsSubmitting(true);

            setStatusVps("pending");
            const { data } = await alibabaEcsApis.startInstance(item?.InstanceId);

            if (data?.status === 1) {
                showToast(
                    "Đang Start VPS!. Vui lòng đợi trong giây lát...",
                    "success"
                );
            }

        } catch (error: any) {
            console.log("error: ", error);
            showToast("Có lỗi xảy ra", "error");

            setStatusVps(statusVps);
        } finally {
          setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dropdown radius="sm">
                <DropdownTrigger>
                    <Button
                        variant="solid"
                        radius="full"
                        className={`text-blue-500 bg-transparent min-w-0 w-max p-1 h-max min-h-max`}
                    >
                        <Tooltip
                            content={"Điều khiển"}
                            classNames={{
                                base: "",
                                content: "bg-blue-500 text-light",
                            }}
                        >
                            {statusVps === "pending" || isSubmitting ? (
                              <Spinner size="sm" color="primary" />
                            ) : (
                              <i>
                                  <VscSettingsGear className="min-w-max text-base w-6 h-6" />
                              </i>
                            )}
                        </Tooltip>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    variant="faded"
                    aria-label="Dropdown menu with icons"
                    itemClasses={{
                        base: "gap-3",
                    }}
                    onAction={onAction}
                    disabledKeys={disabledKeys}
                >
                    {actionsList?.map((ac: ActionItem) => {
                        const Icon = ac?.icon;

                        return (
                            <DropdownItem
                                key={ac?.key}
                                startContent={
                                    <Icon
                                        className={`${iconClasses} ${ac?.color}`}
                                    />
                                }
                            >
                                {ac?.label}
                            </DropdownItem>
                        );
                    })}
                </DropdownMenu>
            </Dropdown>
        </>
    );
}

export default ActionsVps;
