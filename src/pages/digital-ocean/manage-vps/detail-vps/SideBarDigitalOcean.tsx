import React, { lazy, useMemo } from "react";
import { Tab, Tabs } from "@heroui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import paths from "@/routes/paths";
import Container from "@/components/container";
import { LuChartColumnIncreasing, LuInfo } from "react-icons/lu";
import { TbTerminal2 } from "react-icons/tb";
import { PiPowerFill } from "react-icons/pi";
import { TbNetwork } from "react-icons/tb";
import { MdDeleteSweep } from "react-icons/md";
// Lazy-loaded components
const Graphs = lazy(() => import("./graphs/GraphsVPSDigitalOcean"));
const HistoryActionVPS = lazy(() => import("./history/HistoryActionVPS"));
const PowerDigitalOcean = lazy(() => import("./power/PowerDigitalOcean"));
const NetworkDigitalOcean = lazy(() => import("./network/NetworkDigitalOcean"));
const DestroyVPSDigitalOcean = lazy(
  () => import("./destroy/DestroyVPSDigitalOcean")
);
const OverviewDigitalOcean = lazy(
  () => import("./overview/OverviewDigitalOcean")
);

// Interface for tabs
interface TabVps {
  key: string;
  label: string;
  href: string;
  icon: React.ElementType;
  element: React.ElementType;
}

function SideBarDigitalOcean({ info, setRender }: any) {
  // Accept info as a prop
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();

  const tabs: Array<TabVps> = useMemo(() => {
    const urlDetail = paths.vps_management_digitalOcean;

    return [
      {
        key: "overview",
        label: "Thông tin tổng quan",
        href: `${urlDetail}/${id}/overview`,
        icon: LuInfo,
        element: OverviewDigitalOcean,
      },
      {
        key: "power",
        label: "Nguồn",
        href: `${urlDetail}/${id}/power`,
        icon: PiPowerFill,
        element: PowerDigitalOcean,
      },
      {
        key: "network",
        label: "Network",
        href: `${urlDetail}/${id}/network`,
        icon: TbNetwork,
        element: NetworkDigitalOcean,
      },
      {
        key: "destroy",
        label: "Hủy VPS",
        href: `${urlDetail}/${id}/destroy`,
        icon: MdDeleteSweep,
        element: DestroyVPSDigitalOcean,
      },
      {
        key: "history",
        label: "Lịch sử",
        href: `${urlDetail}/${id}/history`,
        icon: TbTerminal2,
        element: HistoryActionVPS,
      },
      {
        key: "graphs",
        label: "Đồ thị",
        href: `${urlDetail}/${id}/graphs`,
        icon: LuChartColumnIncreasing,
        element: Graphs,
      },
    ];
  }, [id, pathname]);

  const handleChangeTab = (key: any) => {
    const findOne = tabs?.find((tab: TabVps) => tab.key === key);
    navigate(findOne?.href as string);
  };

  const currentTab = useMemo(() => {
    const toArrayPath = pathname.split("/");
    const findOne = tabs?.find(
      (tab) => tab.key === toArrayPath[toArrayPath?.length - 1]
    );
    return findOne?.key;
  }, [pathname, tabs]);

  const Component = useMemo(() => {
    const toArrayPath = pathname.split("/");
    const findOne = tabs?.find(
      (tab) => tab.key === toArrayPath[toArrayPath?.length - 1]
    );
    return findOne?.element;
  }, [pathname, tabs]);

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <Container className="col-span-2 h-max">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="light"
          classNames={{
            base: "w-full",
            tabList: "gap-2 w-full relative rounded-none p-0",
            cursor: "w-full bg-primary",
            tab: "px-2 h-10 justify-start w-full",
            tabContent:
              "group-data-[selected=true]:text-white group-data-[selected=true]:font-bold uppercase font-medium text-sm",
          }}
          isVertical={true}
          selectedKey={currentTab || ""}
          onSelectionChange={handleChangeTab}
          disabledKeys={info?.status === "terminated" ? ["graphs"] : []}
        >
          {tabs?.map((item: TabVps) => {
            const Icon = item?.icon;
            return (
              <Tab
                key={item?.key}
                title={
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{item?.label}</span>
                  </div>
                }
              />
            );
          })}
        </Tabs>
      </Container>

      <Container className="col-span-10 h-full">
        {Component && React.createElement(Component, { info, setRender })}
      </Container>
    </div>
  );
}

export default SideBarDigitalOcean;
