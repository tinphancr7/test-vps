import { useState } from "react";
import SecurityGroups from "./security-groups";
import BlockStorage from "./block-storage";
import { Tab, Tabs } from "@heroui/react";
import Overview from "./overview";

function TabsList() {
    const [tab, setTab] = useState<any>("overview");
    
    const tabs = [
        {
            id: "overview",
            name: "Instance Details",
        },
        {
            id: "security-groups",
            name: "Security Groups",
        },
        {
            id: "block-storage",
            name: "Block Storage",
        },
    ];

    const render: { [key: string]: React.ReactNode } = {
        overview: <Overview />,
        'security-groups': <SecurityGroups />,
        'block-storage': <BlockStorage />,
    };

    return (
        <>
            <div className="flex w-full border-b">
                <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    classNames={{
                        base: "mt-4",
                        tabList:
                            "w-full relative rounded-none p-0 gap-0 border-t border-l border-r divide-x divide-gray-200",
                        panel: "grid grid-cols-4",
                        cursor: "w-full bg-primary",
                        tab: "max-w-fit px-6 h-10",
                        tabContent:
                            "group-data-[selected=true]:font-bold uppercase font-medium text-sm",
                    }}
                    selectedKey={tab || ""}
                    onSelectionChange={setTab}
                >
                    {tabs?.map((item: any) => (
                        <Tab
                            key={item?.id}
                            title={
                                <span className="tracking-wider font-semibold">{item?.name}</span>
                            }
                        />
                    ))}
                </Tabs>
            </div>
            
            <div className="mt-4 p-1">
                {render[tab]}
            </div>
        </>
    );
}

export default TabsList;