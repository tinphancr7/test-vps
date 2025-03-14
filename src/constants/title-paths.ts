import paths from "@/routes/paths";

const titlePaths = [
  { href: "/", title: "Trang chủ" },
  { href: paths.signIn, title: "Đăng nhập" },
  { href: paths.roles, title: "Quản lý phân quyền" },
  { href: paths.users, title: "Quản lý nhân sự" },
  { href: paths.teams, title: "Quản lý Teams" },
  { href: paths.brands, title: "Quản lý hậu đài" },
  { href: paths.vps_vietstack, title: "Mua VPS Cloud 01" },
  { href: paths.vps_vng, title: "Mua VPS Cloud 02" },
  { href: paths.vps_vietserver, title: "Mua VPS Cloud 03" },
  { href: paths.vps_digitalOcean, title: "Mua VPS - Digital Ocean" },
  { href: paths.vps_alibaba_ecs, title: "Mua VPS - Alibaba ECS" },
  {
    href: paths.load_balancer_digitalOcean,
    title: "Mua Load Balancer - Digital Ocean",
  },
  { href: paths.vps_management_vietstack, title: "VPS Cloud 01" },
  { href: paths.vps_management_general, title: "VPS Tổng Quan" },
  { href: paths.vps_management_orther, title: "VPS - Khác" },
  { href: paths.vps_management_vng, title: "VPS Cloud 02" },
  { href: paths.vps_management_vietserver, title: "VPS Cloud 03" },
  { href: paths.vps_management_digitalOcean, title: "VPS - Digital Ocean" },
  { href: paths.vps_manage_bu_cloud, title: "VPS Cloud 05" },
  { href: paths.bu_cloud, title: "Mua VPS Cloud 05" },
  { href: paths.vps_management_alibaba_ecs, title: "VPS - Alibaba ECS" },
  {
    href: paths.load_balancer_management_digitalOcean,
    title: "Quản lý Load Balancer - Digital Ocean",
  },
  { href: paths.invoices, title: "Quản lý hóa đơn" },
  { href: paths.invoices_vng, title: "Quản lý hóa đơn Cloud 02" },
  { href: paths.invoices_vng_detail, title: "Chi tiết hóa đơn VPS Cloud 02" },
  { href: paths.invoices_vietstack, title: "Quản lý hóa đơn VPS Cloud 01" },
  {
    href: paths.invoices_vietstack_detail,
    title: "Chi tiết hóa đơn VPS Cloud 01",
  },
  {
    href: paths.invoices_digital_ocean,
    title: "Quản lý hóa đơn - Digital Ocean",
  },
  { href: paths.statistics, title: "Thống kê hóa đơn" },
  { href: paths.accounts, title: "Quản lý tài khoản" },
  { href: paths.logs, title: "Quản lý Logs" },
  { href: paths.transaction, title: "Quản lý giao dịch" },
  { href: paths.server_vng, title: "Server Cloud 02" },
  { href: paths.server_vietserver, title: "Server Cloud 03" },
  { href: paths.server_vietstack, title: "Server Cloud 01" },
];

export default titlePaths;
