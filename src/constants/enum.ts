export enum ActionEnum {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
}

export enum SubjectEnum {
  ALL = "all",
  USER = "user",
  ROLE = "role",
  TEAM = "team",
  LOG = "log",
  BRAND = "brand",
  PROVIDER = "provider",
  ACCOUNTVPS = "account_vps",
  VPS = "vps",
  INVOICE = "invoice",
  STATISTICS = "statistics",
  BILLING_DO = "billing_digital_ocean",
  SERVER = "server",
  TRANSACTION = "transaction",
  ORDER = "order",
  ACCCESS_AAPANEL = "access_aapanel",
  OTHER_PROVIDER = "orther_provider",
  CLOUDFLARE = "cloudflare",
  CLOUDFLARE_API_KEY = "cloudflare_api_key",
  LOG_LOGIN = "log_login",
  ORDER_DOMAIN = "order_domain",
  ORDER_DOMAIN_STATUS = "order_domain_status",
  ORDER_DOMAIN_LOG = 'order_domain_log',
  CART = "cart",
  DOMAIN = "domain",
  DOMAIN_PROVIDER = "domain_provider",
  MANAGE_2FA_KEY = "manage_2fa_key",
}

export enum VpsTypeEnum {
  VIET_STACK = "vietstack_vps",
  VIETSERVER_VPS = "vietserver_vps",
  VNG = "vng_vps",
  DIGITAL_OCEAN = "digital_ocean",
  BU_CLOUD = "bu_cloud",
}

export enum ProviderIDEnum {
  DIGITAL_OCEAN = "66dea5f022306cb524671c43",
  VIET_STACK = "66dea5f822306cb524671c44",
  VNG = "66dea61b22306cb524671c45",
  VietServer = "6711d27e4fa47d51268d04e6",
  BuCloud = "6728373045a431ee0fed355b",
  Alibaba = "676bcac66e4670f03be3a6ee",
}
