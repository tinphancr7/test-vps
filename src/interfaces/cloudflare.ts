export interface CloudflareAccount {
  id: string;
  name: string;
  type: string;
  settings: {
    enforce_twofactor: boolean;
    api_access_enabled: any;
    access_approval_expiry: any;
    use_account_custom_ns_by_default: boolean;
    default_nameservers: string;
    abuse_contact_email: any;
  };
  legacy_flags: {
    enterprise_zone_quota: {
      maximum: number;
      current: number;
      available: number;
    };
  };
  created_on: string;
}

export interface IResListAccount {
  status: number;
  message: string;
  accounts: CloudflareAccount[];
  result_info: {
    page: number;
    per_page: number;
    total_pages: number;
    count: number;
    total_count: number;
  };
}

export interface IAccountCloudflare {
  _id: string;
  id: "b79327d35140da702ce4e522447d4b5e";
  name: string;
  status: string;
  paused: boolean;
  type: any;
  development_mode: 0;
  name_servers: string[];
  original_name_servers: string[];
  account: {
    id: string;
    name: string;
  };
  permissions: string;
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    frequency: string;
    is_subscribed: boolean;
    can_subscribe: boolean;
    legacy_id: string;
    legacy_discount: false;
    externally_managed: false;
  };
  original_registrar: string;
  original_dnshost: any;
  modified_on: string;
  created_on: string;
  activated_on: string;
  meta: {
    step: number;
    custom_certificate_quota: number;
    page_rule_quota: number;
    phishing_detected: boolean;
  };
  owner: {
    id: any;
    type: string;
    email: string;
  };
  tenant: {
    id: any;
    name: any;
  };
  tenant_unit: {
    id: any;
  };
  createdAt: string;
  updatedAt: string;
}
export interface IResCloudflareWebsite {
  status: number;
  message: string;
  accounts: IAccountCloudflare[];
  totalPages: number;
  counts: number;
  pageIndex: number;
  pageSize: number;
}
