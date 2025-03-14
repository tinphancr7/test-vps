import { useAppDispatch, useAppSelector } from "@/stores";
import {
  asyncThunkGetImagesAlibabaEcs,
  asyncThunkGetInstanceTypesAlibabaEcs,
  asyncThunkGetZonesByRegionIdAlibabaEcs,
} from "@/stores/async-thunks/alibaba-ecs-thunk";
import {
  setInstanceType,
  setPageNumber,
  setRegion,
  setZone,
} from "@/stores/slices/alibaba-ecs.slice";
import { Button, Tab, Tabs, Tooltip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { regionTabs } from "./constants";

function RegionSelect() {
  const dispatch = useAppDispatch();
  const { region, regionsList, isLoading } = useAppSelector(
    (state) => state.alibabaEcs
  );
  const [tab, setTab] = useState<any>("asia-pacific-others");

  useEffect(() => {
    dispatch(asyncThunkGetZonesByRegionIdAlibabaEcs(region));
  }, []);

  const regionClassNames = (value: string) => {
    const items: string[] = [
      "bg-transparent cursor-pointer text-base tracking-wide min-w-[150px] p-2 border rounded-sm",
    ];
    const activeRegion =
      region === value
        ? "border-primary font-medium"
        : "border-gray-300/80 font-normal";

    items.push(activeRegion);

    return items.join(" ");
  };

  const handleChangeRegion = async (value: string) => {
    dispatch(setRegion(value));

    if (!isLoading?.regionList) {
      const { zones } = await dispatch(
        asyncThunkGetZonesByRegionIdAlibabaEcs(value)
      ).unwrap();

      if (zones) {
        dispatch(setZone(zones[0]?.ZoneId));

        const { instanceTypes } = await dispatch(
          asyncThunkGetInstanceTypesAlibabaEcs({
            RegionId: value,
            ZoneId: zones[0]?.ZoneId,
            PageNumber: 1,
          })
        ).unwrap();

        dispatch(
          asyncThunkGetImagesAlibabaEcs({
            RegionId: value,
            InstanceType: instanceTypes[0]?.InstanceTypeId,
          })
        );

        dispatch(setInstanceType(instanceTypes[0]?.InstanceTypeId));
        dispatch(setPageNumber(1));
      }
    }
  };

  const renderTooltip = (
    <p>
      Khu vực là vị trí địa lý nơi triển khai các phiên bản ECS.
      Khu vực được chia theo thành phố nơi đặt trung tâm dữ liệu.
    </p>
  );

  const customRegionList = useMemo(() => {
    const findRegionIds = regionTabs?.find((it) => it?.key === tab);

    return regionsList?.filter((rg: any) =>
      findRegionIds?.regionList?.includes(rg?.RegionId)
    );
  }, [regionsList, tab]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const items: TabsProps["items"] = [
  // 	{
  // 		key: "1",
  // 		label: "Tab 1",
  // 		children: "Content of Tab Pane 1",
  // 	},
  // 	{
  // 		key: "2",
  // 		label: "Tab 2",
  // 		children: "Content of Tab Pane 2",
  // 	},
  // 	{
  // 		key: "3",
  // 		label: "Tab 3",
  // 		children: "Content of Tab Pane 3",
  // 	},
  // ];

  return (
    <div className="grid grid-cols-7 gap-2">
      <div className="flex items-center gap-1">
        <h3 className="text-base tracking-wide font-medium">Chọn khu vực</h3>

        <Tooltip
          radius="sm"
          content={renderTooltip}
          classNames={{
            content: "max-w-80 overflow-auto scroll-main p-2",
          }}
        >
          <span className="text-gray-500">
            <RxQuestionMarkCircled />
          </span>
        </Tooltip>
      </div>

      <div className="col-span-6">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "w-full relative rounded-none p-0",
            panel: "grid grid-cols-4 gap-2",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-2 h-10",
            tabContent:
              "group-data-[selected=true]:font-bold uppercase font-medium text-sm",
          }}
          selectedKey={tab || ""}
          onSelectionChange={setTab}
        >
          {regionTabs?.map((item: any) => (
            <Tab
              key={item?.key}
              title={
                <div className="flex items-center">
                  <span className="tracking-wider font-semibold">
                    {item?.label}
                  </span>
                </div>
              }
            >
              {customRegionList?.map((rg: any) => (
                <Button
                  key={rg?.RegionId}
                  className={regionClassNames(rg?.RegionId)}
                  onPress={() => handleChangeRegion(rg?.RegionId)}
                >
                  {rg?.LocalName}
                </Button>
              ))}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default RegionSelect;
