import { Card, Tab, Tabs } from "@heroui/react";
import React, { ReactElement, useMemo, useState } from "react";
import { FaDigitalOcean } from "react-icons/fa6";
import TableBuCloud from "./service-bucloud/TableBuCloud";
import ServiceDigitalOceanBuCloud from "./service-digitalocean/ServiceDigitalOceanBuCloud";
import Container from "@/components/container";
import { FaAws } from "react-icons/fa";
import BuyAwsLightsail from "@/pages/buy-aws-lightsail";
import BuyVpsUpCloud from "@/pages/buy-vps-upcloud";
import { SiScaleway, SiUpcloud } from "react-icons/si";
import BuyVpsScaleway from "@/pages/buy-vps-scaleway";
import TableBuCloudSG from "./service-bucloud/TableBuCloudSG";
import BuCloudIcon from "./BuCloudIcon";
import { useLocation } from "react-router-dom";
import BuyVpsAlibabaEcs from "@/pages/buy-vps-alibaba-ecs";
import { SiAlibabacloud } from "react-icons/si";
import CreateLoadBalancerDigitalOceanBuCloud from "../create-load-balancer/CreateLoadBalancerDigitalOcean";
// import BuyVpsAlibabaEcs from "@/pages/buy-vps-alibaba-ecs";
// import { SiAlibabacloud } from "react-icons/si";

function BuCloud() {
  const PROVIDERS: {
    key: string;
    text: string;
    icon: ReactElement;
    comp: React.ReactNode;
  }[] = [
    {
      key: "bu-cloud",
      text: "VN",
      icon: <BuCloudIcon />,
      comp: <TableBuCloud />,
    },
    {
      key: "bu-cloud-sg",
      text: "SG",
      icon: <BuCloudIcon />,
      comp: <TableBuCloudSG />,
    },
    {
      key: "digital-ocean",
      text: "Digital Ocean",
      icon: <FaDigitalOcean className="size-5 min-w-5" />,
      comp: <ServiceDigitalOceanBuCloud />,
    },
    {
      key: "digital-ocean-load-balancer",
      text: "DO Load Balancer",
      icon: <FaDigitalOcean className="size-5 min-w-5" />,
      comp: <CreateLoadBalancerDigitalOceanBuCloud />,
    },
    {
      key: "amazon-lightsail",
      text: "Amazon Lightsail",
      icon: <FaAws className="size-5 min-w-5" />,
      comp: <BuyAwsLightsail />,
    },
    {
      key: "alibaba-ecs",
      text: "Alibaba ECS",
      icon: <SiAlibabacloud className="size-5 min-w-5" />,
      comp: <BuyVpsAlibabaEcs />,
    },
    {
      key: "upcloud",
      text: "UpCloud",
      icon: <SiUpcloud className="size-5 min-w-5" />,
      comp: <BuyVpsUpCloud />,
    },
    {
      key: "scaleway",
      text: "Scaleway",
      icon: <SiScaleway className="size-5 min-w-5" />,
      comp: <BuyVpsScaleway />,
    },
  ];
  const location = useLocation();
  const keyTab = location?.state; // Lấy giá trị từ `state`
  const [tab, setTab] = useState<any>(keyTab || "bu-cloud");

  const renderContentTab = useMemo(() => {
    const provd = PROVIDERS?.find((it) => it?.key === tab);

    return provd?.comp;
  }, [tab]);

  return (
    <>
      <Container>
        <Tabs
          className="flex flex-col gap-10 "
          color="primary"
          variant="underlined"
          selectedKey={tab}
          onSelectionChange={setTab}
					classNames={{
						tabList: "overflow-x-auto pb-4 scroll-main-x scrollbar-default w-max gap-10",
            cursor: "w-full",
					}}
        >
          {PROVIDERS.map((item: any) => {
            return (
              <Tab
                key={item.key}
                title={
                  <div className="flex gap-2 font-bold">
                    <div className="my-auto">{item.icon}</div>
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
export default BuCloud;
