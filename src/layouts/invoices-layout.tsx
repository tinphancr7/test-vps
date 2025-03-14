import Container from "@/components/container";
import LazyLoadingLayout from "@/components/lazy-loading-layout";
import paths from "@/routes/paths";
import { Tab, Tabs } from "@heroui/react";
import { Suspense, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface TabVps {
  key: string;
  label: string;
  href: string;
}

function InvoicesLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs: Array<TabVps> = [
    {
      key: "invoices-vietstack",
      label: "Hóa đơn Cloud 01",
      href: paths.invoices_vietstack,
    },
    {
      key: "invoices-vng",
      label: "Hóa đơn Cloud 02",
      href: paths.invoices_vng,
    },

    {
      key: "invoices-bucloud",
      label: "Hóa đơn Cloud 05",
      href: paths.invoices_bu_cloud,
    },
    {
      key: "invoices-digital-ocean",
      label: "Hóa đơn Digital Ocean",
      href: paths.invoices_digital_ocean,
    },
    {
      key: "invoices-server-vietserver",
      label: "Hóa đơn Server - Cloud 03",
      href: paths.invoices_server_vietserver,
    },
  ];

  const handleChangeTab = (tab: any) => {
    navigate(tab);
  };

  const currentTab = useMemo(() => {
    const findOne = tabs?.find((tab: TabVps) =>
      pathname.includes(tab?.href)
    ) as TabVps;

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

export default InvoicesLayout;
