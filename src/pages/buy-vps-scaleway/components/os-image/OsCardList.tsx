import { useMemo, useState } from "react";

import OSCardItem from "./OsCardItem";

import { osOptions } from "@/constants";
import { useSelector } from "react-redux";
import { Tab, Tabs } from "@heroui/react";

const OsCardList = () => {
  const { instance } = useSelector((state: any) => state?.scaleway);

  const [imageCategory, _setImageCategory] = useState("os");

  // // Tabs items configuration
  // const items: TabsProps["items"] = [
  // 	{key: "os", label: "OS images"},
  // 	{key: "gpu", label: "GPU Os"},
  // 	{key: "ia", label: "InstantApps"},
  // ];

  // Memoize filtered OS options based on the selected category
  const filteredOsOptions = useMemo(
    () => osOptions.filter((os) => os.menuKey === imageCategory),
    [imageCategory]
  );

  // Handle tab change
  //   const onChange = useCallback((key: string) => {
  //     setImageCategory(key);
  //   }, []);

  return (
    <div>
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab
          key="photos"
          title={<div className="flex items-center space-x-2"></div>}
        />
        <Tab
          key="music"
          title={<div className="flex items-center space-x-2"></div>}
        />
        <Tab
          key="videos"
          title={<div className="flex items-center space-x-2"></div>}
        />
      </Tabs>
      <div className="grid grid-cols-12 gap-4">
        {filteredOsOptions.map((os) => (
          <div className="col-span-3" key={os.name}>
            <OSCardItem
              menuKey={os.menuKey}
              name={os.name}
              logoUrl={os.logoUrl}
              versionOptions={os.versions}
              version={os.version}
              selected={instance?.selectedOS?.name === os.name}
              disabled={os.disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OsCardList;
