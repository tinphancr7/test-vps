import * as yup from "yup";

export enum SETTINGS_ENUM {
    ALWAYS_USE_HTTPS = "always_use_https",
    AUTOMATIC_HTTPS_REWRITES = "automatic_https_rewrites",
    BROWSER_CACHE_TTL = "browser_cache_ttl",
    BROWSER_CHECK = "browser_check",
    CACHE_DECEPTION_ARMOR = "cache_deception_armor",
    CACHE_LEVEL = "cache_level",
    DISABLE_APPS = "disable_apps",
    DISABLE_PERFORMANCE = "disable_performance",
    DISABLE_SECURITY = "disable_security",
    DISABLE_ZARAZ = "disable_zaraz",
    EDGE_CACHE_TTL = "edge_cache_ttl",
    EMAIL_OBFUSCATION = "email_obfuscation",
    FORWARDING_URL = "forwarding_url",
    IP_GEOLOCATION = "ip_geolocation",
    OPPORTUNISTIC_ENCRYPTION = "opportunistic_encryption",
    EXPLICIT_CACHE_CONTROL = "explicit_cache_control",
    ROCKET_LOADER = "rocket_loader",
    SSL = "ssl",
}

export const ACTIONS_EMPTY_VALUE = [
    SETTINGS_ENUM.ALWAYS_USE_HTTPS,
    SETTINGS_ENUM.DISABLE_APPS,
    SETTINGS_ENUM.DISABLE_PERFORMANCE,
    SETTINGS_ENUM.DISABLE_SECURITY,
    SETTINGS_ENUM.DISABLE_ZARAZ,
];

export const SETTING_OPTIONS = [
    { value: SETTINGS_ENUM.ALWAYS_USE_HTTPS, label: "Always Use HTTPS" },
    { value: SETTINGS_ENUM.AUTOMATIC_HTTPS_REWRITES, label: "Automatic HTTPS Rewrites" },
    { value: SETTINGS_ENUM.BROWSER_CACHE_TTL, label: "Browser Cache TTL" },
    { value: SETTINGS_ENUM.BROWSER_CHECK, label: "Browser Integrity Check" },
    { value: SETTINGS_ENUM.CACHE_DECEPTION_ARMOR, label: "Cache Deception Armor" },
    { value: SETTINGS_ENUM.CACHE_LEVEL, label: "Cache Level" },
    { value: SETTINGS_ENUM.DISABLE_APPS, label: "Disable Apps" },
    { value: SETTINGS_ENUM.DISABLE_PERFORMANCE, label: "Disable Performance" },
    { value: SETTINGS_ENUM.DISABLE_SECURITY, label: "Disable Security" },
    { value: SETTINGS_ENUM.DISABLE_ZARAZ, label: "Disable Zaraz" },
    { value: SETTINGS_ENUM.EDGE_CACHE_TTL, label: "Edge Cache TTL" },
    { value: SETTINGS_ENUM.EMAIL_OBFUSCATION, label: "Email Obfuscation" },
    { value: SETTINGS_ENUM.FORWARDING_URL, label: "Forwarding URL" },
    { value: SETTINGS_ENUM.IP_GEOLOCATION, label: "IP Geolocation Header" },
    { value: SETTINGS_ENUM.OPPORTUNISTIC_ENCRYPTION, label: "Opportunistic Encryption" },
    { value: SETTINGS_ENUM.EXPLICIT_CACHE_CONTROL, label: "Origin Cache Control" },
    { value: SETTINGS_ENUM.ROCKET_LOADER, label: "Rocket Loader" },
    { value: SETTINGS_ENUM.SSL, label: "SSL" },
];

const BROWSER_CACHE_TTL_OPTIONS = [
    { label: "2 minutes", value: "120" },
    { label: "5 minutes", value: "300" },
    { label: "20 minutes", value: "1200" },
    { label: "30 minutes", value: "1800" },
    { label: "an hour", value: "3600" },
    { label: "2 hours", value: "7200" },
    { label: "3 hours", value: "10800" },
    { label: "4 hours", value: "14400" },
    { label: "5 hours", value: "18000" },
    { label: "8 hours", value: "28800" },
    { label: "12 hours", value: "43200" },
    { label: "16 hours", value: "57600" },
    { label: "20 hours", value: "72000" },
    { label: "a day", value: "86400" },
    { label: "2 days", value: "172800" },
    { label: "3 days", value: "259200" },
    { label: "4 days", value: "345600" },
    { label: "5 days", value: "432000" },
    { label: "8 days", value: "691200" },
    { label: "16 days", value: "1382400" },
    { label: "24 days", value: "2073600" },
    { label: "a month", value: "2592000" },
    { label: "2 months", value: "5184000" },
    { label: "6 months", value: "15552000" },
    { label: "a year", value: "31536000" },
];

const CACHE_LEVEL_OPTIONS = [
    { value: "bypass", label: "Bypass" },
    { value: "basic", label: "No Query String" },
    { value: "simplified", label: "Ignore Query String" },
    { value: "aggressive", label: "Standard" },
    { value: "cache_everything", label: "Cache Everything" },
];

const EDGE_CACHE_TTL_OPTIONS = [
    { value: "7200", label: "2 hours" },
    { value: "10800", label: "3 hours" },
    { value: "14400", label: "4 hours" },
    { value: "18000", label: "5 hours" },
    { value: "28800", label: "8 hours" },
    { value: "43200", label: "12 hours" },
    { value: "57600", label: "16 hours" },
    { value: "72000", label: "20 hours" },
    { value: "86400", label: "a day" },
    { value: "172800", label: "2 days" },
    { value: "259200", label: "3 days" },
    { value: "345600", label: "4 days" },
    { value: "432000", label: "5 days" },
    { value: "518400", label: "6 days" },
    { value: "604800", label: "7 days" },
    { value: "1209600", label: "14 days" },
    { value: "2592000", label: "a month" },
];

const STATUS_CODE_FORWARDING_URL = [
    { value: "301", label: "301 - Permanent Redirect" },
    { value: "302", label: "302 - Temporary Redirect" },
];

const SSL_TLS_ENCRYPTION_MODE_OPTIONS = [
    { value: "off", label: "Off" },
    { value: "flexible", label: "Flexible" },
    { value: "full", label: "Full" },
    { value: "strict", label: "Strict" },
];

const ACTION_FIELD = {
    action: {
        label: "Chọn một cài đặt",
        type: "select",
        value: SETTING_OPTIONS[0]?.value,
        errorMessage: "",
        isRequire: true,
        options: SETTING_OPTIONS,
    },
};

const FORM_PAGE_RULES_AUTOMATIC_HTTPS_REWRITES = {
    value: {
        label: "Automatic HTTPS Rewrites",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_BROWSER_CACHE_TTL = {
    value: {
        label: "Enter Browser Cache TTL",
        type: "select",
        value: BROWSER_CACHE_TTL_OPTIONS[0]?.value,
        errorMessage: "",
        isRequire: true,
        options: BROWSER_CACHE_TTL_OPTIONS,
    },
};

const FORM_PAGE_RULES_BROWSER_INTEGRITY_CHECK = {
    value: {
        label: "Browser Integrity Check",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_CACHE_DECEPTION_ARMOR = {
    value: {
        label: "Cache Deception Armor",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_CACHE_LEVEL = {
    value: {
        label: "Select Cache Level",
        type: "select",
        value: CACHE_LEVEL_OPTIONS[0]?.value,
        errorMessage: "",
        isRequire: true,
        options: CACHE_LEVEL_OPTIONS,
    },
};

const FORM_PAGE_RULES_EDGE_CACHE_TTL = {
    value: {
        label: "Enter Edge Cache TTL",
        type: "select",
        value: EDGE_CACHE_TTL_OPTIONS[0]?.value,
        errorMessage: "",
        isRequire: true,
        options: EDGE_CACHE_TTL_OPTIONS,
    },
};

const FORM_PAGE_RULES_EMAIL_OBFUSCATION = {
    value: {
        label: "Email Obfuscation",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_FORWARDING_URL = {
    status_code: {
        label: "Select status code",
        type: "select",
        value: STATUS_CODE_FORWARDING_URL[0]?.value,
        errorMessage: "",
        isRequire: true,
        options: STATUS_CODE_FORWARDING_URL,
    },
    url: {
        label: "Enter destination URL",
        placeholder: "Enter destination URL...",
        type: "text",
        value: "",
        errorMessage: "",
        isRequire: true,
    },
};

const FORM_PAGE_RULES_IP_GEOLOCATION_HEADER = {
    value: {
        label: "IP Geolocation Header",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_OPPORTUNISTIC_ENCRYPTION = {
    value: {
        label: "Opportunistic Encryption",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_ORIGIN_CACHE_CONTROL = {
    value: {
        label: "Origin Cache Control",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_ROCKET_LOADER = {
    value: {
        label: "Rocket Loader",
        type: "switch",
        value: false,
        errorMessage: "",
        isRequire: false,
    },
};

const FORM_PAGE_RULES_SSL = {
    value: {
        label: "Select SSL/TLS encryption mode",
        type: "select",
        value: SSL_TLS_ENCRYPTION_MODE_OPTIONS[0]?.value,
        errorMessage: "",
        isRequire: true,
        options: SSL_TLS_ENCRYPTION_MODE_OPTIONS,
    },
};

export const FORM_PAGE_RULES = {
    always_use_https: ACTION_FIELD,
    automatic_https_rewrites: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_AUTOMATIC_HTTPS_REWRITES,
    },
    browser_cache_ttl: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_BROWSER_CACHE_TTL,
    },
    browser_check: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_BROWSER_INTEGRITY_CHECK,
    },
    cache_deception_armor: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_CACHE_DECEPTION_ARMOR,
    },
    cache_level: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_CACHE_LEVEL,
    },
    disable_apps: ACTION_FIELD,
    disable_performance: ACTION_FIELD,
    disable_security: ACTION_FIELD,
    disable_zaraz: ACTION_FIELD,
    edge_cache_ttl: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_EDGE_CACHE_TTL,
    },
    email_obfuscation: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_EMAIL_OBFUSCATION,
    },
    forwarding_url: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_FORWARDING_URL,
    },
    ip_geolocation: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_IP_GEOLOCATION_HEADER,
    },
    opportunistic_encryption: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_OPPORTUNISTIC_ENCRYPTION,
    },
    explicit_cache_control: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_ORIGIN_CACHE_CONTROL,
    },
    rocket_loader: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_ROCKET_LOADER,
    },
    ssl: {
        ...ACTION_FIELD,
        ...FORM_PAGE_RULES_SSL,
    },
};

export const arraySchema = yup.array().of(
    yup.object().shape({
        action: yup.string().required("Trường này không được bỏ trống!"),
        value: yup.string().required("Trường này không được bỏ trống!"),
    })
);

export const forwardingUrlSchema = yup.array().of(
    yup.object({
        action: yup.string().required("Trường này không được bỏ trống!"),
        status_code: yup.string().required("Trường này không được bỏ trống!"),
        url: yup.string().required("Trường này không được bỏ trống!"),
    })
);

export const defaultSchema = yup.object({
    actions: arraySchema.default([]), // Đảm bảo giá trị mặc định là mảng rỗng
});

// Giá trị mặc định
export const defaultValues = {
    actions: [
        {
            action: SETTING_OPTIONS[0]?.value || "", // Đảm bảo luôn có giá trị hợp lệ
            value:
                (FORM_PAGE_RULES as any)[SETTING_OPTIONS[0]?.value]?.value ||
                "",
        },
    ],
};
