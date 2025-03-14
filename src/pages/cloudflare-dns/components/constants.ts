export const TYPE_DNS_OPTIONS = [
    "A",
    "AAAA",
    "CAA",
    "CERT",
    "CNAME",
    "DNSKEY",
    "DS",
    "HTTPS",
    "LOC",
    "MX",
    "NAPTR",
    "NS",
    "PTR",
    "SMIMEA",
    "SRV",
    "SSHFP",
    "SVCB",
    "TLSA",
    "TXT",
    "URI",
];

export const TTL_OPTIONS = [
    { 
        value: "1", 
        label: "Auto" 
    },
    { 
        value: "60", 
        label: "1 min" 
    },
    { 
        value: "120", 
        label: "2 min" 
    },
    { 
        value: "300", 
        label: "5 min" 
    },
    { 
        value: "600", 
        label: "10 min" 
    },
    { 
        value: "900", 
        label: "15 min" 
    },
    { 
        value: "1800", 
        label: "30 min" 
    },
    { 
        value: "3600", 
        label: "1 hr" 
    },
    { 
        value: "7200", 
        label: "2 hr" 
    },
    { 
        value: "18000", 
        label: "5 hr" 
    },
    { 
        value: "43200", 
        label: "12 hr" 
    },
    { 
        value: "86400", 
        label: "1 day" 
    },
];

export const TAG_CAA_OPTIONS = [
    { label: "Only allow specific hostnames", value: "issue" },
    { label: "Only allow wildcards", value: "issuewild" },
    { label: "Send violation reports to URL (http:, https:, or mailto:)", value: "iodef" },
];

export const PROTOCOL_DNSKEY_OPTIONS = [
    { label: "3 - DNSSEC", value: "3" },
];

export const DIGEST_TYPE_DS_OPTIONS = [
    { label: "1 - SHA-1", value: "1" },
    { label: "2 - SHA-256", value: "2" },
    { label: "3 - GOST R 34,11-94", value: "3" },
    { label: "4 - SHA-384", value: "4" },
];

export const DIRECTION_LATITUDE_LOC_OPTIONS = [
    { label: 'North', value: "N" },
    { label: 'South', value: "S" },
];

export const DIRECTION_LONGITUDE_LOC_OPTIONS = [
    { label: 'East', value: "E" },
    { label: 'West', value: "W" },
];

export const FORM_DNS_TYPE_A = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    content: {
		label: "IPv4 address",
        placeholder: "Enter your IPV4...",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    proxied: {
		label: "Proxy status",
		type: "switch",
		value: false,
		errorMessage: "",
		isRequire: false,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
};

export const FORM_DNS_TYPE_AAAA = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    content: {
		label: "IPv6 address",
        placeholder: "Enter your IPV6...",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    proxied: {
		label: "Proxy status",
		type: "switch",
		value: false,
		errorMessage: "",
		isRequire: false,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
};

export const FORM_DNS_TYPE_CAA = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    flags: {
		label: "Flags",
        placeholder: "Flags...",
		type: "number",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    tag: {
		label: "Tag",
		type: "select",
		value: new Set([TAG_CAA_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TAG_CAA_OPTIONS,
	},
    value: {
		label: "CA domain name",
        placeholder: "CA domain name...",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
};

export const FORM_DNS_TYPE_CERT = {
	name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    type: {
		label: "Cert. type",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    key_tag: {
		label: "Key tag",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    algorithm: {
		label: "Algorithm",
        placeholder: "0 - 255",
		type: "count",
		max: "255",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    certificate: {
		label: "Certificate (Base64)",
        placeholder: "E.g. TEpBNFYyTGtWUVpsTHpaa0htQXVPd0...wxREdCM3BRTTNWbUwyVlRNNERKWg==",
		type: "textarea",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
}

export const FORM_DNS_TYPE_CNAME = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    content: {
		label: "Target",
        placeholder: "E.g. www.example.com",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    proxied: {
		label: "Proxy status",
		type: "switch",
		value: false,
		errorMessage: "",
		isRequire: false,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
};

export const FORM_DNS_TYPE_DNSKEY = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    flags: {
		label: "Flags",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    protocol: {
		label: "Protocol",
		type: "select",
		value: new Set([PROTOCOL_DNSKEY_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: PROTOCOL_DNSKEY_OPTIONS,
	},
    algorithm: {
		label: "Algorithm",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    public_key: {
		label: "Public Key (Base64)",
        placeholder: "E.g. TEpBNFYyTGtWUVpsTHpaa0htQXVPd0...wxREdCM3BRTTNWbUwyVlRNNERKWg==",
		type: "textarea",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
};

export const FORM_DNS_TYPE_DS = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    key_tag: {
		label: "Key tag",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    algorithm: {
		label: "Algorithm",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    digest_type: {
		label: "Digest Type",
		type: "select",
		value: new Set([DIGEST_TYPE_DS_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: DIGEST_TYPE_DS_OPTIONS,
	},
    digest: {
		label: "Digest (hexadecimal)",
        placeholder: "E.g. 436c6f7564666c...61726520444e53",
		type: "textarea",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
};

export const FORM_DNS_TYPE_HTTPS = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    priority: {
		label: "Priority",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    target: {
		label: "Target",
        placeholder: "Target...",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
    value: {
		label: "Target",
        placeholder: 'E.g. alpn="h3,h2" ipv4hint="127.0.0.1" ipv6hint="::1"',
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
};

export const FORM_DNS_TYPE_LOC = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    lat_degrees: {
		label: "Degrees",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    lat_minutes: {
		label: "Minutes",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    lat_seconds: {
		label: "Seconds",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    lat_direction: {
		label: "Direction",
		type: "select",
		value: new Set([DIRECTION_LATITUDE_LOC_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: DIRECTION_LATITUDE_LOC_OPTIONS,
	},
    long_degrees: {
		label: "Degrees",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    long_minutes: {
		label: "Minutes",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    long_seconds: {
		label: "Seconds",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    long_direction: {
		label: "Direction",
		type: "select",
		value: new Set([DIRECTION_LONGITUDE_LOC_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: DIRECTION_LONGITUDE_LOC_OPTIONS,
	},
    precision_horz: {
		label: "Horizontal",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    precision_vert: {
		label: "Horizontal",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    altitude: {
		label: "Altitude",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
    size: {
		label: "Size",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
};

export const FORM_DNS_TYPE_MX = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    content: {
		label: "Mail server",
        placeholder: "E.g. mx1.example.com",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    priority: {
		label: "Priority",
		type: "count",
		value: 0,
		errorMessage: "",
		isRequire: false,
	},
};

export const FORM_DNS_TYPE_NAPTR = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    order: {
		label: "Order",
		type: "count",
        placeholder: "0 - 65535",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    preference: {
		label: "Preference",
		type: "count",
        placeholder: "0 - 65535",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    flags: {
		label: "Flags",
		type: "text",
        placeholder: "S, A, U, P",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    service: {
		label: "Service",
		type: "text",
        placeholder: "E.g. protocol=...",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    regex: {
		label: "Service",
		type: "text",
        placeholder: "E.g. delim-char=...",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    replacement: {
		label: "Service",
		type: "text",
        placeholder: "Replacement...",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
};

export const FORM_DNS_TYPE_NS = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    content: {
		label: "Nameserver",
        placeholder: "E.g. ns1.example.com",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
};

export const FORM_DNS_TYPE_PTR = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    content: {
		label: "Domain name",
        placeholder: "E.g. www.example.com",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
};

export const FORM_DNS_TYPE_SMIMEA = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    usage: {
		label: "Usage",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    selector: {
		label: "Selector",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    matching_type: {
		label: "Matching",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    certificate: {
		label: "Certificate (hexadecimal)",
        placeholder: "E.g. 436c6f7564666c...61726520444e53",
		type: "textarea",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
};

export const FORM_DNS_TYPE_SRV = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    priority: {
		label: "Priority",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    weight: {
		label: "Weight",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    port: {
		label: "Port",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    target: {
		label: "Target",
        placeholder: "E.g. www.example.com",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
};

export const FORM_DNS_TYPE_SSHFP = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    algorithm: {
		label: "Algorithm",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    type: {
		label: "Type",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    fingerprint: {
		label: "Fingerprint (hexadecimal)",
        placeholder: "E.g. 436c6f7564666c...61726520444e53",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
};

export const FORM_DNS_TYPE_SVCB = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    priority: {
		label: "Priority",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    target: {
		label: "Target",
        placeholder: "Target...",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    value: {
		label: "Value",
        placeholder: 'E.g. alpn="h3,h2" ipv4hint="127.0.0.1" ipv6hint="::1"',
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
};

export const FORM_DNS_TYPE_TLSA = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    usage: {
		label: "Usage",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    selector: {
		label: "Selector",
        placeholder: "0 - 255",
		type: "count",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    matching_type: {
		label: "Matching",
		type: "count",
        placeholder: "0 - 255",
		value: 0,
		max: "255",
		errorMessage: "",
		isRequire: false,
	},
    certificate: {
		label: "Certificate (hexadecimal)",
        placeholder: "E.g. 436c6f7564666c...61726520444e53",
		type: "textarea",
		value: "",
		errorMessage: "",
		isRequire: true,
    },
};

export const FORM_DNS_TYPE_TXT = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    content: {
		label: "Content",
        placeholder: "Content...",
		type: "textarea",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
};

export const FORM_DNS_TYPE_URI = {
    name: {
		label: "Name",
        placeholder: "Use @ for root",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    ttl: {
		label: "TTL",
		type: "select",
		value: new Set([TTL_OPTIONS[0]?.value]),
		errorMessage: "",
		isRequire: true,
        options: TTL_OPTIONS,
	},
    priority: {
		label: "Priority",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    weight: {
		label: "Weight",
        placeholder: "0 - 65535",
		type: "count",
		value: 0,
		max: "65535",
		errorMessage: "",
		isRequire: false,
	},
    target: {
		label: "Target",
        placeholder: "E.g. www.example.com",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
};

export const FORM_DNS = {
	A: FORM_DNS_TYPE_A,
	AAAA: FORM_DNS_TYPE_AAAA,
	CAA: FORM_DNS_TYPE_CAA,
	CERT: FORM_DNS_TYPE_CERT,
	CNAME: FORM_DNS_TYPE_CNAME,
	DNSKEY: FORM_DNS_TYPE_DNSKEY,
	DS: FORM_DNS_TYPE_DS,
	HTTPS: FORM_DNS_TYPE_HTTPS,
	LOC: FORM_DNS_TYPE_LOC,
	MX: FORM_DNS_TYPE_MX,
	NAPTR: FORM_DNS_TYPE_NAPTR,
	NS: FORM_DNS_TYPE_NS,
	PTR: FORM_DNS_TYPE_PTR,
	SMIMEA: FORM_DNS_TYPE_SMIMEA,
	SRV: FORM_DNS_TYPE_SRV,
	SSHFP: FORM_DNS_TYPE_SSHFP,
	SVCB: FORM_DNS_TYPE_SVCB,
	TLSA: FORM_DNS_TYPE_TLSA,
	TXT: FORM_DNS_TYPE_TXT,
	URI: FORM_DNS_TYPE_URI,
};
