/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import paths from "./paths";
import NotFound from "@/pages/not-found";
import LazyLoadingPage from "@/components/lazy-loading-page";
import CreateVPSDigitalOcean from "@/pages/digital-ocean/create-vps/CreateVPSDigitalOcean";
import CreateLoadBalancerDigitalOcean from "@/pages/digital-ocean/load-balancer/CreateLoadBalancerDigitalOcean";
import VpsManagementLayout from "@/layouts/vps-management-layout";
import AccountPage from "@/pages/accounts";
import StatisticPage from "@/pages/statistics";
import ManagementLoadBalancerDigitalOcean from "@/pages/digital-ocean/manage-load-balancer/ManagementLoadBalancerDigitalOcean";
import BuCloud from "@/pages/bu-cloud/create-vps/BuCloud";
import InitializeVPSBuCloud from "@/pages/bu-cloud/create-vps/initialize-vps-bu-cloud/InitializeVPSBuCloud";
import DetailVPSBuCloud from "@/pages/bu-cloud/manage-vps/service-bucloud/detail-vps";
import ManageBuCloud from "@/pages/bu-cloud/manage-vps/ManageBuCloud";
import ManagementDetailVPSBuCLoudDigitalOcean from "@/pages/bu-cloud/manage-vps/service-digitalocean/detail-vps/ManagementDetailVPSBuCLoudDigitalOcean";
import BuyVpsScaleway from "@/pages/buy-vps-scaleway";
import DetailVPSScaleWay from "@/pages/detail-vps-scaleway";

import CloudflareAccountDetail from "@/pages/cloudflare/detail-account";
import CloudFlareDetailLayout from "@/layouts/cloudflare-detail-layout";
import CloudflareRulesetPage from "@/pages/cloudflare-waf";

import BuyDomainPage from "@/pages/buy-domain";
import WhoIsDomainPage from "@/pages/who-is-domain";
import DomainProviderPage from "@/pages/domain-provider";

const OrderDomain = lazy(() => import("@/pages/order-domain"));

const DetailVpsAwsLightsail = lazy(() => import("@/pages/detail-vps-aws-lightsail"));

const CloudFlareSslPage = lazy(() => import("@/pages/cloudflare-ssl"));

const DetailVpsUpCloud = lazy(() => import("@/pages/detail-vps-up-cloud"));
const DetailVpsAlibabaEcs = lazy(() => import("@/pages/detail-vps-alibaba-ecs"));
const ManagementDetailLoadBalancer = lazy(
  () =>
    import(
      "@/pages/digital-ocean/manage-load-balancer/detail-load-balancer/ManagementDetailLoadBalancer"
    ),
);
const ManagementLoadBalancerBuCloud = lazy(
  () => import("@/pages/bu-cloud/manage-load-balancer/ManagementLoadBalancerDigitalOcean"),
);
const ManagementDetailLoadBalancerBuCloud = lazy(
  () =>
    import(
      "@/pages/bu-cloud/manage-load-balancer/detail-load-balancer/ManagementDetailLoadBalancer"
    ),
);
const DetailInvoiceVS = lazy(() => import("@/pages/invoices-vietstack/components/DetailInvoiceVS"));

const DetailInvoiceVNG = lazy(() => import("@/pages/invoices-vng/components/DetailInvoiceVNG"));
const ManagementDetailVPSDigitalOcean = lazy(
  () => import("@/pages/digital-ocean/manage-vps/detail-vps/ManagementDetailVPSDigitalOcean"),
);
const ManagementVPSDigitalOcean = lazy(
  () => import("@/pages/digital-ocean/manage-vps/ManagementVPSDigitalOcean"),
);
const ManagementVPSAlibabaEcs = lazy(() => import("@/pages/vps-alibaba-ecs"));
const ManagementVPSVng = lazy(() => import("@/pages/vps-vng"));
const ManagementVPSVietStack = lazy(() => import("@/pages/vps-viet-stack"));
const ManagementOrtherVps = lazy(() => import("@/pages/vps-orther"));
const ManagementVPSVietServer = lazy(() => import("@/pages/vps-viet-server"));
const ManagementVPS = lazy(() => import("@/pages/vps-management"));
const DetailVpsVngOrVietStack = lazy(() => import("@/pages/detail-vps-vng-or-vietstack"));
const DetailVpsOrther = lazy(() => import("@/pages/detail-vps-orther"));
const AdminLayout = lazy(() => import("@/layouts/admin-layout"));
const AuthLayout = lazy(() => import("@/layouts/auth-layout"));
const VpsLayout = lazy(() => import("@/layouts/vps-layout"));
const InvoicesLayout = lazy(() => import("@/layouts/invoices-layout"));
const SignIn = lazy(() => import("@/pages/sign-in"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Roles = lazy(() => import("@/pages/roles"));
const Users = lazy(() => import("@/pages/users"));
const FingerPrints = lazy(() => import("@/pages/fingerprint"));
const Teams = lazy(() => import("@/pages/teams"));
const Brands = lazy(() => import("@/pages/brands"));
const BuyVps = lazy(() => import("@/pages/buy-vps"));
const BuyVpsVietStack = lazy(() => import("@/pages/buy-vps-vietstack"));
const BuyVpsVng = lazy(() => import("@/pages/buy-vps-vng"));
const BuyVpsVServer = lazy(() => import("@/pages/buy-vps-vietserver"));
const BuyVpsAlibabaEcs = lazy(() => import("@/pages/buy-vps-alibaba-ecs"));
const InitializeVpsVng = lazy(() => import("@/pages/initialize-vps-vng"));
const InitializeVpsVServer = lazy(() => import("@/pages/initialize-vps-vietserver"));
const InitializeVpsVietStack = lazy(() => import("@/pages/initialize-vps-vietstack"));
const Invoices = lazy(() => import("@/pages/invoices"));
const InvoicesVNG = lazy(() => import("@/pages/invoices-vng"));
const InvoicesVietStack = lazy(() => import("@/pages/invoices-vietstack"));
const InvoicesDO = lazy(() => import("@/pages/invoices-digital-ocean"));
const InvoicesBuCloud = lazy(() => import("@/pages/invoices-bu-cloud"));
const LogPage = lazy(() => import("@/pages/logss"));
const TransactionPage = lazy(() => import("@/pages/transaction"));
const ServerLayout = lazy(() => import("@/layouts/server-layout"));
const Server = lazy(() => import("@/pages/server"));
const ServerVNG = lazy(() => import("@/pages/server-vng"));
const ServerVietSever = lazy(() => import("@/pages/server-vietserver"));
const ServerVietStack = lazy(() => import("@/pages/server-vietstack"));
const InvoiceServerVietSever = lazy(() => import("@/pages/invoice-server-vietserver"));
const DetailInvoiceServerVietSever = lazy(
  () => import("@/pages/invoice-server-vietserver/components/detail-invoice-server-vetserver"),
);
const Order = lazy(() => import("@/pages/order"));
const Provider = lazy(() => import("@/pages/provider"));
const CloudflareDns = lazy(() => import("@/pages/cloudflare-dns"));
const CloudflareOverview = lazy(() => import("@/pages/cloudflare-overview"));
const CloudflareRules = lazy(() => import("@/pages/cloudflare-rules"));
const CloudflareApiKeyPage = lazy(() => import("@/pages/cloudflare-api-key"));
const VpsGeneralPage = lazy(() => import("@/pages/vps-general"));
const Manage2FaKey = lazy(() => import("@/pages/manage-2fa-key"));
const routes = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      {
        path: paths.dashboard,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: paths.roles,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Roles />
          </Suspense>
        ),
      },
      {
        path: paths.users,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: paths.fingerprint,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <FingerPrints />
          </Suspense>
        ),
      },
      {
        path: paths.manage2fakey,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Manage2FaKey />
          </Suspense>
        ),
      },

      {
        path: paths.teams,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Teams />
          </Suspense>
        ),
      },
      {
        path: paths.provider,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Provider />
          </Suspense>
        ),
      },
      {
        path: paths.brands,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Brands />
          </Suspense>
        ),
      },
      {
        element: <VpsLayout />,
        children: [
          {
            path: paths.buy_vps,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <BuyVps />
              </Suspense>
            ),
          },
          {
            path: paths.vps_vietstack,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <BuyVpsVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.vps_vietserver,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <BuyVpsVServer />
              </Suspense>
            ),
          },
          {
            path: paths.vps_vietserver + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InitializeVpsVServer />
              </Suspense>
            ),
          },
          {
            path: paths.vps_vng,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <BuyVpsVng />
              </Suspense>
            ),
          },
          {
            path: paths.vps_vng + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InitializeVpsVng />
              </Suspense>
            ),
          },
          {
            path: paths.vps_vietstack + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InitializeVpsVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.vps_digitalOcean,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <CreateVPSDigitalOcean />
              </Suspense>
            ),
          },
          {
            path: paths.load_balancer_digitalOcean,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <CreateLoadBalancerDigitalOcean />
              </Suspense>
            ),
          },
          {
            path: paths.bu_cloud,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <BuCloud />
              </Suspense>
            ),
          },
          {
            path: paths.bu_cloud + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InitializeVPSBuCloud />
              </Suspense>
            ),
          },
          {
            path: paths.vps_alibaba_ecs,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <BuyVpsAlibabaEcs />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <VpsManagementLayout />,
        children: [
          {
            path: paths.vps_management,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementVPS />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_vng,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementVPSVng />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_vng + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsVngOrVietStack />
              </Suspense>
            ),
          },

          {
            path: paths.vps_management_vietstack,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementVPSVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_general,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <VpsGeneralPage />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_vietstack + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsVngOrVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_orther,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementOrtherVps />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_orther + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsOrther />
              </Suspense>
            ),
          },

          {
            path: paths.vps_management_vietserver,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementVPSVietServer />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_vietserver + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsVngOrVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_vietserver + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsVngOrVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_digitalOcean,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementVPSDigitalOcean />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_digitalOcean + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementDetailVPSDigitalOcean />
              </Suspense>
            ),
          },
          {
            path: paths.load_balancer_management_digitalOcean,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementLoadBalancerDigitalOcean />
              </Suspense>
            ),
          },
          {
            path: paths.load_balancer_management_digitalOcean + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementDetailLoadBalancer />
              </Suspense>
            ),
          },
          {
            path: paths.load_balancer_management_digitalOcean_bu_cloud,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementLoadBalancerBuCloud />
              </Suspense>
            ),
          },
          {
            path: paths.load_balancer_management_digitalOcean_bu_cloud + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementDetailLoadBalancerBuCloud />
              </Suspense>
            ),
          },
          {
            path: paths.vps_manage_bu_cloud,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManageBuCloud />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_alibaba_ecs,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementVPSAlibabaEcs />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_alibaba_ecs + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsAlibabaEcs />
              </Suspense>
            ),
          },
          {
            path: paths.vps_manage_bu_cloud + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVPSBuCloud />
              </Suspense>
            ),
          },
          {
            path: paths.vps_manage_bu_cloud_digital_ocean + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ManagementDetailVPSBuCLoudDigitalOcean />
              </Suspense>
            ),
          },
          {
            path: paths.vps_manage_bu_cloud_aws_lightsail + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsAwsLightsail />
              </Suspense>
            ),
          },
          {
            path: paths.vps_manage_bu_cloud_up_cloud + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsUpCloud />
              </Suspense>
            ),
          },
          {
            path: paths.vps_scaleway,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <BuyVpsScaleway />
              </Suspense>
            ),
          },
          {
            path: paths.vps_manage_bu_cloud_scaleway + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVPSScaleWay />
              </Suspense>
            ),
          },
          {
            path: paths.vps_management_bucloud_alibaba_ecs + "/:id/:slug",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <DetailVpsAlibabaEcs />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <ServerLayout />,
        children: [
          {
            path: paths.server,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <Server />
              </Suspense>
            ),
          },
          {
            path: paths.server_vng,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ServerVNG />
              </Suspense>
            ),
          },
          {
            path: paths.server_vietserver,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ServerVietSever />
              </Suspense>
            ),
          },
          {
            path: paths.server_vietstack,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <ServerVietStack />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <InvoicesLayout />,
        children: [
          {
            path: paths.invoices,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <Invoices />
              </Suspense>
            ),
          },
          {
            path: paths.invoices_vng,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InvoicesVNG />
              </Suspense>
            ),
          },

          {
            path: paths.invoices_vietstack,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InvoicesVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.invoices_vietserver,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InvoicesVietStack />
              </Suspense>
            ),
          },
          {
            path: paths.invoices_digital_ocean,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InvoicesDO />
              </Suspense>
            ),
          },
          {
            path: paths.invoices_bu_cloud,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InvoicesBuCloud />
              </Suspense>
            ),
          },
          {
            path: paths.invoices_server_vietserver,
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <InvoiceServerVietSever />
              </Suspense>
            ),
          },
        ],
      },

      {
        path: paths.invoices_vng + "/detail",
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <DetailInvoiceVNG />
          </Suspense>
        ),
      },
      {
        path: paths.invoices_vietstack + "/detail",
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <DetailInvoiceVS />
          </Suspense>
        ),
      },
      {
        path: paths.invoices_server_vietserver + "/detail",
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <DetailInvoiceServerVietSever />
          </Suspense>
        ),
      },
      {
        path: paths.statistics,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            {" "}
            <StatisticPage />
          </Suspense>
        ),
      },
      {
        path: paths.accounts,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <AccountPage />
          </Suspense>
        ),
      },
      {
        path: paths.cloudflare_api_key,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <CloudflareApiKeyPage />
          </Suspense>
        ),
      },
      {
        path: paths.logs,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <LogPage />
          </Suspense>
        ),
      },
      {
        path: paths.logs,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <LogPage />
          </Suspense>
        ),
      },
      {
        path: paths.domain_provider,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <DomainProviderPage />
          </Suspense>
        ),
      },
      {
        path: paths.transaction,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <TransactionPage />
          </Suspense>
        ),
      },
      {
        path: paths.order,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <Order />
          </Suspense>
        ),
      },
      {
        element: <CloudFlareDetailLayout />,
        children: [
          {
            path: paths.cloudflare_ssl + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <CloudFlareSslPage />
              </Suspense>
            ),
          },
          {
            path: paths.cloudflare_dns + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <CloudflareDns />
              </Suspense>
            ),
          },
          {
            path: paths.cloudflare_overview + "/:id",

            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <CloudflareOverview />
              </Suspense>
            ),
          },
          {
            path: paths.cloudflare_rules + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <CloudflareRules />
              </Suspense>
            ),
          },
          {
            path: paths.cloudflare_waf + "/:id",
            element: (
              <Suspense fallback={<LazyLoadingPage />}>
                <CloudflareRulesetPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: paths.buy_domain,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <BuyDomainPage />
          </Suspense>
        ),
      },
      {
        path: paths.who_is_domain,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <WhoIsDomainPage />
          </Suspense>
        ),
      },

      {
        path: paths.cloudflare,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <CloudflareAccountDetail />
          </Suspense>
        ),
      },
      {
        path: `${paths.cloudflare}/:id`,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <CloudflareAccountDetail />
          </Suspense>
        ),
      },
      {
        path: paths.orders_domain,
        element: (
          <Suspense fallback={<LazyLoadingPage />}>
            <OrderDomain />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: paths.signIn, element: <SignIn /> }],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;

// import { createBrowserRouter } from "react-router-dom";
// import { lazy, Suspense } from "react";
// import paths from "./paths";
// import { routesConfig } from "./route-config";

// const LazyLoadingPage = lazy(() => import("@/components/lazy-loading-page"));
// const AuthLayout = lazy(() => import("@/layouts/auth-layout"));
// const AdminLayout = lazy(() => import("@/layouts/admin-layout"));
// const SignIn = lazy(() => import("@/pages/sign-in"));
// const NotFound = lazy(() => import("@/pages/not-found"));

// const loadComponent = (componentPath: string) => {
//     if (!componentPath.startsWith("@/")) {
//         throw new Error("Component path must start with @/");
//     }

//     const resolvedPath = componentPath.replace("@", "/src");

//     return lazy(() => import(/* @vite-ignore */ `${resolvedPath}`));
// };

// const createRoute = ({ path, element, children }: any) => {
//     const Component = loadComponent(element);

//     const route: any = {
//         path,
//         element: (
//             <Suspense fallback={<LazyLoadingPage />}>
//                 <Component />
//             </Suspense>
//         ),
//     };

//     // Recursively handle children routes
//     if (children && children.length > 0) {
//         route.children = children.map((child: any) => createRoute(child));
//     }

//     return route;
// };

// const routes = createBrowserRouter([
//     {
//         element: (
//             <Suspense fallback={<LazyLoadingPage />}>
//                 <AdminLayout />
//             </Suspense>
//         ),
//         children: routesConfig.map((route) => createRoute(route)),
//     },
//     {
//         element: (
//             <Suspense fallback={<LazyLoadingPage />}>
//                 <AuthLayout />
//             </Suspense>
//         ),
//         children: [
//             {
//                 path: paths.signIn,
//                 element: (
//                     <Suspense fallback={<LazyLoadingPage />}>
//                         <SignIn />
//                     </Suspense>
//                 ),
//             },
//         ],
//     },
// 	{
// 		path: "*",
// 		element: <NotFound />,
// 	},
// ]);

// export default routes;
