/* eslint-disable react-refresh/only-export-components */
import OrderDomainLogPage from '@/pages/order-domain-logs';
import paths from './paths';

/**
 * Layouts
 * These are the main layout components used to wrap different sections of the application.
 */
const VpsLayout = '@/layouts/vps-layout';
const InvoicesLayout = '@/layouts/invoices-layout';
const ServerLayout = '@/layouts/server-layout';
const CloudFlareDetailLayout = '@/layouts/cloudflare-detail-layout';
const VpsManagementLayout = '@/layouts/vps-management-layout';

/**
 * Dashboard
 * The main dashboard page of the application.
 */
const Dashboard = '@/pages/dashboard';

/**
 * Users & Permissions
 * Pages related to user management and permissions.
 */
const Roles = '@/pages/roles';
const Users = '@/pages/users';
const FingerPrints = '@/pages/fingerprint';
const Teams = '@/pages/teams';
const Brands = '@/pages/brands';

/**
 * VPS Management
 * Pages related to managing Virtual Private Servers (VPS).
 */
const VpsGeneralPage = '@/pages/vps-general';
const ManagementVPS = '@/pages/vps-management';
const ManagementVPSDigitalOcean = '@/pages/digital-ocean/manage-vps/ManagementVPSDigitalOcean';
const ManagementVPSAlibabaEcs = '@/pages/vps-alibaba-ecs';
const ManagementVPSVng = '@/pages/vps-vng';
const ManagementVPSVietStack = '@/pages/vps-viet-stack';
const ManagementVPSVietServer = '@/pages/vps-viet-server';

/**
 * VPS Details
 * Pages for displaying detailed information about specific VPS instances.
 */
const DetailVpsAwsLightsail = '@/pages/detail-vps-aws-lightsail';
const DetailVpsUpCloud = '@/pages/detail-vps-up-cloud';
const DetailVpsAlibabaEcs = '@/pages/detail-vps-alibaba-ecs';
const DetailVpsVngOrVietStack = '@/pages/detail-vps-vng-or-vietstack';
const DetailVpsOrther = '@/pages/detail-vps-orther';

/**
 * Buy VPS
 * Pages for purchasing VPS instances from different providers.
 */
const BuyVps = '@/pages/buy-vps';
const BuyVpsVietStack = '@/pages/buy-vps-vietstack';
const BuyVpsVng = '@/pages/buy-vps-vng';
const BuyVpsVServer = '@/pages/buy-vps-vietserver';
const BuyVpsAlibabaEcs = '@/pages/buy-vps-alibaba-ecs';
const BuyVpsScaleway = '@/pages/buy-vps-scaleway';

/**
 * Initialize VPS
 * Pages for initializing VPS instances.
 */
const InitializeVpsVServer = '@/pages/initialize-vps-vietserver';
const InitializeVpsVng = '@/pages/initialize-vps-vng';
const InitializeVpsVietStack = '@/pages/initialize-vps-vietstack';
const InitializeVPSBuCloud =
    '@/pages/bu-cloud/create-vps/initialize-vps-bu-cloud/InitializeVPSBuCloud';
const CreateVPSDigitalOcean = '@/pages/digital-ocean/create-vps/CreateVPSDigitalOcean';
const CreateLoadBalancerDigitalOcean =
    '@/pages/digital-ocean/load-balancer/CreateLoadBalancerDigitalOcean';
const BuCloud = '@/pages/bu-cloud/create-vps/BuCloud';

/**
 * VPS Management Details
 * Pages for managing and viewing details of VPS instances.
 */
const ManagementOrtherVps = '@/pages/vps-orther';
const ManagementDetailVPSDigitalOcean =
    '@/pages/digital-ocean/manage-vps/detail-vps/ManagementDetailVPSDigitalOcean';
const ManagementLoadBalancerDigitalOcean =
    '@/pages/digital-ocean/manage-load-balancer/ManagementLoadBalancerDigitalOcean';
const ManagementDetailLoadBalancer =
    '@/pages/digital-ocean/manage-load-balancer/detail-load-balancer/ManagementDetailLoadBalancer';
const ManagementDetailLoadBalancerBuCloud =
    '@/pages/bu-cloud/manage-load-balancer/detail-load-balancer/ManagementDetailLoadBalancer';
const ManagementLoadBalancerBuCloud =
    '@/pages/bu-cloud/manage-load-balancer/ManagementLoadBalancerDigitalOcean';
const ManageBuCloud = '@/pages/bu-cloud/manage-vps/ManageBuCloud';
const DetailVPSBuCloud = '@/pages/bu-cloud/manage-vps/service-bucloud/detail-vps';
const ManagementDetailVPSBuCLoudDigitalOcean =
    '@/pages/bu-cloud/manage-vps/service-digitalocean/detail-vps/ManagementDetailVPSBuCLoudDigitalOcean';
const DetailVPSScaleWay = '@/pages/detail-vps-scaleway';

/**
 * Servers
 * Pages related to server management.
 */
const Server = '@/pages/server';
const ServerVNG = '@/pages/server-vng';
const ServerVietSever = '@/pages/server-vietserver';
const ServerVietStack = '@/pages/server-vietstack';

/**
 * Invoices
 * Pages related to invoice management.
 */
const Invoices = '@/pages/invoices';
const InvoicesVNG = '@/pages/invoices-vng';
const InvoicesVietStack = '@/pages/invoices-vietstack';
const InvoicesDO = '@/pages/invoices-digital-ocean';
const InvoicesBuCloud = '@/pages/invoices-bu-cloud';
const DetailInvoiceVS = '@/pages/invoices-vietstack/components/DetailInvoiceVS';
const DetailInvoiceVNG = '@/pages/invoices-vng/components/DetailInvoiceVNG';
const InvoiceServerVietSever = '@/pages/invoice-server-vietserver';
const DetailInvoiceServerVietSever =
    '@/pages/invoice-server-vietserver/components/detail-invoice-server-vetserver';

/**
 * Cloudflare
 * Pages related to Cloudflare services and configurations.
 */
const CloudflareAccountDetail = '@/pages/cloudflare/detail-account';
const CloudflareDns = '@/pages/cloudflare-dns';
const CloudflareOverview = '@/pages/cloudflare-overview';
const CloudflareRules = '@/pages/cloudflare-rules';
const CloudflareApiKeyPage = '@/pages/cloudflare-api-key';
const CloudflareRulesetPage = '@/pages/cloudflare-waf';
const CloudFlareSslPage = '@/pages/cloudflare-ssl';

/**
 * Orders & Domains
 * Pages related to orders and domain management.
 */
const Order = '@/pages/order';
const OrderDomain = '@/pages/order-domain';
const BuyDomainPage = '@/pages/buy-domain';
const WhoIsDomainPage = '@/pages/who-is-domain';
const DomainProviderPage = '@/pages/domain-provider';

/**
 * Logs & Transactions
 * Pages related to logs and transaction history.
 */
const LogPage = '@/pages/logss';
const TransactionPage = '@/pages/transaction';

/**
 * Provider
 * Page for managing service providers.
 */
const Provider = '@/pages/provider';

/**
 * Statistics & Accounts
 * Pages related to statistics and account management.
 */
const StatisticPage = '@/pages/statistics';
const AccountPage = '@/pages/accounts';

const routesConfig = [
    {
        path: paths.dashboard,
        element: Dashboard,
    },
    {
        path: paths.roles,
        element: Roles,
    },
    {
        path: paths.users,
        element: Users,
    },
    {
        path: paths.fingerprint,
        element: FingerPrints,
    },

    {
        path: paths.teams,
        element: Teams,
    },
    {
        path: paths.provider,
        element: Provider,
    },
    {
        path: paths.brands,
        element: Brands,
    },
    {
        element: VpsLayout,
        children: [
            {
                path: paths.buy_vps,
                element: BuyVps,
            },
            {
                path: paths.vps_vietstack,
                element: BuyVpsVietStack,
            },
            {
                path: paths.vps_vietserver,
                element: BuyVpsVServer,
            },
            {
                path: paths.vps_vietserver + '/:id',
                element: InitializeVpsVServer,
            },
            {
                path: paths.vps_vng,
                element: BuyVpsVng,
            },
            {
                path: paths.vps_vng + '/:id',
                element: InitializeVpsVng,
            },
            {
                path: paths.vps_vietstack + '/:id',
                element: InitializeVpsVietStack,
            },
            {
                path: paths.vps_digitalOcean,
                element: CreateVPSDigitalOcean,
            },
            {
                path: paths.load_balancer_digitalOcean,
                element: CreateLoadBalancerDigitalOcean,
            },
            {
                path: paths.bu_cloud,
                element: BuCloud,
            },
            {
                path: paths.bu_cloud + '/:id',
                element: InitializeVPSBuCloud,
            },
            {
                path: paths.vps_alibaba_ecs,
                element: BuyVpsAlibabaEcs,
            },
        ],
    },
    {
        element: VpsManagementLayout,
        children: [
            {
                path: paths.vps_management,
                element: ManagementVPS,
            },
            {
                path: paths.vps_management_vng,
                element: ManagementVPSVng,
            },
            {
                path: paths.vps_management_vng + '/:id/:slug',
                element: DetailVpsVngOrVietStack,
            },

            {
                path: paths.vps_management_vietstack,
                element: ManagementVPSVietStack,
            },
            {
                path: paths.vps_management_general,
                element: VpsGeneralPage,
            },
            {
                path: paths.vps_management_vietstack + '/:id/:slug',
                element: DetailVpsVngOrVietStack,
            },
            {
                path: paths.vps_management_orther,
                element: ManagementOrtherVps,
            },
            {
                path: paths.vps_management_orther + '/:id/:slug',
                element: DetailVpsOrther,
            },

            {
                path: paths.vps_management_vietserver,
                element: ManagementVPSVietServer,
            },
            {
                path: paths.vps_management_vietserver + '/:id/:slug',
                element: DetailVpsVngOrVietStack,
            },
            {
                path: paths.vps_management_vietserver + '/:id',
                element: DetailVpsVngOrVietStack,
            },
            {
                path: paths.vps_management_digitalOcean,
                element: ManagementVPSDigitalOcean,
            },
            {
                path: paths.vps_management_digitalOcean + '/:id/:slug',
                element: ManagementDetailVPSDigitalOcean,
            },
            {
                path: paths.load_balancer_management_digitalOcean,
                element: ManagementLoadBalancerDigitalOcean,
            },
            {
                path: paths.load_balancer_management_digitalOcean + '/:id/:slug',
                element: ManagementDetailLoadBalancer,
            },
            {
                path: paths.load_balancer_management_digitalOcean_bu_cloud,
                element: ManagementLoadBalancerBuCloud,
            },
            {
                path: paths.load_balancer_management_digitalOcean_bu_cloud + '/:id/:slug',
                element: ManagementDetailLoadBalancerBuCloud,
            },
            {
                path: paths.vps_manage_bu_cloud,
                element: ManageBuCloud,
            },
            {
                path: paths.vps_management_alibaba_ecs,
                element: ManagementVPSAlibabaEcs,
            },
            {
                path: paths.vps_management_alibaba_ecs + '/:id/:slug',
                element: DetailVpsAlibabaEcs,
            },
            {
                path: paths.vps_manage_bu_cloud + '/:id/:slug',
                element: DetailVPSBuCloud,
            },
            {
                path: paths.vps_manage_bu_cloud_digital_ocean + '/:id/:slug',
                element: ManagementDetailVPSBuCLoudDigitalOcean,
            },
            {
                path: paths.vps_manage_bu_cloud_aws_lightsail + '/:id/:slug',
                element: DetailVpsAwsLightsail,
            },
            {
                path: paths.vps_manage_bu_cloud_up_cloud + '/:id',
                element: DetailVpsUpCloud,
            },
            {
                path: paths.vps_scaleway,
                element: BuyVpsScaleway,
            },
            {
                path: paths.vps_manage_bu_cloud_scaleway + '/:id',
                element: DetailVPSScaleWay,
            },
            {
                path: paths.vps_management_bucloud_alibaba_ecs + '/:id/:slug',
                element: DetailVpsAlibabaEcs,
            },
        ],
    },
    {
        element: ServerLayout,
        children: [
            {
                path: paths.server,
                element: Server,
            },
            {
                path: paths.server_vng,
                element: ServerVNG,
            },
            {
                path: paths.server_vietserver,
                element: ServerVietSever,
            },
            {
                path: paths.server_vietstack,
                element: ServerVietStack,
            },
        ],
    },
    {
        element: InvoicesLayout,
        children: [
            {
                path: paths.invoices,
                element: Invoices,
            },
            {
                path: paths.invoices_vng,
                element: InvoicesVNG,
            },

            {
                path: paths.invoices_vietstack,
                element: InvoicesVietStack,
            },
            {
                path: paths.invoices_vietserver,
                element: InvoicesVietStack,
            },
            {
                path: paths.invoices_digital_ocean,
                element: InvoicesDO,
            },
            {
                path: paths.invoices_bu_cloud,
                element: InvoicesBuCloud,
            },
            {
                path: paths.invoices_server_vietserver,
                element: InvoiceServerVietSever,
            },
        ],
    },
    {
        path: paths.invoices_vng + '/detail',
        element: DetailInvoiceVNG,
    },
    {
        path: paths.invoices_vietstack + '/detail',
        element: DetailInvoiceVS,
    },
    {
        path: paths.invoices_server_vietserver + '/detail',
        element: DetailInvoiceServerVietSever,
    },
    {
        path: paths.statistics,
        element: StatisticPage,
    },
    {
        path: paths.accounts,
        element: AccountPage,
    },
    {
        path: paths.cloudflare_api_key,
        element: CloudflareApiKeyPage,
    },
    {
        path: paths.logs,
        element: LogPage,
    },
    {
        path: paths.logs,
        element: LogPage,
    },
    {
        path: paths.domain_provider,
        element: DomainProviderPage,
    },
    {
        path: paths.transaction,
        element: TransactionPage,
    },
    {
        path: paths.order,
        element: Order,
    },
    {
        element: CloudFlareDetailLayout,
        children: [
            {
                path: paths.cloudflare_ssl + '/:id',
                element: CloudFlareSslPage,
            },
            {
                path: paths.cloudflare_dns + '/:id',
                element: CloudflareDns,
            },
            {
                path: paths.cloudflare_overview + '/:id',

                element: CloudflareOverview,
            },
            {
                path: paths.cloudflare_rules + '/:id',
                element: CloudflareRules,
            },
            {
                path: paths.cloudflare_waf + '/:id',
                element: CloudflareRulesetPage,
            },
        ],
    },
    {
        path: paths.buy_domain,
        element: BuyDomainPage,
    },
    {
        path: paths.who_is_domain,
        element: WhoIsDomainPage,
    },

    {
        path: paths.cloudflare,
        element: CloudflareAccountDetail,
    },
    {
        path: `${paths.cloudflare}/:id`,
        element: CloudflareAccountDetail,
    },
    {
        path: paths.orders_domain,
        element: OrderDomain,
    },
    {
        path: paths.orders_domain_log,
        element: OrderDomainLogPage,
    },
];

export { routesConfig };
