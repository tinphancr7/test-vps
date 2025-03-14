import Container from "@/components/container";
import LazyLoadingLayout from "@/components/lazy-loading-layout";
import paths from "@/routes/paths";
import {useAppDispatch, useAppSelector} from "@/stores";
import {getZone} from "@/stores/async-thunks/cloud-flare-ssl.thunk";
import {Button, Spinner, Tab, Tabs} from "@heroui/react";
import {ReactElement, Suspense, useEffect} from "react";
import {FaExpeditedssl} from "react-icons/fa6";
import {GrDomain} from "react-icons/gr";
import {HiOutlineArrowLeft} from "react-icons/hi";
import {PiTreeStructureLight} from "react-icons/pi";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {GiLightFighter} from "react-icons/gi";

interface TabCloudFlare {
	key: string;
	label: string;
	icon: ReactElement;
	href: string;
}
const getStatusColorAndLabel = (status: string) => {
	switch (status) {
		case "initializing":
			return {
				color: "blue",
				className: "text-blue-500 bg-blue-300",
				label: "Đang khởi tạo",
			};
		case "pending":
			return {
				color: "yellow",
				className: "text-yellow-500 bg-yellow-300",
				label: "Đang chờ xử lý",
			};
		case "active":
			return {
				color: "green",
				className: "text-green-500 bg-green-300",
				label: "Đang hoạt động",
			};
		case "moved":
			return {
				color: "red",
				className: "text-red-500 bg-red-300",
				label: "Đã chuyển",
			};
		default:
			return {
				color: "gray",
				className: "text-gray-500 bg-gray-300",
				label: "Không xác định",
			};
	}
};
export default function CloudFlareDetailLayout() {
	const {pathname} = useLocation();
	const {id} = useParams();
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (id) dispatch(getZone(id));
	}, [id]);
	const {domainName, domainStatus, loadingZone} = useAppSelector(
		(state) => state.cloudFlareSsl
	);

	const navigate = useNavigate();
	const {accountId} = useAppSelector((state) => state.cloudFlareSsl);
	const handleNavigate = () => {
		navigate(paths.cloudflare + "/" + accountId);
	};

	const handleChangeTab = (tab: any) => {
		navigate(tab);
	};

	const tabs: Array<TabCloudFlare> = [
		{
			key: "overview",
			label: "Tổng quan",
			icon: <FaExpeditedssl className="size-5 min-w-5" />,
			href: paths.cloudflare_overview + "/" + id,
		},
		{
			key: "dns",
			label: "DNS",
			icon: <PiTreeStructureLight className="rotate-90 size-5 min-w-5" />,
			href: paths.cloudflare_dns + "/" + id,
		},
		{
			key: "ssl",
			label: "SSL/TLS",
			icon: <FaExpeditedssl className="size-5 min-w-5" />,
			href: paths.cloudflare_ssl + "/" + id,
		},
		{
			key: "rules",
			label: "Rules",
			icon: <GiLightFighter className="-rotate-45 size-5 min-w-5" />,
			href: paths.cloudflare_rules + "/" + id,
		},
		{
			key: "waf",
			label: "WAF",
			icon: <FaExpeditedssl className="size-5 min-w-5" />,
			href: paths.cloudflare_waf + "/" + id,
		},
	];

	const {
		color: statusColor,
		className: statusClassname,
		label: statusLabel,
	} = getStatusColorAndLabel(domainStatus);
	return (
		<>
			<Suspense fallback={<LazyLoadingLayout />}>
				<div className="flex flex-col gap-3 h-full mt-3">
					<Container>
						<Tabs
							fullWidth
							aria-label="Options"
							color="primary"
							variant="underlined"
							classNames={{
								tabList:
									"gap-6 w-max min-w-96 relative rounded-none p-0 overflow-x-auto pb-0",
								cursor: "w-full bg-primary",
								tab: "px-2 h-10",
								tabContent:
									"group-data-[selected=true]:font-bold uppercase font-medium text-sm tracking-wider",
							}}
							selectedKey={pathname || ""}
							onSelectionChange={handleChangeTab}
						>
							{tabs?.map((item: TabCloudFlare) => (
								<Tab
									key={item?.href}
									title={
										<div className="flex gap-2 font-bold">
											<div className="my-auto">{item.icon}</div>
											<span>{item.label}</span>
										</div>
									}
								/>
							))}
						</Tabs>
					</Container>
					<Container>
						<div className="flex items-center justify-start gap-6 py-1 px-2">
							<Button
								color="primary"
								className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg"
								onPress={() => {
									handleNavigate();
								}}
							>
								<HiOutlineArrowLeft />
							</Button>
							{loadingZone ? (
								<>
									<div className="col-span-1 flex items-center justify-center gap-1">
										<Spinner color="primary" size="sm" />
										<i className="text-sm">Đang tải...</i>
									</div>
								</>
							) : (
								<div className="flex items-center justify-center gap-2 ">
									<GrDomain />
									<p className="text-[16px] font-bold">{domainName}</p>
									<span
										className={`ml-2 flex gap-2 justify-center items-center text-[13px] h-6 font-semibold ${statusClassname} px-3 py-0.5 rounded-full bg-opacity-40 text-center `}
									>
										<span className="relative flex h-2.5 w-2.5">
											<span
												className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor}-400 opacity-75`}
											></span>
											<span
												className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${statusColor}-500`}
											></span>
										</span>
										{statusLabel}
									</span>
								</div>
							)}
						</div>
					</Container>
					<Outlet />
				</div>
			</Suspense>
		</>
	);
}
