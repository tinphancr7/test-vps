// import { Image } from "@heroui/react";
// import { useNavigate } from "react-router-dom";
// import SidebarItem from "./sidebar-item";
// import { useCallback } from "react";
// import { useAppSelector } from "@/stores";
// import sidebars from "@/constants/sidebars";
// import paths from "@/routes/paths";
// import { SidebarItem as SidebarItemProps } from "@/interfaces/sidebar-item";
// import { SubjectEnum } from "@/constants/enum";

// function Sidebar() {
// 	const navigate = useNavigate();
// 	const { permissions } = useAppSelector((state) => state.auth);

// 	const generateRoutes = useCallback(
// 		(route: SidebarItemProps, index: number) => {
// 			const isAccessRole = permissions?.find(
// 				(perms: any) =>
// 					perms.subject === SubjectEnum.ALL ||
// 					(perms.subject === route.subject &&
// 						perms?.action.includes(route.action))
// 			);

// 			if (!isAccessRole) return;

// 			return <SidebarItem key={index} route={route} />;
// 		},
// 		[permissions]
// 	);

// 	return (
// 		<div className="col-span-2">
// 			<div className="max-md:hidden fixed w-sidebar col-span-2 h-full overflow-hidden shadow-navbar bg-light flex flex-col">
// 				{/* Logo */}
// 				<div className="flex items-center justify-center p-2 cursor-pointer">
// 					<div className="w-[160px] h-[78px] relative">
// 						<Image
// 							alt="okvip-logo"
// 							src={"/imgs/LOGO-OKVIP-FINAL.png"}
// 							className=""
// 							onClick={() => navigate(paths.dashboard)}
// 						/>
// 					</div>
// 				</div>

// 				{/* Sidebar List */}
// 				<div className="grow overflow-auto scroll-main divide-y-1 !divide-slate-400/40 pb-6">
// 					<div className="flex flex-col gap-3 px-2 py-2">
// 						{sidebars?.map((route, index) => generateRoutes(route, index))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default Sidebar;

import { Image, Tab, Tabs } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./sidebar-item";
import { useCallback, useMemo, useState } from "react";
import { useAppSelector } from "@/stores";
import { sidebarsDomain, sidebarsVps } from "@/constants/sidebars";
import paths from "@/routes/paths";
import { SidebarItem as SidebarItemProps } from "@/interfaces/sidebar-item";
import { SubjectEnum } from "@/constants/enum";

function Sidebar() {
    const navigate = useNavigate();
    const { permissions } = useAppSelector((state) => state.auth);
	const [tab, setTab] = useState<any>('vps');

    const generateRoutes = useCallback(
        (route: SidebarItemProps, index: number) => {
            const isAccessRole = permissions?.find(
                (perms: any) =>
                    perms.subject === SubjectEnum.ALL ||
                    (perms.subject === route.subject &&
                        perms?.action.includes(route.action))
            );

            if (!isAccessRole) return;

            return <SidebarItem key={index} route={route} />;
        },
        [permissions]
    );

	const tabs = [
		{ label: "VPS", key: "vps" },
		{ label: "DOMAIN", key: "domain" },
	];

	const sidebars = useMemo(() => {
		if (tab === 'vps') return sidebarsVps;

		return sidebarsDomain;
	}, [tab]);

    return (
        <div className="col-span-2">
            <div className="max-md:hidden fixed w-sidebar col-span-2 h-full overflow-hidden shadow-navbar bg-light flex flex-col">
                {/* Logo Okvip */}
                <div className="flex items-center justify-center p-2 cursor-pointer">
                    <div className="w-[160px] h-[78px] relative">
                        <Image
                            alt="okvip-logo"
                            src={"/imgs/LOGO-OKVIP-FINAL.png"}
                            className=""
                            onClick={() => navigate(paths.dashboard)}
                        />
                    </div>
                </div>

                <Tabs
                    fullWidth
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    classNames={{
                        tabList:
                            "gap-6 w-full relative rounded-none p-0 overflow-x-auto",
                        cursor: "w-full bg-primary",
                        tab: "px-2 h-10",
                        tabContent:
                            "group-data-[selected=true]:font-bold uppercase font-medium text-sm tracking-wider",
                    }}
                    selectedKey={tab}
                    onSelectionChange={setTab}
                >
                    {tabs?.map((item: any) => (
                        <Tab
                            key={item?.key}
                            title={
                                <div className="flex gap-2 font-bold">
                                    <div className="my-auto">{item.icon}</div>
                                    <span>{item.label}</span>
                                </div>
                            }
                        />
                    ))}
                </Tabs>

                {/* Sidebar List */}
                <div className="mt-4 grow overflow-auto scroll-main divide-y-1 !divide-slate-400/40 pb-6">
                    <div className="flex flex-col gap-3 px-2 py-2">
                        {sidebars?.map((route, index) =>
                            generateRoutes(route, index)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
 