import Container from "@/components/container";
import { INTERNET_BILL_METHODS } from "@/pages/buy-vps-alibaba-ecs/components/constants";
import { useAppSelector } from "@/stores";
import { Snippet } from "@heroui/react";
import { useMemo } from "react";

function ConfigurationInformation() {
    const { instance } = useAppSelector(
        (state) => state.alibabaEcs
    );

    const ecsInfo = useMemo(() => {
        const findInternetBilling = INTERNET_BILL_METHODS.find(
            it => it?.value === instance?.['vps_id']?.InternetChargeType
        );

        return [
            { 
                key: "InstanceType",
                label: "Instance Type", 
                value: instance?.['vps_id']?.InstanceType 
            },
            { 
                key: "vCpus",
                label: "CPU and Memory", 
                value: [
                    instance["vps_id"]?.Cpu, 
                    (instance["vps_id"]?.Memory / 1024).toFixed(1)
                ],
            },
            { 
                key: "PublicIpAddress",
                label: "Public IP Address", 
                value: { 
                    bg: 'success', 
                    result: instance?.['vps_id']?.PublicIpAddress?.IpAddress[0] 
                }
            },
            { 
                key: "NetworkInterfaces",
                label: "Primary Private IP Address", 
                value: { 
                    bg: 'danger', 
                    result: instance?.['vps_id']?.NetworkInterfaces?.NetworkInterface[0]?.PrimaryIpAddress
                }
            },
            { 
                key: "ImageId",
                label: "Image ID", 
                value: instance?.['vps_id']?.Image?.ImageId
            },
            { 
                key: "ImageName",
                label: "Operating System", 
                value: instance?.['vps_id']?.Image?.OSNameEn
            },
            { 
                key: "VpcId",
                label: "VPC", 
                value: { 
                    bg: 'transparent', 
                    result: instance?.['vps_id']?.VpcAttributes?.VpcId
                }
            },
            { 
                key: "VSwitchId",
                label: "vSwitch", 
                value: { 
                    bg: 'transparent', 
                    result: instance?.['vps_id']?.VpcAttributes?.VSwitchId
                }
            },
            { 
                key: "InstanceNetworkType",
                label: "Network Type", 
                value: instance?.['vps_id']?.InstanceNetworkType
            },
            { 
                key: "InternetMaxBandwidthOut",
                label: "Internet Bandwidth", 
                value: instance?.['vps_id']?.InternetMaxBandwidthOut
            },
            { 
                key: "InternetChargeType",
                label: "Billing Method for Network Usage", 
                value: findInternetBilling?.label
            },
        ]
    }, [instance]);

    const renderValueInfo = (key: string, value: any) => {
        switch (key) {
            case "vCpus":
                // eslint-disable-next-line no-case-declarations
                const [vCpus, memory] = value;

                return (
                    <div className="flex items-center gap-1">
                        <b>{vCpus}</b>
                        Cores (vCPUs)
                        <b>{memory}</b>
                        MiB
                    </div>
                );

            case "PublicIpAddress":
            case "NetworkInterfaces":
            case "VpcId":
            case "VSwitchId":
                return (
                    <Snippet
                        size="sm"
                        color={value?.bg === "transparent" ? "default" : value?.bg}
                        variant="flat"
                        hideSymbol={true}
                        classNames={{
                            base: value?.bg === "transparent" ? "bg-transparent" : "",
                            pre: `text-base ${value?.bg === "transparent" ? 'pl-0' : 'pl-2'}`
                        }}
                    >
                        {value?.result}
                    </Snippet>
                );

            case "InstanceNetworkType":
                return (
                    <span className="text-base uppercase">
                        {value}
                    </span>
                );

            case "InternetMaxBandwidthOut":
                return (
                    <span className="text-base">
                        {value} Mbps
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
            <p className="font-medium col-span-3">Configuration Information</p>
            
            {ecsInfo?.map((it: any, index: number) => (
                <div key={index} className="col-span-1">
                    <p className="text-base tracking-wide font-semibold">{it?.label}</p>

                    {renderValueInfo(it?.key, it?.value)}
                </div>
            ))}
        </Container>
    )
}

export default ConfigurationInformation;