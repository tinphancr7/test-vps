import { DomainProviderNameEnum } from "@/stores/slices/cart-slice";

export const STATUSES_DOMAIN = [
    { value: "web-train", label: "Web đào tạo" },
    { value: "satellite", label: "Vệ tinh" },
    { value: "pause", label: "Tạm ngưng" },
    { value: "seo", label: "SEO" },
    { value: "pbn", label: "PBN" },
    { value: "do-not-use", label: "Không sử dụng" },
    { value: "301", label: "301" },
    { value: "for-assistant", label: "Cho trợ lý" },
    { value: "brand", label: "Hậu đài" },
    { value: "back-up", label: "Backup" },
    { value: "cdn", label: "CDN" },
    { value: "new", label: "Domain mới" },
];

export const PROVIDER_OPTIONS = [
    { label: "Dynadot", value: DomainProviderNameEnum.DYNADOT },
    { label: "Epik", value: DomainProviderNameEnum.EPIK },
    { label: "Gname", value: DomainProviderNameEnum.GNAME },
    { label: "GoDaddy", value: DomainProviderNameEnum.GODADDY },
    { label: "Name", value: DomainProviderNameEnum.NAME },
    { label: "Name Cheap", value: DomainProviderNameEnum.NAME_CHEAP },
];
