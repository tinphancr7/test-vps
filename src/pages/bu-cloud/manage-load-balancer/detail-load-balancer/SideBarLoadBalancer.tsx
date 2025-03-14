import React, { lazy, useMemo } from "react";
import { Tab, Tabs } from "@heroui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import paths from "@/routes/paths";
import Container from "@/components/container";
import { LuInfo } from "react-icons/lu";
import { MdDeleteSweep } from "react-icons/md";
// import { BiScatterChart } from "react-icons/bi";
import { setDataSettingLoadBalancer } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting.slice";
import { useAppDispatch } from "@/stores";
const OverviewDigitalOcean = lazy(
    () => import("./overview/OverviewDigitalOcean")
);
const ListVPSInLoadBalancer = lazy(
    () => import("./listvps/ListVPSInLoadBalancer")
);

// const GraphsLoadBalancer = lazy(() => import("./graphs/GraphsLoadBalancer"));
const DestroyLoadBalancer = lazy(() => import("./destroy/DestroyLoadBalancer"));

// Interface for tabs
interface TabVps {
    key: string;
    label: string;
    href: string;
    icon: React.ElementType;
    element: React.ElementType;
}

function SideBarLoadBalancer({ info, setRender }: any) {
    // Accept info as a prop
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { id } = useParams();

    const tabs: Array<TabVps> = useMemo(() => {
        const urlDetail = paths.load_balancer_management_digitalOcean_bu_cloud;
        return [
            {
                key: "overview",
                label: "Thông tin tổng quan",
                href: `${urlDetail}/${id}/overview`,
                icon: LuInfo,
                element: OverviewDigitalOcean,
            },
            {
                key: "listvps",
                label: "Thông tin các VPS",
                href: `${urlDetail}/${id}/listvps`,
                icon: LuInfo,
                element: ListVPSInLoadBalancer,
            },
            // {
            //     key: "graphs",
            //     label: "Đồ thị",
            //     href: `${urlDetail}/${id}/graphs`,
            //     icon: BiScatterChart,
            //     element: GraphsLoadBalancer,
            // },
            // {
            //     key: "edit-setting",
            //     label: "Cài đặt",
            //     href: `${urlDetail}/${id}/edit-setting`,
            //     icon: IoSettingsOutline,
            //     element: EditSettingLoadBalancer,
            // },
            {
                key: "destroy",
                label: "Hủy",
                href: `${urlDetail}/${id}/destroy`,
                icon: MdDeleteSweep,
                element: DestroyLoadBalancer,
            },
        ];
    }, [id, pathname]);
    const dispatch = useAppDispatch();

    const handleChangeTab = (key: any) => {
        const findOne = tabs?.find((tab: TabVps) => tab.key === key);
        dispatch(
            setDataSettingLoadBalancer({
                result: {},
            })
        );
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
                    disabledKeys={
                        info?.status === "terminated" ? ["graphs"] : []
                    }
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
                {Component &&
                    React.createElement(Component, { info, setRender })}
            </Container>
        </div>
    );
}

export default SideBarLoadBalancer;
