const asiaPacificChinaRegionIds = [
    "cn-qingdao",
    "cn-beijing",
    "cn-zhangjiakou",
    "cn-huhehaote",
    "cn-wulanchabu",
    "cn-hangzhou",
    "cn-shanghai",
    "cn-nanjing",
    "cn-shenzhen",
    "cn-heyuan",
    "cn-guangzhou",
    "cn-fuzhou",
    "cn-chengdu",
    "cn-hongkong",
];

const asiaPacificOthersRegionIds = [
    "ap-northeast-1",
    "ap-northeast-2",
    "ap-southeast-1",
    "ap-southeast-3",
    "ap-southeast-6",
    "ap-southeast-5",
    "ap-southeast-7",
];

const europeAndAmericasRegionIds = [
    "us-east-1",
    "us-west-1",
    "eu-west-1",
    "eu-central-1",
];

const middleEastRegionIds = [
    "me-east-1",
];

const othersRegionIds = [
    "me-central-1"
];

export const regionTabs = [
    {
        key: "asia-pacific-china",
        label: "Châu Á Thái Bình Dương Trung Quốc",
        regionList: asiaPacificChinaRegionIds,
    },
    {
        key: "asia-pacific-others",
        label: "Châu Á Thái Bình Dương Khác",
        regionList: asiaPacificOthersRegionIds,
    },
    {
        key: "europe-and-americas",
        label: "Châu Âu và Châu Mỹ",
        regionList: europeAndAmericasRegionIds,
    },
    {
        key: "middle-east",
        label: "Trung Đông",
        regionList: middleEastRegionIds,
    },
    {
        key: "others",
        label: "Khác",
        regionList: othersRegionIds,
    },
];

export const BILL_METHODS = [
    { label: "Subscription", "value": "PrePaid", isDisabled: false },
    { label: "Pay-as-you-go", value: "PostPaid", isDisabled: true },
];

export const publicPlatform = {
    Aliyun: {
        icon: "alibaba-cloud-linux.png",
        name: "Alibaba Cloud Linux",
    },
    Anolis: {
        icon: "anolis-os-icon.webp",
        name: "Anolis OS",
    },
    CentOS: {
        icon: "centos-icon.png",
        name: "CentOS",
    },
    "Windows Server": {
        icon: "windows-server.png",
        name: "Windows Server",
    },
    SUSE: {
        icon: "suse-linux-icon.png",
        name: "SUSE Linux",
    },
    "Red Hat": {
        icon: "red-hat-icon.png",
        name: "Red Hat",
    },
    Ubuntu: {
        icon: "ubuntu.png",
        name: "Ubuntu",
    },
    Debian: {
        icon: "debian.png",
        name: "Debian",
    },
    Fedora: {
        icon: "fedora-icon.png",
        name: "Fedora",
    },
    openSUSE: {
        icon: "opensuse.png",
        name: "Open SUSE",
    },
    "Rocky Linux": {
        icon: "rocky-linux-icon.png",
        name: "Rocky Linux",
    },
    "CentOS Stream": {
        icon: "centos-icon.png",
        name: "CentOS Stream",
    },
    AlmaLinux: {
        icon: "alma-linux.png",
        name: "AlmaLinux",
    },
    "Fedora CoreOS": {
        icon: "fedora-core-os-icon.png",
        name: "Fedora CoreOS",
    },
    Freebsd: {
        icon: "freebsd.png",
        name: "FreeBSD",
    },
    Gentoo: {
        icon: "gentoo-os-icon.png",
        name: "Gentoo",
    },
};

export const performanceLevelsList = [
    { value: "PL0", label: "PL0 (up to 10,000 IOPS per disk)" },
    { value: "PL1", label: "PL1 (up to 50,000 IOPS per disk)" },
    { value: "PL2", label: "PL2 (up to 100,000 IOPS per disk)" },
    { value: "PL3", label: "PL3 (up to 1,000,000 IOPS per disk)" },
];

export const INTERNET_BILL_METHODS = [
    { value: "PayByBandwidth", label: "Pay-by-bandwidth", isDisabled: false },
    { value: "PayByTraffic", label: "Pay-by-traffic", isDisabled: false },
];

export const MAX_BANDWIDTH = 200;
export const BANDWIDTH_OPTIONS = ["1", "2", "3", "5", "10", "50", "100", "200"];

export const LOGON_CREDENTIAL_OPTIONS = [
    { value: "password", label: "Mật khẩu tùy chình" },
    // { value: "keypair", label: "Key Pair" },
]