// import paths from "@/routes/paths";
// import { FaUser } from "react-icons/fa6";
// import { GrCloudComputer, GrDomain } from "react-icons/gr";
// import { LuHistory } from "react-icons/lu";
// import { MdMapsHomeWork, MdOutlineLibraryBooks } from "react-icons/md";
// import { SiParrotsecurity, SiCloudflare, SiAmazonapigateway } from "react-icons/si";
// import { TbAuth2Fa, TbUsersGroup } from "react-icons/tb";
// import { GoServer } from "react-icons/go";
// import { IoLogoElectron } from "react-icons/io5";
// import { SubjectEnum } from "./enum";
// import { BsCart3 } from "react-icons/bs";
// // import { FaCloudflare } from "react-icons/fa";

// const sidebars = [
//   {
//     subject: "statistics",
//     action: "read",
//     title: "Thống kê hóa đơn",
//     icon: LuHistory,
//     href: paths.statistics,
//   },

//   {
//     subject: "user",
//     action: "read",
//     title: "Quản lý nhân sự",
//     icon: FaUser,
//     href: paths.users,
//   },
//   {
//     subject: "manage_2fa_key",
//     action: "read",
//     title: "Quản lý 2FA KEY",
//     icon: TbAuth2Fa,
//     href: paths.manage2fakey,
//   },
//   {
//     subject: "team",
//     action: "read",
//     title: "Quản lý Team",
//     icon: TbUsersGroup,
//     href: paths.teams,
//   },
//   {
//     subject: "orther_provider",
//     action: "read",
//     title: "Quản lý nhà cung cấp",
//     icon: TbUsersGroup,
//     href: paths.provider,
//   },
//   {
//     subject: "role",
//     action: "read",
//     title: "Quản lý quyền hạn",
//     icon: SiParrotsecurity,
//     href: paths.roles,
//   },
//   // {
//   // 	subject: "brand",
//   // action: "read",
//   // 	title: "Quản lý hậu đài",
//   // 	icon: TbBrandDenodo,
//   // 	href: paths.brands,
//   // },
//   {
//     subject: "vps",
//     action: "create",
//     title: "Mua VPS",
//     icon: GrCloudComputer,
//     href: paths.buy_vps,
//   },
//   {
//     subject: "vps",
//     action: "read",
//     title: "Quản lý VPS",
//     icon: GrCloudComputer,
//     href: paths.vps_management,
//   },
//   {
//     subject: "server",
//     action: "read",
//     title: "Quản lý Server",
//     icon: GoServer,
//     href: paths.server,
//   },
//   {
//     subject: "cloudflare_api_key",
//     action: "read",
//     title: "Quản lý Cloudflare API Key",
//     icon: SiAmazonapigateway,
//     href: paths.cloudflare_api_key,
//   },
//   {
//     subject: "cloudflare",
//     action: "read",
//     title: "Quản lý Cloudflare",
//     icon: SiCloudflare,
//     href: paths.cloudflare,
//   },

//   {
//     subject: "invoice",
//     action: "read",
//     title: "Quản lý hóa đơn",
//     icon: LuHistory,
//     href: paths.invoices,
//   },

//     {
//         subject: 'account_vps',
//         action: 'read',
//         title: 'Quản lý tài khoản',
//         icon: MdOutlineLibraryBooks,
//         href: paths.accounts,
//     },
//     {
//         subject: 'transaction',
//         action: 'read',
//         title: 'Quản lý giao dịch',
//         icon: MdOutlineLibraryBooks,
//         href: paths.transaction,
//     },
//     {
//         subject: 'order',
//         action: 'read',
//         title: 'Quản lý đơn hàng',
//         icon: MdOutlineLibraryBooks,
//         href: paths.order,
//     },
//     {
//         subject: 'log',
//         action: 'read',
//         title: 'Quản lý Logs',
//         icon: MdOutlineLibraryBooks,
//         href: paths.logs,
//     },
//     {
//         subject: 'log_login',
//         action: 'read',
//         title: 'Quản lý log đăng nhập',
//         icon: IoLogoElectron,
//         href: paths.fingerprint,
//     },
//     {
//         subject: 'buy_domain',
//         action: 'read',
//         title: 'Mua Tên miền',
//         icon: MdMapsHomeWork,
//         href: paths.buy_domain,
//     },
//     {
//         subject: 'who_is_domain',
//         action: 'read',
//         title: 'Tra cứu tên miền',
//         icon: MdMapsHomeWork,
//         href: paths.who_is_domain,
//     },
//     {
//         subject: 'domain_provider',
//         action: 'read',
//         title: 'Quản lý đối tác',
//         icon: IoLogoElectron,
//         href: paths.domain_provider,
//     },
//     {
//         subject: SubjectEnum.ORDER_DOMAIN,
//         action: "read",
//         title: "Quản lý đơn hàng Domain",
//         icon: BsCart3,
//         href: paths.orders_domain,
//     },
//     {
//         subject: SubjectEnum.ORDER_DOMAIN_LOG,
//         action: 'read',
//         title: 'Quản lý log đơn hàng',
//         icon: IoLogoElectron,
//         href: paths.orders_domain_log,
//     },
//     {
//         subject: SubjectEnum.DOMAIN,
//         action: 'read',
//         title: 'Quản lý tên miền',
//         icon: GrDomain,
//         href: paths.domain,
//     },
// ];

// export default sidebars;

import paths from "@/routes/paths";
import { FaUser } from "react-icons/fa6";
import { GrCloudComputer, GrDomain } from "react-icons/gr";
import { LuHistory } from "react-icons/lu";
import { MdContentPasteSearch, MdMapsHomeWork, MdOutlineLibraryBooks, MdOutlinePublic } from "react-icons/md";
import {
  SiParrotsecurity,
  SiCloudflare,
  SiAmazonapigateway,
  SiStatuspal,
} from "react-icons/si";
import { TbUsersGroup } from "react-icons/tb";
import { GoServer } from "react-icons/go";
import { IoLogoElectron } from "react-icons/io5";
import { SubjectEnum } from "./enum";
import { BsCart3 } from "react-icons/bs";
// import { FaCloudflare } from "react-icons/fa";

const sidebarsCommon = [
  {
    subject: SubjectEnum.STATISTICS,
    action: "read",
    title: "Thống kê hóa đơn",
    icon: LuHistory,
    href: paths.statistics,
  },

  {
    subject: SubjectEnum.USER,
    action: "read",
    title: "Quản lý nhân sự",
    icon: FaUser,
    href: paths.users,
  },

  {
    subject: SubjectEnum.TEAM,
    action: "read",
    title: "Quản lý Team",
    icon: TbUsersGroup,
    href: paths.teams,
  },
  {
    subject: SubjectEnum.ROLE,
    action: "read",
    title: "Quản lý quyền hạn",
    icon: SiParrotsecurity,
    href: paths.roles,
  },
  {
    subject: SubjectEnum.LOG,
    action: "read",
    title: "Quản lý Logs",
    icon: MdOutlineLibraryBooks,
    href: paths.logs,
  },
  {
    subject: SubjectEnum.LOG_LOGIN,
    action: "read",
    title: "Quản lý log đăng nhập",
    icon: IoLogoElectron,
    href: paths.fingerprint,
  },
];

const sidebarsVps = [
  ...sidebarsCommon,
  {
    subject: SubjectEnum.OTHER_PROVIDER,
    action: "read",
    title: "Quản lý nhà cung cấp",
    icon: TbUsersGroup,
    href: paths.provider,
  },
  {
    subject: SubjectEnum.VPS,
    action: "create",
    title: "Mua VPS",
    icon: GrCloudComputer,
    href: paths.buy_vps,
  },
  {
    subject: SubjectEnum.VPS,
    action: "read",
    title: "Quản lý VPS",
    icon: GrCloudComputer,
    href: paths.vps_management,
  },
  {
    subject: SubjectEnum.SERVER,
    action: "read",
    title: "Quản lý Server",
    icon: GoServer,
    href: paths.server,
  },
  {
    subject: SubjectEnum.INVOICE,
    action: "read",
    title: "Quản lý hóa đơn",
    icon: LuHistory,
    href: paths.invoices,
  },
  {
    subject: SubjectEnum.ACCOUNTVPS,
    action: "read",
    title: "Quản lý tài khoản",
    icon: MdOutlineLibraryBooks,
    href: paths.accounts,
  },
  {
    subject: SubjectEnum.TRANSACTION,
    action: "read",
    title: "Quản lý giao dịch",
    icon: MdOutlineLibraryBooks,
    href: paths.transaction,
  },
  {
    subject: SubjectEnum.ORDER,
    action: "read",
    title: "Quản lý đơn hàng",
    icon: MdOutlineLibraryBooks,
    href: paths.order,
  },
];

const sidebarsDomain = [
  ...sidebarsCommon,
  {
    subject: SubjectEnum.CLOUDFLARE_API_KEY,
    action: "read",
    title: "Quản lý Cloudflare API Key",
    icon: SiAmazonapigateway,
    href: paths.cloudflare_api_key,
  },
  {
    subject: SubjectEnum.CLOUDFLARE,
    action: "read",
    title: "Quản lý Cloudflare",
    icon: SiCloudflare,
    href: paths.cloudflare,
  },
  {
	  subject: SubjectEnum.DOMAIN,
	  action: "create",
	  title: "Mua domain",
	  icon: MdContentPasteSearch,
	  href: paths.buy_domain,
  },
  {
	  subject: SubjectEnum.DOMAIN,
	  action: "create",
	  title: "Tra cứu domain",
	  icon: MdMapsHomeWork,
	  href: paths.who_is_domain,
  },
  {
	  subject: SubjectEnum.DOMAIN_PROVIDER,
	  action: "read",
	  title: "Quản lý nhà cung cấp domain",
	  icon: MdOutlinePublic,
	  href: paths.domain_provider,
  },
  {
    subject: SubjectEnum.DOMAIN,
    action: 'read',
    title: 'Quản lý domain',
    icon: GrDomain,
    href: paths.domain,
  },
  {
	  subject: SubjectEnum.ORDER_DOMAIN,
	  action: "read",
	  title: "Quản lý đơn hàng domain",
	  icon: BsCart3,
	  href: paths.orders_domain,
  },
  {
    subject: SubjectEnum.ORDER_DOMAIN_LOG,
    action: 'read',
    title: 'Quản lý log đơn hàng domain',
    icon: LuHistory,
    href: paths.orders_domain_log,
  },
  {
    subject: SubjectEnum.ORDER_DOMAIN_STATUS,
    action: 'read',
    title: 'Trạng thái đơn hàng domain',
    icon: SiStatuspal,
    href: paths.order_domain_status,
  },
];

export { sidebarsVps, sidebarsDomain };
