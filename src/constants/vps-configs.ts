import { TbRecycle, TbUsersGroup } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import { GrSystem } from "react-icons/gr";
import { IconType } from "react-icons";
// import { SlWallet } from "react-icons/sl";
// import { IoBookOutline } from "react-icons/io5";

export enum VPS_CONFIG {
    CYCLE_TIME = "cycle-time",
    CONFIG = "config-vps",
    OS = "operating-system",
    DOMAIN = "domain",
    TEAM = "team",
    // PAY_METH = "payment-method",
    // REGULATIONS = "regulations",
}

interface VpsConfigStep {
    key: VPS_CONFIG;
    label: string;
    icon: IconType;
}

export const VPS_CONFIG_STEPS: Array<VpsConfigStep> = [
    // Team
    {
        key: VPS_CONFIG.TEAM,
        label: "Team",
        icon: TbUsersGroup,
    },
    
    // Chọn chu kỳ thanh toán
    {
        key: VPS_CONFIG.CYCLE_TIME,
        label: "Chọn chu kỳ thanh toán",
        icon: TbRecycle,
    },

    // Thiết lập
    {
        key: VPS_CONFIG.CONFIG,
        label: "Thiết lập",
        icon: FiSettings,
    },

    // Hệ điều hành
    {
        key: VPS_CONFIG.OS,
        label: "Hệ điều hành",
        icon: GrSystem,
    },
    /*
        // Chọn phương thức thanh toán
        {
            key: VPS_CONFIG.PAY_METH,
            label: "Chọn phương thức thanh toán",
            icon: SlWallet,
        },

        // Quy định sử dụng dịch vụ
        {
            key: VPS_CONFIG.REGULATIONS,
            label: "Quy định sử dụng dịch vụ",
            icon: IoBookOutline,
        },
    */
];