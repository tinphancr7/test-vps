import Container from "@/components/container";
import LazyLoadingLayout from "@/components/lazy-loading-layout";
import { ProviderIDEnum } from "@/constants/enum";
import paths from "@/routes/paths";
import { useAppDispatch } from "@/stores";
import { setTopFilter } from "@/stores/slices/wallet.slice";
import { Tab, Tabs } from "@heroui/react";
import { Suspense, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface TabVps {
  key: string;
  label: string;
  href: string;
}

function VpsLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs: Array<TabVps> = [
    {
      key: "vps-vietstack",
      label: "VPS CLOUD 01",
      href: paths.vps_vietstack,
    },
    {
      key: "vps-vng",
      label: "VPS CLOUD 02",
      href: paths.vps_vng,
    },
    {
      key: "vps-vietserver",
      label: "VPS CLOUD 03",
      href: paths.vps_vietserver,
    },
    {
      key: "bu-cloud",
      label: "VPS CLOUD 05",
      href: paths.bu_cloud,
    },
    {
      key: "vps-digital-ocean",
      label: "VPS Digital Ocean",
      href: paths.vps_digitalOcean,
    },
    {
      key: "load-balancer-digital-ocean",
      label: "Load Balancer Digital Ocean",
      href: paths.load_balancer_digitalOcean,
    },

    {
      key: "alibaba-ecs",
      label: "Alibaba Elastic Compute Service",
      href: paths.vps_alibaba_ecs,
    },
  ];

  const handleChangeTab = (tab: any) => {
    navigate(tab);
  };
  const dispatch = useAppDispatch();
  const currentTab = useMemo(() => {
    const findOne = tabs?.find((tab: TabVps) =>
      pathname.includes(tab?.href)
    ) as TabVps;
    return findOne;
  }, [pathname]);
  useEffect(() => {
    dispatch(
      setTopFilter({
        provider:
          pathname === paths.vps_vietstack
            ? ProviderIDEnum.VIET_STACK
            : pathname === paths.vps_vietserver
            ? ProviderIDEnum.VietServer
            : pathname === paths.vps_vng
            ? ProviderIDEnum.VNG
            : pathname === paths.vps_digitalOcean
            ? ProviderIDEnum.DIGITAL_OCEAN
            : pathname === paths.vps_alibaba_ecs
            ? ProviderIDEnum.Alibaba
            : pathname === paths.bu_cloud
            ? ProviderIDEnum.BuCloud
            : pathname === paths.load_balancer_digitalOcean
            ? ProviderIDEnum.DIGITAL_OCEAN
            : "",
      })
    );
    return () => {
      dispatch(
        setTopFilter({
          provider: "",
        })
      );
    };
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
              tabList: "gap-6 w-full relative rounded-none p-0 tabs__vps",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-2 h-10",
              tabContent:
                "group-data-[selected=true]:text-white group-data-[selected=true]:font-bold uppercase font-medium text-sm",
            }}
            selectedKey={currentTab?.href || ""}
            onSelectionChange={handleChangeTab}
          >
            {tabs?.map((item: TabVps) => (
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

export default VpsLayout;
