import { Card, Tab, Tabs } from "@heroui/react";
import { ReactElement, useMemo, useState } from "react";
import { FaAws, FaDigitalOcean } from "react-icons/fa6";
import Container from "@/components/container";
import { useLocation } from "react-router-dom";
import VpsBuCloud from "./service-bucloud";
import ManagementVPSBuCloudDigitalOcean from "./service-digitalocean/ManagementVPSBuCloudDigitalOcean";
import VpsAwsLightsail from "@/pages/vps-aws-lightsail";
import VpsUpCloud from "./service-upcloud";

import { SiAlibabacloud, SiUpcloud } from "react-icons/si";
import ManagementScaleWay from "./service-scaleway";
import VpsBuCloudAlibabaEcs from "@/pages/vps-bucloud-alibaba-ecs";
import ManagementLoadBalancerDigitalOceanBuCloud from "../manage-load-balancer/ManagementLoadBalancerDigitalOcean";

function ManageBuCloud() {
    const location = useLocation();
    const keyTabL = location?.state?.keyTab || "bu-cloud";
    const [keyTab, setKeyTab] = useState(keyTabL);

    const PROVIDERS: {
        key: string;
        text: string;
        icon: ReactElement;
        comp: React.ReactNode;
    }[] = [
        {
            key: "bu-cloud",
            text: "VPS Cloud 05",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 426.4 380.89"
                    className="size-5 min-w-5"
                >
                    <defs>
                        <style
                            dangerouslySetInnerHTML={{
                                __html: ".cls-1{fill:#71717A;}",
                            }}
                        />
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                            <path
                                className="cls-1"
                                d="M393.71,249.57a71.36,71.36,0,0,0-.26-120.08c-.42-.28-.86-.55-1.27-.8a70.4,70.4,0,0,0-15.88-7.2,1.19,1.19,0,0,1-.23-.07l-.12,0-.13,0c-.69-.2-1.37-.4-2.07-.58,0,0,0,0,0,0-6.8-1.72-18-2.31-20.67-2.43H328.59A118.28,118.28,0,1,0,95.52,146.89C41.38,155.79,0,204.45,0,263.16c0,59.75,42.84,109.1,98.4,116.7a109,109,0,0,0,15,1H355a71.35,71.35,0,0,0,38.68-131.32ZM224.64,197H344.47a25.54,25.54,0,1,1,0,51.07H224.21v6.86H344.47a25.54,25.54,0,1,1,0,51.07H224.21v6.85H344.47a25.54,25.54,0,0,1,0,51.08H224.21v.06H118.12c-1.56.08-3.15.11-4.74.11s-3.15,0-4.73-.11c-51.45-2.57-92.43-46.71-92.43-100.77,0-51.29,36.88-93.65,84.61-100a92.93,92.93,0,0,1,12.55-.84c1.72,0,3.41,0,5.1.14a98.5,98.5,0,0,1-6.37-17,101.88,101.88,0,1,1,200.07-27.17h-88v20.81H344.47a25.54,25.54,0,1,1,0,51.08H224.21V197Z"
                            />
                            <path
                                className="cls-1"
                                d="M290.16,173a6.35,6.35,0,0,1-1.37-.32A7.06,7.06,0,0,1,292,159a6.45,6.45,0,0,1,1.75.46,7.16,7.16,0,0,1,4.36,5.63A7.08,7.08,0,0,1,290.16,173Z"
                            />
                            <path
                                className="cls-1"
                                d="M327.69,173a6.84,6.84,0,0,1-1.37-.32,7,7,0,0,1-2.29-1.3h0a7.05,7.05,0,0,1,2.36-12.09,7.18,7.18,0,0,1,3.12-.29,6.55,6.55,0,0,1,1.75.46A7.06,7.06,0,0,1,327.69,173Z"
                            />
                            <path
                                className="cls-1"
                                d="M346.45,173a6.35,6.35,0,0,1-1.37-.32A7.06,7.06,0,0,1,348.27,159a6.55,6.55,0,0,1,1.75.46A7.06,7.06,0,0,1,346.45,173Z"
                            />
                            <path
                                className="cls-1"
                                d="M278.24,162.47v7c0,2.81-2,5.1-4.49,5.1H226.19a3.79,3.79,0,0,1-3.52-4v-9.17a3.79,3.79,0,0,1,3.52-4h47.56C276.23,157.37,278.24,159.66,278.24,162.47Z"
                            />
                            <path
                                className="cls-1"
                                d="M309.26,173l-.34,0a6.74,6.74,0,0,1-1.36-.32A7.06,7.06,0,0,1,310.74,159a6.55,6.55,0,0,1,1.75.46h0A7.07,7.07,0,0,1,309.26,173Z"
                            />
                            <path
                                className="cls-1"
                                d="M290.16,229.44a7,7,0,0,1-1.37-.33A7.06,7.06,0,0,1,292,215.42a6.84,6.84,0,0,1,1.75.46,7.16,7.16,0,0,1,4.36,5.63A7.09,7.09,0,0,1,290.16,229.44Z"
                            />
                            <path
                                className="cls-1"
                                d="M327.69,229.43a6.22,6.22,0,0,1-1.37-.32,7,7,0,0,1-2.29-1.3h0a7,7,0,0,1-2.44-4.46,7.08,7.08,0,0,1,4.8-7.63,7.18,7.18,0,0,1,3.12-.29,6.55,6.55,0,0,1,1.75.46,7.06,7.06,0,0,1-3.57,13.55Z"
                            />
                            <path
                                className="cls-1"
                                d="M346.45,229.44a7,7,0,0,1-1.37-.33,7.06,7.06,0,0,1,3.19-13.69,7,7,0,0,1,1.75.46,7.07,7.07,0,0,1-3.57,13.56Z"
                            />
                            <path
                                className="cls-1"
                                d="M278.24,218.94v7c0,2.81-2,5.1-4.49,5.1H226.19a3.79,3.79,0,0,1-3.52-4v-9.16a3.79,3.79,0,0,1,3.52-4h47.56C276.23,213.84,278.24,216.13,278.24,218.94Z"
                            />
                            <path
                                className="cls-1"
                                d="M309.26,229.47l-.34,0a6.13,6.13,0,0,1-1.36-.32,7.06,7.06,0,0,1,3.18-13.69,6.55,6.55,0,0,1,1.75.46h0a7.07,7.07,0,0,1-3.24,13.59Z"
                            />
                            <path
                                className="cls-1"
                                d="M290.16,287a7,7,0,0,1-1.37-.32,7.07,7.07,0,0,1,3.19-13.7,6.85,6.85,0,0,1,1.75.47A7.06,7.06,0,0,1,290.16,287Z"
                            />
                            <path
                                className="cls-1"
                                d="M327.69,287a6.23,6.23,0,0,1-1.37-.33,7,7,0,0,1-2.29-1.3h0a7,7,0,0,1-2.44-4.45,7.06,7.06,0,0,1,7.92-7.92,6.55,6.55,0,0,1,1.75.46A7.06,7.06,0,0,1,327.69,287Z"
                            />
                            <path
                                className="cls-1"
                                d="M346.45,287a7,7,0,0,1-1.37-.32,7.07,7.07,0,0,1,3.19-13.7,7,7,0,0,1,1.75.47A7.06,7.06,0,0,1,346.45,287Z"
                            />
                            <path
                                className="cls-1"
                                d="M278.24,276.46v7c0,2.81-2,5.1-4.49,5.1H226.19a3.79,3.79,0,0,1-3.52-4v-9.16a3.79,3.79,0,0,1,3.52-4h47.56C276.23,271.36,278.24,273.65,278.24,276.46Z"
                            />
                            <path
                                className="cls-1"
                                d="M309.26,287l-.34,0a6.14,6.14,0,0,1-1.36-.33,7.06,7.06,0,0,1,3.18-13.68,6.55,6.55,0,0,1,1.75.46h0A7.06,7.06,0,0,1,309.26,287Z"
                            />
                            <path
                                className="cls-1"
                                d="M290.16,345.54a7,7,0,0,1-1.37-.32,7.07,7.07,0,0,1,3.19-13.7,6.85,6.85,0,0,1,1.75.47,7.06,7.06,0,0,1-3.57,13.55Z"
                            />
                            <path
                                className="cls-1"
                                d="M327.69,345.54a6.85,6.85,0,0,1-1.37-.33,7,7,0,0,1-2.29-1.3h0a7,7,0,0,1-2.44-4.45,7.06,7.06,0,0,1,7.92-7.92,6.55,6.55,0,0,1,1.75.46,7.06,7.06,0,0,1-3.57,13.55Z"
                            />
                            <path
                                className="cls-1"
                                d="M346.45,345.54a7,7,0,0,1-1.37-.32,7.07,7.07,0,0,1,3.19-13.7A7,7,0,0,1,350,332a7.06,7.06,0,0,1-3.57,13.55Z"
                            />
                            <path
                                className="cls-1"
                                d="M278.24,335.05v7c0,2.81-2,5.1-4.49,5.1H226.19a3.79,3.79,0,0,1-3.52-4V334a3.79,3.79,0,0,1,3.52-4h47.56C276.23,330,278.24,332.24,278.24,335.05Z"
                            />
                            <path
                                className="cls-1"
                                d="M309.26,345.57l-.34,0a6.76,6.76,0,0,1-1.36-.33,7.06,7.06,0,0,1,3.18-13.68,6.55,6.55,0,0,1,1.75.46h0a7.06,7.06,0,0,1-3.24,13.58Z"
                            />
                        </g>
                    </g>
                </svg>
            ),
            comp: <VpsBuCloud />,
        },
        {
            key: "digital-ocean",
            text: "Digital Ocean",
            icon: <FaDigitalOcean className="size-5 min-w-5" />,
            comp: <ManagementVPSBuCloudDigitalOcean />,
        },
        {
            key: "digital-ocean-load-balancer",
            text: "DO Load Balancer",
            icon: <FaDigitalOcean className="size-5 min-w-5" />,
            comp: <ManagementLoadBalancerDigitalOceanBuCloud />,
        },
        {
            key: "amazon-lightsail",
            text: "Amazon Lightsail",
            icon: <FaAws className="size-5 min-w-5" />,
            comp: <VpsAwsLightsail />,
        },
        {
            key: "alibaba-ecs",
            text: "Alibaba ECS",
            icon: <SiAlibabacloud className="size-5 min-w-5" />,
            comp: <VpsBuCloudAlibabaEcs />,
        },
        {
            key: "upcloud",
            text: "UpCloud",
            icon: <SiUpcloud className="size-5 min-w-5" />,
            comp: <VpsUpCloud />,
        },
        {
            key: "scaleway",
            text: "Scaleway",
            icon: <FaAws className="size-5 min-w-5" />,
            comp: <ManagementScaleWay />,
        },
    ];

    const renderContentTab = useMemo(() => {
        const provd = PROVIDERS?.find((it) => it?.key === keyTab);

        return provd?.comp;
    }, [keyTab]);

    return (
        <>
            <Container>
                <Tabs
                    className="flex flex-col gap-10 w-full"
                    color="primary"
                    variant="underlined"
                    selectedKey={keyTab}
                    onSelectionChange={setKeyTab}
                >
                    {PROVIDERS.map((item: any) => {
                        return (
                            <Tab
                                key={item.key}
                                title={
                                    <div className="flex gap-2 font-bold">
                                        <div className="my-auto">
                                            {item.icon}
                                        </div>
                                        <span>{item.text}</span>
                                    </div>
                                }
                            />
                        );
                    })}
                </Tabs>
            </Container>
            <Card className="h-full overflow-y-auto scroll-main rounded-md">
                {renderContentTab}
            </Card>
        </>
    );
}
export default ManageBuCloud;
