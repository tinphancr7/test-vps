import Container from "@/components/container";
import LazyLoadingLayout from "@/components/lazy-loading-layout";
import paths from "@/routes/paths";
import { useAppDispatch } from "@/stores";
import { Tab, Tabs } from "@heroui/react";
import { Suspense, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface TabVpsManagement {
  key: string;
  label: string;
  href: string;
}

function VpsManagementLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs: Array<TabVpsManagement> = [
    {
      key: "management-vps-vietstack",
      label: "VPS CLOUD 01",
      href: paths.vps_management_vietstack,
    },
    {
      key: "management-vps-vng",
      label: "VPS CLOUD 02",
      href: paths.vps_management_vng,
    },
    {
      key: "management-vps-vietstack",
      label: "VPS CLOUD 03",
      href: paths.vps_management_vietserver,
    },
    {
      key: "management-vps-bu-cloud",
      label: "VPS CLOUD 05",
      href: paths.vps_manage_bu_cloud,
    },
    {
      key: "management-vps-digital-ocean",
      label: "VPS Digital Ocean",
      href: paths.vps_management_digitalOcean,
    },
    {
      key: "management-load-balancer-digital-ocean",
      label: "Load Balancer Digital Ocean",
      href: paths.load_balancer_management_digitalOcean,
    },
    {
      key: "management-vps-alibaba-ecs",
      label: "VPS Alibaba ECS",
      href: paths.vps_management_alibaba_ecs,
    },
    {
      key: "management-orther-vps",
      label: "VPS Khác",
      href: paths.vps_management_orther,
    },
    {
      key: "vps-management-general",
      label: "VPS Tổng Quan",
      href: paths.vps_management_general,
    },
  ];

  const handleChangeTab = (tab: any) => {
    navigate(tab);

    dispatch({ type: "resetState" });
  };

  const currentTab = useMemo(() => {
    const findOne = tabs?.find((tab: TabVpsManagement) =>
      pathname.includes(tab?.href)
    ) as TabVpsManagement;

    return findOne;
  }, [pathname]);

  return (
    <Suspense fallback={<LazyLoadingLayout />}>
      <div className="flex flex-col gap-3 mt-3 h-full">
        <Container>
          <Tabs
            aria-label="Options"
            color="primary"
            variant="light"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 tabs__vps overflow-x-hidden  pb-0 max-xl:pb-4 scroll-main-x scrollbar-default",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-2 h-10",
              tabContent:
                "group-data-[selected=true]:text-white group-data-[selected=true]:font-bold uppercase font-medium text-sm",
            }}
            selectedKey={currentTab?.href || ""}
            onSelectionChange={handleChangeTab}
          >
            {tabs?.map((item: TabVpsManagement) => (
              <Tab
                key={item?.href}
                title={
                  <div className="flex items-center space-x-2">
                    <span>{item?.label}</span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </Container>

        <Outlet />
      </div>
    </Suspense>
  );
}

export default VpsManagementLayout;
