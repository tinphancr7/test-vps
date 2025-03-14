import { combineReducers } from "@reduxjs/toolkit";
import tableReducer from "./slices/table-slice";
import modalReducer from "./slices/modal-slice";
import authReducer from "./slices/auth-slice";
import usersReducer from "./slices/users-slice";
import rolesReducer from "./slices/roles-slice";
import teamReducer from "./slices/team.slice";
import manage2FaKeyReducer from "./slices/manage-2fa-key.slice";
import digitalOceanRegionReducer from "./slices/digital-ocean-slice/create-vps/digital-ocean-region.slice";
import digitalOceanImageReducer from "./slices/digital-ocean-slice/create-vps/digital-ocean-image.slice";
import digitalOceanSizeReducer from "./slices/digital-ocean-slice/create-vps/digital-ocean-size.slice";
import digitalOceanNameVPSReducer from "./slices/digital-ocean-slice/create-vps/digital-ocean-name.slice";
import digitalOceanAddStorageReducer from "./slices/digital-ocean-slice/create-vps/digital-ocean-storage.slice";
import digitalOceanBackupReducer from "./slices/digital-ocean-slice/create-vps/digital-ocean-backup.slice";
import digitalOceanLBScalingReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-scaling.slice";
import digitalOceanLBConnectVPSReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-connect-vps.slice";
import digitalOceanForwardingRuleReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-forwarding-rule";
import digitalOceanAdvanceSettingReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-advance-setting.slice";
import digitalOceanNameLoadBalancerReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-name-load-balancer.slice";
import digitalOceanBillingHistoryReducer from "./slices/digital-ocean-slice/digital-ocean-billing.slice";
import digitalOceanVPSReducer from "./slices/digital-ocean-slice/digital-ocean-vps.slice";
import digitalOceanCertificateReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-certificate.slice";
import digitalOceanLoadBalancerReducer from "./slices/digital-ocean-slice/digital-ocean-load-balancer.slice";
import loadBalancerEditDigitalOceanReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-setting.slice";
import fingerPrintSlice from "./slices/fingerprint-slice";
import logsReducer from "./slices/log.slice";
import prodVngReducer from "./slices/prod-vng-slice";
import prodGeneralReducer from "./slices/prod-general-slice";
import prodBucloudReducer from "./slices/prod-bucloud-slice";
import prodVietStackReducer from "./slices/prod-vietstack-slice";
import invoicesReducer from "./slices/invoice.slice";
import accountsReducer from "./slices/account.slice";
import cloudflareApiKeyReducer from "./slices/cloudflare-api-key.slice";
import statisticsReducer from "./slices/statistic.slice";
import vpsVngReducer from "./slices/vps-vng-slice";
import vpsGeneralReducer from "./slices/vps-general-slice";
import vpsVietStackReducer from "./slices/vps-vietstack-slice";
import vpsOrtherReducer from "./slices/vps-orther-slice";
import vpsBuCloudReducer from "./slices/vps-bu-cloud.slice";
import vpsBuCloudUpCloudReducer from "./slices/vps-up-cloud.slice";
import detailVpsReducer from "./slices/detail-vps-slice";
import detailVpsOrtherReducer from "./slices/detail-vps-orther-slice";
import serverVngReducer from "./slices/server-vng-slice";
import serverVietServerReducer from "./slices/server-vietserver-slice";
import vpsVietServerReducer from "./slices/vps-vietserver-slice";
import serverVietStackReducer from "./slices/server-vietstack-slice";
import prodVServerReducer from "./slices/prod-vietserver-slice";
import awsLightsailReducer from "./slices/aws-lightsail-slice";
import scalewayReducer from "./slices/vps-scaleway-slice";
import digitalOceanVPSBuCloudReducer from "./slices/digital-ocean-slice/digital-ocean-vps-bu-cloud.slice";
import upCloudLocationReducer from "./slices/upcloud/location.slice";
import upCloudServerReducer from "./slices/upcloud/server.slice";
import upCloudResourcePlanReducer from "./slices/upcloud/resource-plan.slice";
import upCloudStorageReducer from "./slices/upcloud/storage.slice";
import upCloudPlanReducer from "./slices/upcloud/plan.slice";
import upCloudCreateServerReducer from "./slices/upcloud/create-server.slice";
import invoiceBuCloudReducer from "./slices/invoice-bu-cloud-slice";
import invoiceServerVietServerReducer from "./slices/invoice-server-vietserver-slice";
import alibabaEcsReducer from "./slices/alibaba-ecs.slice";
import transactionReducer from "./slices/transaction.slice";
import orderReducer from "./slices/order.slice";
import providerReducer from "./slices/provider-slice";
import digitalOceanLoadBalancerBuCloudReducer from "./slices/digital-ocean-slice/digital-ocean-load-balancer-bu-cloud.slice";
import loadBalancerEditDigitalOceanBuCloudReducer from "./slices/digital-ocean-slice/load-balancer/digital-ocean-setting-bu-cloud.slice";
import dnsReducer from "./slices/dns-slice";
import cloudFlareSslReducer from "./slices/cloud-flare-ssl.slice";
import rulesetReducer from "./slices/ruleset.slice";
import ipWhiteListReducer from "./slices/ipWhiteList.slice";
import cartReducer from "./slices/cart-slice";
import brandReducer from "./slices/brand-slice";
import domainProviderReducer from "./slices/domain-provider.slice";
import walletReducer from "./slices/wallet.slice";
import ordersDomainReducer from "./slices/orders-domain-slice";
import ordersDomainStatusReducer from "./slices/orders-domain-status-slice";
import orderDomainLogReducer from "./slices/order-domain-log.slice";
import domainsReducer from "./slices/domains-slice";

const rootReducer = combineReducers({
  ipWhiteList: ipWhiteListReducer,
  table: tableReducer,
  modal: modalReducer,
  auth: authReducer,
  users: usersReducer,
  fingerprint: fingerPrintSlice,
  roles: rolesReducer,
  teams: teamReducer,
  manage2FaKey: manage2FaKeyReducer,
  digitalOceanRegion: digitalOceanRegionReducer,
  digitalOceanImage: digitalOceanImageReducer,
  digitalOceanSize: digitalOceanSizeReducer,
  digitalOceanNameVPS: digitalOceanNameVPSReducer,
  digitalOceanAddStorage: digitalOceanAddStorageReducer,
  digitalOceanBackup: digitalOceanBackupReducer,
  digitalOceanLBScaling: digitalOceanLBScalingReducer,
  digitalOceanLBConnectVPS: digitalOceanLBConnectVPSReducer,
  digitalOceanForwardingRule: digitalOceanForwardingRuleReducer,
  digitalOceanAdvanceSetting: digitalOceanAdvanceSettingReducer,
  digitalOceanNameLoadBalancer: digitalOceanNameLoadBalancerReducer,
  digitalOceanBillingHistory: digitalOceanBillingHistoryReducer,
  digitalOceanCertificate: digitalOceanCertificateReducer,
  digitalOceanLoadBalancer: digitalOceanLoadBalancerReducer,
  digitalOceanVPS: digitalOceanVPSReducer,
  digitalOceanVPSBuCloud: digitalOceanVPSBuCloudReducer,
  loadBalancerEditDigitalOcean: loadBalancerEditDigitalOceanReducer,
  logs: logsReducer,
  prodVng: prodVngReducer,
  prodGeneral: prodGeneralReducer,
  prodBucloud: prodBucloudReducer,
  prodVietStack: prodVietStackReducer,
  invoices: invoicesReducer,
  accounts: accountsReducer,
  cloudflareApiKey: cloudflareApiKeyReducer,
  statistics: statisticsReducer,
  vpsVng: vpsVngReducer,
  vpsGeneral: vpsGeneralReducer,
  vpsVietStack: vpsVietStackReducer,
  vpsOrther: vpsOrtherReducer,
  vpsBuCloud: vpsBuCloudReducer,
  detailVps: detailVpsReducer,
  detailVpsOrther: detailVpsOrtherReducer,
  serverVng: serverVngReducer,
  serverVietServer: serverVietServerReducer,
  serverVietStack: serverVietStackReducer,
  prodVServer: prodVServerReducer,
  vpsVietServer: vpsVietServerReducer,
  awsLightsail: awsLightsailReducer,
  scaleway: scalewayReducer,
  upcloudLocation: upCloudLocationReducer,
  upCloudResourcePlan: upCloudResourcePlanReducer,
  upCloudServer: upCloudServerReducer,
  upCloudStorage: upCloudStorageReducer,
  upcloudPlan: upCloudPlanReducer,
  upcloudCreateServer: upCloudCreateServerReducer,
  upcloudVps: vpsBuCloudUpCloudReducer,
  invoiceBuCloud: invoiceBuCloudReducer,
  invoiceServerVietServer: invoiceServerVietServerReducer,
  alibabaEcs: alibabaEcsReducer,
  transaction: transactionReducer,
  order: orderReducer,
  provider: providerReducer,
  digitalOceanLoadBalancerBuCloud: digitalOceanLoadBalancerBuCloudReducer,
  loadBalancerEditDigitalOceanBuCloud: loadBalancerEditDigitalOceanBuCloudReducer,
  dns: dnsReducer,
  cloudFlareSsl: cloudFlareSslReducer,
  ruleset: rulesetReducer,
  cart: cartReducer,
  brand: brandReducer,
  domainProvider: domainProviderReducer,
  wallet: walletReducer,
  ordersDomain: ordersDomainReducer,
  ordersDomainStatus: ordersDomainStatusReducer,
  orderDomainLog: orderDomainLogReducer,
  domains: domainsReducer,
});

export default rootReducer;
