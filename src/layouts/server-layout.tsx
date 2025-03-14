import Container from "@/components/container";
import LazyLoadingLayout from "@/components/lazy-loading-layout";
import paths from "@/routes/paths";
import { Tab, Tabs } from "@heroui/react";
import { Suspense, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface TabServerManagement {
  key: string;
  label: string;
  href: string;
}

function VpsManagementLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs: Array<TabServerManagement> = [
    {
      key: "server-vietstack",
      label: "Server Cloud 01",
      href: paths.server_vietstack,
    },
    {
      key: "server-vng",
      label: "Server Cloud 02",
      href: paths.server_vng,
    },
    {
      key: "server-vietserver",
      label: "Server Cloud 03",
      href: paths.server_vietserver,
    },
  ];

  const handleChangeTab = (tab: any) => {
    navigate(tab);
  };

  const currentTab = useMemo(() => {
    const findOne = tabs?.find((tab: TabServerManagement) =>
      pathname.includes(tab?.href)
    ) as TabServerManagement;

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
              tabList: "gap-6 w-full relative rounded-none p-0 tabs__vps overflow-x-auto pb-0 max-xl:pb-4 scroll-main-x scrollbar-default",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-2 h-10",
              tabContent:
                "group-data-[selected=true]:text-white group-data-[selected=true]:font-bold uppercase font-medium text-sm",
            }}
            selectedKey={currentTab?.href || ""}
            onSelectionChange={handleChangeTab}
          >
            {tabs?.map((item: TabServerManagement) => (
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
