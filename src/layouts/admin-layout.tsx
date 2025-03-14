import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LazyLoadingLayout from "@/components/lazy-loading-layout";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import titlePaths from "@/constants/title-paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import paths from "@/routes/paths";

import { fetchPermissionsByRoleId } from "@/stores/slices/auth-slice";
import useSetMaxHeight from "@/hooks/use-set-max-height";

function AdminLayout() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const activeRoute = titlePaths?.find((route) => route.href === pathname);

    document.title = activeRoute?.title || "";

    return () => {};
  }, [pathname]);

  useEffect(() => {
    if (!isAuth) {
      navigate(paths.signIn);
    }

    return () => {};
  }, [isAuth, navigate]);

  useEffect(() => {
    if (user?.role?._id) {
      dispatch(fetchPermissionsByRoleId(user?.role?._id) as any);
    }
  }, [user?.role?._id]);

  const maxHeight = useSetMaxHeight({
    max: "100dvh - 16px",
    dependency: ".nav__bar",
  });

  if (!isAuth) return <LazyLoadingLayout />;

  return (
    <Suspense fallback={<LazyLoadingLayout />}>
      <div className="h-dvh w-full flex flex-col items-stretch bg-layout">
        <div className="h-full w-full grid grid-cols-12 gap-x-2">
          <Sidebar />

          <div className="col-span-10 max-md:col-span-12 pr-1">
            <Navbar />

            <div style={{ maxHeight }} className="h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default AdminLayout;
