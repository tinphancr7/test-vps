import Container from "@/components/container";
import { useAppDispatch, useAppSelector } from "@/stores";
import { Button, Chip, Snippet, Spinner } from "@heroui/react";
import moment from "moment";
import { useMemo } from "react";
import ModifyInstanceName from "./modify-instance-name";
import ModifyInstancePassword from "./modify-instance-password";
import { actionsList } from "./header";
import { setIsSubmitting } from "@/stores/slices/alibaba-ecs.slice";
import alibabaEcsApis from "@/apis/alibaba-ecs.api";
import showToast from "@/utils/toast";
import { asyncThunkGetAlibabaEcsInstanceByVpsId } from "@/stores/async-thunks/alibaba-ecs-thunk";
import { useLocation, useParams } from "react-router-dom";
import buCloudAlibabaEcsApis from "@/apis/bu-cloud-alibaba-ecs.api";

function BasicInformationInstance() {
    const dispatch = useAppDispatch();
    const { instance, isSubmitting } = useAppSelector(
        (state) => state.alibabaEcs
    );
    const { id } = useParams();
    const { pathname } = useLocation();

    const ecsInfo = useMemo(() => {
        return [
            { 
                key: "InstanceId",
                label: "Instance ID", 
                value: instance?.['vps_id']?.InstanceId 
            },
            { 
                key: "InstanceName",
                label: "Instance Name", 
                value: instance?.['vps_id']?.InstanceName
            },
            { 
                key: "Status",
                label: "Instance Status", 
                value: instance?.['vps_id']?.Status 
            },
            { 
                key: "RegionId",
                label: "Region", 
                value: instance?.['vps_id']?.RegionId?.LocalName
            },
            { 
                key: "ZoneId",
                label: "Zone", 
                value: instance?.['vps_id']?.ZoneId?.LocalName
            },
            { 
                key: "Billing",
                label: "Billing Method", 
                value:  "Subscription"
            },
            { 
                key: "ExpiredTime",
                label: "Expire At", 
                value: moment(instance?.['vps_id']?.ExpiredTime).format('DD-MM-YYYY, HH:mm:ss')
            },
        ]
    }, [instance]);

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

        return [...arrKeys, "refresh"];
    }, [instance]);

    const handleShutdownVps = async () => {
        try {
            dispatch(setIsSubmitting(true));

            let api: any = alibabaEcsApis;

            const split = pathname?.split('/');
            
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

            let api: any = alibabaEcsApis;

            const split = pathname?.split('/');
            
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
            showToast(error.response?.data?.message || "Khởi động VPS thất bại", "error");
        } finally {
            dispatch(setIsSubmitting(false));
        }
    };

    const handleStartVps = async () => {
        try {
            dispatch(setIsSubmitting(true));

            let api: any = alibabaEcsApis;

            const split = pathname?.split('/');
            
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
            console.log('error: ',);
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
                dispatch(asyncThunkGetAlibabaEcsInstanceByVpsId(id as string));
                break;
        }
    };

    const renderValueInfo = (key: string, value: any) => {
        switch (key) {
            case "InstanceId":
                return (
                    <div className="flex items-center gap-0">
                        <Snippet
                            size="sm" 
                            hideSymbol={true}
                            classNames={{
                                base: 'bg-transparent',
                                pre: 'text-base'
                            }}
                        >
                            {value}
                        </Snippet>

                        <ModifyInstancePassword />
                    </div>
                )

            case "InstanceName":
                return (
                    <div className="flex items-center gap-1">
                        <span className="text-base">{value}</span>
                        
                        <ModifyInstanceName />
                    </div>
                )

            case "Status":
                return (
                    <div className="flex items-center gap-2">
                        <Chip
                            radius="sm"
                            color={colorStatus(value)}
                            variant="dot"
                            classNames={{
                                base: "h-auto border-none",
                                content:
                                    "font-semibold tracking-wider py-1 items-center gap-2 flex",
                                dot: "w-3 h-3",
                            }}
                        >
                            {value}

                            {value === "Pending" && (
                                <Spinner size="sm" aria-label="Loading..." />
                            )}
                        </Chip>

                        <div className="flex items-center divide-x-2 divide-gray-300">
                            {actionsList?.map(
                                (item, index) =>
                                    !disabledKeys.includes(item?.key) && (
                                        <Button
                                            key={index}
                                            radius="none"
                                            className={`bg-transparent min-w-0 w-max h-max min-h-max data-[hover=true]:text-primary-400 text-primary-500 tracking-wide font-medium`}
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
                    </div>
                )

            case "ExpiredTime":
                // eslint-disable-next-line no-case-declarations
                const isExpired = moment().isAfter(moment(value));

                return (
                    <span className={`text-base ${isExpired ? 'text-danger' : 'text-gray-500/80'}`}>
                        {value}

                        {isExpired && (
                            <i className="text-danger text-base"> Expired</i>
                        )}
                    </span>
                );
            
            default:
                return (
                    <span className="text-base">{value}</span>
                )
        }
    };

    return (
        <Container className="p-4 grid grid-cols-3 gap-3">
            <p className="font-medium col-span-3">Basic Information</p>

            {ecsInfo?.map((it: any, index: number) => (
                <div key={index} className="col-span-1">
                    <p className="text-base tracking-wide font-semibold">{it?.label}</p>

                    {renderValueInfo(it?.key, it?.value)}
                </div>
            ))}
        </Container>
    )
}

export default BasicInformationInstance;