import { SidebarItem as SidebarItemProps } from "@/interfaces/sidebar-item";
import { useAppSelector } from "@/stores";
import { fetchPermissionsByRoleId } from "@/stores/slices/auth-slice";
import { Button } from "@heroui/react";
import { useMemo } from "react";
import { IconType } from "react-icons";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function SidebarItem({ route }: { route: SidebarItemProps }) {
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const Icon = useMemo(() => route.icon as IconType, [route]);

	const bgActiveRoute = useMemo(() => {
		const splitPathname = pathname.split('/')[1];
		const splitHref = route.href?.split('/')[1];

		return splitPathname === splitHref
			? "bg-primary hover:bg-primary/50"
			: "bg-transparent hover:bg-slate-100";
	}, [route, pathname]);

	const textActiveRoute = useMemo(() => {
		const splitPathname = pathname.split('/')[1];
		const splitHref = route.href?.split('/')[1];

		return splitPathname === splitHref ? "text-light font-bold" : "font-medium";
	}, [route, pathname]);

	const iconActiveRoute = useMemo(() => {
		const splitPathname = pathname.split('/')[1];
		const splitHref = route.href?.split('/')[1];
		
		return splitPathname === splitHref ? "text-light" : "text-primary";
	}, [route, pathname]);

	const handleFetchPermission = () => {
		if (user?.role?._id) {
			dispatch(fetchPermissionsByRoleId(user?.role?._id) as any);
		}
	};

	return (
		<Button
			className={`relative flex py-2 px-4 gap-3 items-center justify-start select-none cursor-pointer rounded-md ${bgActiveRoute}`}
			onPress={() => {
				navigate(route?.href);
				handleFetchPermission();
			}}
		>
			{/* Icon */}
			<span className={`text-2xl min-w-6 ${textActiveRoute}`}>
				<Icon className={iconActiveRoute} />
			</span>

			{/* Title */}
			<h4 className={`text-base ${textActiveRoute}`}>
				{route?.title}
			</h4>
		</Button>
	);
}

export default SidebarItem;
