import { LuInfo } from "react-icons/lu";
import { BiWallet } from "react-icons/bi";
import { IconType } from "react-icons";
import Container from "@/components/container";
import { CircularProgress, Tab, Tabs } from "@heroui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lazy, useMemo } from "react";
import paths from "@/routes/paths";
import { useAppSelector } from "@/stores";
const Overview = lazy(() => import("../overview"));
const Payment = lazy(() => import("../payment"));

interface TabVps {
  key: string;
  label: string;
  href: string;
  icon: IconType;
  element: React.ElementType;
}

function TabsDetail({ isOpen, onOpenChange }: any) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { isLoading } = useAppSelector((state) => state.detailVpsOrther);

  const tabs: Array<TabVps> = useMemo(() => {
    const urlDetail = paths.vps_management_orther;

    return [
      {
        key: "overview",
        label: "Thông tin tổng quan",
        href: `${urlDetail}/${id}/overview`,
        icon: LuInfo,
        element: Overview,
      },
      {
        key: "payment",
        label: "Thanh toán",
        href: `${urlDetail}/${id}/payment`,
        icon: BiWallet,
        element: Payment,
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

    return findOne?.element as React.ElementType;
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
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <CircularProgress color="primary" size="lg" />
          </div>
        ) : (
          <Component isOpen={isOpen} onOpenChange={onOpenChange} />
        )}
      </Container>
    </div>
  );
}

export default TabsDetail;
