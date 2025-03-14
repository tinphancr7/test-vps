import LazyLoadingLayout from "@/components/lazy-loading-layout";
import paths from "@/routes/paths";
import {useAppSelector} from "@/stores";
import {Suspense, useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import animation from "./Animation.json";
import Lottie from "lottie-react";

function AuthLayout() {
	const {pathname} = useLocation();
	const navigate = useNavigate();
	const {isAuth} = useAppSelector((state) => state.auth);

	useEffect(() => {
		const title = pathname === paths.signIn ? "Đăng nhập" : "Đăng ký";

		document.title = title;

		return () => {};
	}, [pathname]);

	useEffect(() => {
		if (isAuth) {
			navigate(paths.dashboard);
		}

		return () => {};
	}, [isAuth, navigate]);

	return (
		<Suspense fallback={<LazyLoadingLayout />}>
			<div className="max-h-dvh grid grid-cols-12 px-[10%] max-md:px-0 relative">
				<div className="col-span-6 relative h-full w-full max-h-dvh max-md:col-span-12">
				<Lottie animationData={animation} loop={true} />
				</div>
				<div className="col-span-6 max-md:col-span-12 max-md:absolute max-md:top-1/2 max-md:left-1 max-md:right-1 max-md:-translate-y-[50%] max-md:bg-slate-100/90">
					<Outlet />
				</div>
			</div>
		</Suspense>
	);
}

export default AuthLayout;
