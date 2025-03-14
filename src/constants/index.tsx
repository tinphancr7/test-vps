import { FaShieldAlt } from "react-icons/fa";
import { FaRecycle } from "react-icons/fa";
const actions = [
  {
    key: "create",
    value: "Create",
  },
  {
    key: "delete",
    value: "Delete",
  },
  {
    key: "read",
    value: "read",
  },
  {
    key: "update",
    value: "Update",
  },
  {
    key: "login",
    value: "Login",
  },
  {
    key: "register",
    value: "Register",
  },
  {
    key: "change_password",
    value: "Change password",
  },
];

const subjects = [
  {
    key: "all",
    value: "All",
  },
  {
    key: "user",
    value: "User",
  },
  {
    key: "role",
    value: "Role",
  },
  {
    key: "team",
    value: "Team",
  },
  {
    key: "log",
    value: "Log",
  },
  {
    key: "brand",
    value: "Brand",
  },
  {
    key: "provider",
    value: "Provider",
  },
  {
    key: "account_vps",
    value: "Account - Vps",
  },
  {
    key: "vps",
    value: "Vps",
  },
  {
    key: "invoice",
    value: "Invoice",
  },
  {
    key: "statistics",
    value: "Statistics",
  },
  {
    key: "billing_digital_ocean",
    value: "Bill Digital Ocean",
  },
];

const initPropsAutoComplete = {
  classNames: {
    inputWrapper:
      "group-data-[open=true]:border-primary border group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
    input: "font-medium text-foreground-500",
  },
};

const classNamesAutoComplete = {
  base: "max-w-100",
};
const exchangeRateVNG = 26000;
const exchangeRateVST = 26000;

const listZones = [
  {
    label: "PARIS 1",
    value: "fr-par-1",
    url: "/imgs/flag/france.svg",
  },
  {
    label: "PARIS 2",
    value: "fr-par-2",
    url: "/imgs/flag/france.svg",
    subicon: <FaRecycle color="#34a8ff" size={24} />,
  },
  {
    label: "PARIS 3",
    value: "fr-par-3",
    url: "/imgs/flag/france.svg",
    subicon: <FaShieldAlt color="#34a8ff" size={24} />,
  },
  {
    label: "AMSTERDAM 1",
    value: "nl-ams-1",
    url: "/imgs/flag/netherland.svg",
    subicon: <FaRecycle color="#34a8ff" size={24} />,
  },
  {
    label: "AMSTERDAM 2",
    value: "nl-ams-2",
    url: "/imgs/flag/netherland.svg",
    subicon: <FaRecycle color="#34a8ff" size={24} />,
  },
  {
    label: "AMSTERDAM 3",
    value: "nl-ams-3",
    url: "/imgs/flag/netherland.svg",
    subicon: <FaRecycle color="#34a8ff" size={24} />,
  },

  {
    label: "WARSAW 1",
    value: "pl-waw-1",
    url: "/imgs/flag/poland.svg",
    subicon: <FaRecycle color="#34a8ff" size={24} />,
  },
  {
    label: "WARSAW 2",
    value: "pl-waw-2",
    url: "/imgs/flag/poland.svg",
    subicon: <FaRecycle color="#34a8ff" size={24} />,
  },
  {
    label: "WARSAW 3",
    value: "pl-waw-3",
    url: "/imgs/flag/poland.svg",
    subicon: <FaRecycle color="#34a8ff" size={24} />,
  },
];
const osOptions = [
  {
    name: "Ubuntu",
    logoUrl: "/icon_scaleway_image/ubuntu.png",
    versions: [
      { label: "Ubuntu 24.04 Noble Numbat", value: "ubuntu_noble" },
      { label: "Ubuntu 22.04 Jammy Jellyfish", value: "ubuntu_jammy" },
      { label: "Ubuntu 20.04 Focal Fossa", value: "ubuntu_focal" },
    ],
    version: { label: "Ubuntu 24.04 Noble Numbat", value: "ubuntu_noble" },
    disabled: false,
    menuKey: "os",
  },
  {
    name: "Debian",
    logoUrl: "/icon_scaleway_image/debian.png",
    versions: [
      {
        label: "Debian 12 (Bookworm)",
        value: "debian_bookworm",
      },
      {
        label: "Debian 11 (Bullseye)",
        value: "debian_bullseye",
      },
    ],

    version: { label: "Debian 12 (Bookworm)", value: "debian_bookworm" },
    disabled: false,
    menuKey: "os",
  },
  {
    name: "Centos",
    logoUrl: "/icon_scaleway_image/centos.png",
    versions: [
      {
        label: "CentOS Stream 9",
        value: "centos_stream_9",
      },
    ],
    version: { label: "CentOS Stream 9", value: "centos_stream_9" },
    disabled: false,
    menuKey: "os",
  },
  {
    name: "Fedora",
    logoUrl: "/icon_scaleway_image/fedora.png",
    versions: [
      {
        label: "Fedora 41",
        value: "fedora_41",
      },
      {
        label: "Fedora 40",
        value: "fedora_40",
      },
      {
        label: "Fedora 39",
        value: "fedora_39",
      },
    ],

    version: { label: "Fedora 41", value: "fedora_41" },
    disabled: false,
    menuKey: "os",
  },
  {
    name: "Rockylinux",
    logoUrl: "/icon_scaleway_image/rockylinux.png",
    versions: [
      {
        label: "Rocky Linux 9",
        value: "rockylinux_9",
      },
      {
        label: "Rocky Linux 8",
        value: "rockylinux_8",
      },
    ],
    version: { label: "Rocky Linux 9", value: "rockylinux_9" },
    disabled: false,
    menuKey: "os",
  },
  {
    name: "Almalinux",
    logoUrl: "/icon_scaleway_image/almalinux.png",
    versions: [
      {
        label: "AlmaLinux 9",
        value: "almalinux_9",
      },
      {
        label: "AlmaLinux 8",
        value: "almalinux_8",
      },
    ],
    version: { label: "AlmaLinux 9", value: "almalinux_9" },
    disabled: false,
    menuKey: "os",
  },
  {
    name: "Windows",
    logoUrl: "/icon_scaleway_image/microsoft_windows_server.png",
    versions: [
      {
        label: "Windows Server 2022",
        value: "windows_server_2022",
      },
      {
        label: "Windows Server 2019",
        value: "windows_server_2019",
      },
    ],

    disabled: true,
    menuKey: "os",
  },
  {
    name: "Ubuntu",
    key: "ubuntu_noble",
    logoUrl: "/icon_scaleway_image/ubuntu.png",
    menuKey: "gpu",
    disabled: true,
  },
  {
    name: "Docker",
    key: "docker",
    logoUrl: "/icon_scaleway_image/docker.png",
    version: {
      label: "Docker",
      value: "docker",
    },
    menuKey: "ia",
    disabled: false,
  },
  {
    name: "Wordpress",
    key: "wordpress",
    logoUrl: "/icon_scaleway_image/wordpress.png",
    version: {
      label: "Wordpress",
      value: "wordpress",
    },
    menuKey: "ia",
    disabled: false,
  },
  {
    name: "OpenVPN",
    key: "openvpn",
    logoUrl: "/icon_scaleway_image/openvpn.png",
    version: {
      label: "OpenVPN",
      value: "openvpn",
    },
    menuKey: "ia",
    disabled: false,
  },
  {
    name: "Gitlab",
    key: "gitLab",
    logoUrl: "/icon_scaleway_image/gitlab.png",
    version: {
      label: "Gitlab",
      value: "gitlab",
    },
    menuKey: "ia",
    disabled: false,
  },
  {
    name: "Nextcloud",
    key: "nextcloud",
    logoUrl: "/icon_scaleway_image/nextcloud.png",
    version: {
      label: "Nextcloud",
      value: "nextcloud",
    },
    menuKey: "ia",
    disabled: false,
  },
];
const uris = [
  {
    label: "wildcard",
    value: "wildcard",
  },
  {
    label: "strict wildcard",
    value: "strict wildcard",
  },
  {
    label: "equals",
    value: "eq",
  },
  {
    label: "does not equal",
    value: "ne",
  },
  {
    label: "contains",
    value: "contains",
  },
  {
    label: "does not contains",
    value: "not contains",
  },
  {
    label: "matches regex",
    value: "matches",
  },
  {
    label: "does not matches regex",
    value: "not matches",
  },
  {
    label: "starts with",
    value: "starts_with",
  },
  {
    label: "does not starts with",
    value: "not starts_with",
  },
  {
    label: "ends with",
    value: "ends_with",
  },
  {
    label: "does not ends with",
    value: "not ends_with",
  },
];

const nums = [
  {
    label: "equals",
    value: "eq",
  },
  {
    label: "does not equal",
    value: "ne",
  },
  {
    label: "greater than",
    value: "gt",
  },
  {
    label: "less than",
    value: "lt",
  },
  {
    label: "greater than or equal to",
    value: "ge",
  },
  {
    label: "less than or equal to",
    value: "le",
  },

  {
    label: "is in",
    value: "in",
  },
  { label: "is not in", value: "not in" },
];

const reqs = [
  {
    label: "equals",
    value: "eq",
  },
  {
    label: "does not equal",
    value: "ne",
  },
  { label: "is in", value: "in" },
  { label: "is not in", value: "not in" },
];

const ruleFields = [
  {
    label: "URI Full",
    value: "http.request.full_uri",
    operators: uris,
  },
  {
    label: "URI",
    value: "http.request.full",
    operators: uris,
  },
  {
    label: "URI Path",
    value: "http.request.full_path",
    operators: [...uris, { label: "is in", value: "in" }, { label: "is not in", value: "not in" }],
  },
  {
    label: "URI Query String",
    value: "http.request.uri.query",
    operators: uris,
  },
  {
    label: "AS Num",
    value: "ip.src.asnum",
    operators: nums,
  },
  {
    label: "Cookie",
    value: "http.cookie",
    operators: uris,
  },
  {
    label: "Country",
    value: "ip.src.country",
    operators: reqs,
  },
  {
    label: "Continent",
    value: "ip.src.continent",
    operators: reqs,
  },
  {
    label: "Hostname",
    value: "http.host",
    operators: [...uris, { label: "is in", value: "in" }, { label: "is not in", value: "not in" }],
  },
  {
    label: "IP Source Address",
    value: "ip.src",
    operators: [
      {
        label: "equals",
        value: "eq",
      },
      {
        label: "does not equal",
        value: "ne",
      },
      { label: "is in", value: "in" },
      { label: "is not in", value: "not in" },
      { label: "is in list", value: "in $" },
      { label: "is not in", value: "not in $" },
    ],
  },
  {
    label: "Referer",
    value: "http.referer",
    operators: uris,
  },
  {
    label: "Request Method",
    value: "http.request.method",
    operators: reqs,
  },
  {
    label: "SSL/HTTPS",
    value: "ssl",
  },
  {
    label: "HTTP Version",
    value: "http.request.version",
    operators: reqs,
  },
  {
    label: "User Agent",
    value: "http.user_agent",
    operators: uris,
  },
  {
    label: "X-Forwarded-For",
    value: "http.x_forwarded_for",
    operators: uris,
  },
  {
    label: "Client Certificate Verified",
    value: "cf.tls_client_auth.cert_verified",
  },
  {
    label: "Disposable email check",
    value: "cf.fraud_detection.disposable_email",
  },
  {
    label: "Threat Score",
    value: "cf.threat_score",
    operators: nums,
  },
  {
    label: "MIME Type",
    value: "http.request.body.mime",
    operators: [...uris, { label: "is in", value: "in" }, { label: "is not in", value: "not in" }],
  },
  {
    label: "Header",
    value: "http.request.headers",
  },
  {
    label: "Cookie value of",
    value: "cf.fraud_detection.disposable_email",
  },
  {
    label: "Password Leaked",
    value: "cf.waf.credential_check.password_leaked",
  },
  {
    label: "Fallthrough Detected",
    value: "cf.api_gateway.fallthrough_detected",
  },
];

const ruleOperators = [
  {
    label: "wildcard",
    value: "wildcard",
  },
  {
    label: "strict wildcard",
    value: "strict wildcard",
  },
  {
    label: "equals",
    value: "eq",
  },
  {
    label: "does not equal",
    value: "ne",
  },
  {
    label: "contains",
    value: "contains",
  },
  {
    label: "does not contains",
    value: "not contains",
  },
  {
    label: "matches regex",
    value: "matches",
  },
  {
    label: "does not matches regex",
    value: "not matches",
  },
  {
    label: "Less than",
    value: "lt",
  },
  {
    label: "Less than or equal",
    value: "le",
  },
  {
    label: "Greater than or equal",
    value: "ge",
  },
  {
    label: "is in",
    value: "in",
  },
];

const ruleActions = [
  { label: "Managed Challenge", value: "managed_challenge" },
  { label: "Block", value: "block" },
  { label: "JS Challenge", value: "js_challenge" },
  { label: "Skip", value: "skip" },
  { label: "Interactive Challenge", value: "interactive_challenge" },
];

const ruleActionObj = {
  managed_challenge: "Managed Challenge",
  block: "Block",
  js_challenge: "JS Challenge",
  skip: "Skip",
  interactive_challenge: "Interactive Challenge",
};

const ruleOrders = [
  { label: "First", value: "first" },
  { label: "Last", value: "last" },
  { label: "Custom", value: "custom" },
];

const ROLE_TO_PHO = "679385e5080eb9fecd859d6d";
const domainFields: {
  [key: string]: {
    [key: string]: any;
  };
} = {
  dynadot: {
    title: {
      isRequired: false,
    },
    name: {
      isRequired: true,
    },
    exchangeRate: {
      isRequired: true,
    },
    teams: {
      isRequired: true,
    },
    apiKey: {
      isRequired: true,
    },
    isOpen: {
      isRequired: true,
    },
  },
  gname: {
    title: {
      isRequired: false,
    },
    name: {
      isRequired: true,
    },
    exchangeRate: {
      isRequired: true,
    },
    teams: {
      isRequired: true,
    },
    secret: true,
    apiKey: {
      isRequired: true,
    },
    isOpen: {
      isRequired: true,
    },
  },
  name: {
    title: {
      isRequired: false,
    },
    name: {
      isRequired: true,
    },
    username: true,
    exchangeRate: {
      isRequired: true,
    },
    teams: {
      isRequired: true,
    },
    isOpen: {
      isRequired: true,
    },
    apiKey: {
      isRequired: true,
      width: "col-span-2",
    },
  },
  epik: {
    title: {
      isRequired: false,
    },
    name: {
      isRequired: true,
    },
    exchangeRate: {
      isRequired: true,
    },
    teams: {
      isRequired: true,
    },
    apiKey: {
      isRequired: true,
    },
    isOpen: {
      isRequired: true,
    },
  },
  godaddy: {
    title: {
      isRequired: false,
    },
    name: {
      isRequired: true,
    },

    exchangeRate: {
      isRequired: true,
    },

    teams: {
      isRequired: true,
    },
    secret: {
      isRequired: true,
    },
    apiKey: {
      isRequired: true,
    },
    isOpen: {
      isRequired: true,
    },
  },
  "name-cheap": {
    title: {
      isRequired: false,
    },
    name: {
      isRequired: true,
    },
    username: {
      isRequired: true,
    },
    exchangeRate: {
      isRequired: true,
    },
    secret: {
      isRequired: true,
    },
    apiKey: {
      isRequired: true,
    },
    teams: {
      isRequired: true,
    },
    firstName: {
      isRequired: true,
    },
    lastName: {
      isRequired: true,
    },
    address: {
      isRequired: true,
    },
    state: {
      isRequired: true,
    },
    zip: {
      isRequired: true,
    },
    country: {
      isRequired: true,
    },
    phone: {
      isRequired: true,
    },
    email: {
      isRequired: true,
    },
    city: {
      isRequired: true,
    },
    isOpen: {
      isRequired: true,
    },
  },
};
export {
  ROLE_TO_PHO,
  actions,
  subjects,
  initPropsAutoComplete,
  classNamesAutoComplete,
  exchangeRateVNG,
  exchangeRateVST,
  listZones,
  osOptions,
  ruleFields,
  ruleOperators,
  ruleActions,
  ruleOrders,
  ruleActionObj,
  domainFields,
};
