import Container from "@/components/container";
import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAlibabaEcsInstanceByVpsId, asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId } from "@/stores/async-thunks/alibaba-ecs-thunk";
import { Button, Chip, Spinner } from "@heroui/react";
import { useMemo } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconType } from "react-icons";
import { FaPowerOff } from "react-icons/fa6";
import { IoRefresh } from "react-icons/io5";
import { MdRestartAlt } from "react-icons/md";
import { VscDebugStart } from "react-icons/vsc";
import alibabaEcsApis from "@/apis/alibaba-ecs.api";
import showToast from "@/utils/toast";
import { setIsSubmitting } from "@/stores/slices/alibaba-ecs.slice";
import buCloudAlibabaEcsApis from "@/apis/bu-cloud-alibaba-ecs.api";

type ActionItem = {
    key: string;
    label: string;
    icon: IconType;
    color: string;
    bg: string;
    onClick?: () => void;
    isDisabled?: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const actionsList: Array<ActionItem> = [
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

function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { pathname } = useLocation();
    
    const { instance, isLoading, isSubmitting } = useAppSelector(
        (state) => state.alibabaEcs
    );

    const colorStatus = (type: string) => {
        switch (type) {
            case "Pending":
            case "Stopping":
                return "warning";

            case "Running":
                return "success";

            default:
                return "danger";
        }
    };

    const handleNavigate = () => {
        navigate(paths.vps_management_alibaba_ecs, {
            state: { keyTab: "alibaba-ecs" },
        });
    };
    
    const disabledKeys = useMemo(() => {
        const arrKeys = [];

        if (
            !instance?.["vps_id"]?.Status ||
            ["Pending", "Stopping"].includes(instance?.["vps_id"]?.Status)
        ) {
            arrKeys.push(...["stop", "start", "reboot"]);
        }

        if (instance?.["vps_id"]?.Status === "Running") {
            arrKeys.push(...["start"]);
        }

        if (instance?.["vps_id"]?.Status === "Stopped") {
            arrKeys.push(...["stop", "reboot"]);
        }

        return arrKeys;
    }, [instance]);

    const handleShutdownVps = async () => {
        try {
            dispatch(setIsSubmitting(true));

            const split = pathname?.split('/');
            let api: any = alibabaEcsApis;

            if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
                api = buCloudAlibabaEcsApis;
            }

            const { data } = await api.stopInstance(instance?.["vps_id"]?.InstanceId);

            if (data?.status === 1) {
                showToast(
                    "Đang Stop VPS!. Vui lòng đợi trong giây lát...",
                    "success"
                );
            }
        } catch (error: any) {
            console.log('error: ', error);
            showToast(error.response?.data?.message || "Tắt nguồn VPS thất bại", "error");
        } finally {
            dispatch(setIsSubmitting(false));
        }
    };

    const handleRebootVps = async () => {
        try {
            dispatch(setIsSubmitting(true));

            const split = pathname?.split('/');
            let api: any = alibabaEcsApis;

            if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
                api = buCloudAlibabaEcsApis;
            }

            const { data } = await api.rebootInstance(instance?.["vps_id"]?.InstanceId);

            if (data?.status === 1) {
                showToast(
                    "Đang khởi động lại VPS!. Vui lòng đợi trong giây lát...",
                    "success"
                );
            }
        } catch (error: any) {
            console.log('error: ', error);
            showToast(error.response?.data?.message || "Reboot VPS thất bại", "error");
        } finally {
            dispatch(setIsSubmitting(false));
        }
    };

    const handleStartVps = async () => {
        try {
            dispatch(setIsSubmitting(true));

            const split = pathname?.split('/');
            let api: any = alibabaEcsApis;

            if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
                api = buCloudAlibabaEcsApis;
            }

            const { data } = await api.startInstance(instance?.["vps_id"]?.InstanceId);

            if (data?.status === 1) {
                showToast(
                    "Đang khởi động VPS!. Vui lòng đợi trong giây lát...",
                    "success"
                );
            }
        } catch (error: any) {
            console.log('error: ', error);

            showToast(error.response?.data?.message || "Khởi động VPS thất bại", "error");
        } finally {
            dispatch(setIsSubmitting(false));
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
                // eslint-disable-next-line no-case-declarations
                const split = pathname?.split('/');

                if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
                    dispatch(asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId(id as string));
                } else {
                    dispatch(asyncThunkGetAlibabaEcsInstanceByVpsId(id as string));
                }

                break;
        }
    };

    return (
        <Container className="flex justify-between p-4">
            <div className="flex items-center justify-start gap-6">
                {/* Back to VPS VNG Page */}
                <Button
                    color="primary"
                    className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg mt-1"
                    onPress={handleNavigate}
                >
                    <HiOutlineArrowLeft />
                </Button>

                <span className="capitalize text-[20px] tracking-wider font-medium">
                    {instance?.["vps_id"]?.InstanceName}
                </span>

                <Chip
                    radius="sm"
                    color={colorStatus(instance?.["vps_id"]?.["Status"])}
                    variant="flat"
                    classNames={{
                        base: "h-auto",
                        content:
                            "font-semibold tracking-wider py-1 items-center gap-2 flex",
                    }}
                >
                    {instance["vps_id"]?.["Status"] === "Pending" && (
                        <Spinner size="sm" aria-label="Loading..." />
                    )}
                    {isLoading?.detail ? (
                        <Spinner color="primary" size="sm" />
                    ) : (
                        instance?.["vps_id"]?.["Status"]
                    )}
                </Chip>
            </div>

            <div className="flex items-center flex-row gap-5 px-2">
                {actionsList?.map(
                    (item, index) =>
                        !disabledKeys.includes(item?.key) && (
                            <Button
                                key={index}
                                variant="bordered"
                                radius="md"
                                className={`text-primary-500 bg-white border-primary-500 font-bold tracking-wide min-w-0 w-max min-h-max`}
                                onPress={() => onActionClick(item?.key)}
                                isLoading={
                                    item?.key !== "refresh" &&
                                    (instance?.["vps_id"]?.["state"]?.["name"] === "pending" || isSubmitting)
                                }
                            >
                                
                                {item?.label}
                            </Button>
                        )
                )}
            </div>
        </Container>
    );
}

export default Header;
