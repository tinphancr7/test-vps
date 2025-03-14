import { ActionEnum, SubjectEnum } from "@/constants/enum";

export const actionsRole: RoleAction = {
  [ActionEnum.CREATE]: false,
  [ActionEnum.READ]: false,
  [ActionEnum.UPDATE]: false,
  [ActionEnum.DELETE]: false,
};

export const roles: RoleItem = {
  [SubjectEnum.ROLE]: "Quản lý phân quyền",
  [SubjectEnum.USER]: "Quản lý nhân sự",
  [SubjectEnum.TEAM]: "Quản lý Teams",
  [SubjectEnum.OTHER_PROVIDER]: "Quản lý nhà cung cấp",
  [SubjectEnum.VPS]: "Quản lý VPS",
  [SubjectEnum.INVOICE]: "Quản lý hóa đơn",
  [SubjectEnum.STATISTICS]: "Thống kê hóa đơn",
  [SubjectEnum.ACCOUNTVPS]: "Quản lý tài khoản - VPS",
  [SubjectEnum.CLOUDFLARE]: "Quản lý Cloudflare",
  [SubjectEnum.CLOUDFLARE_API_KEY]: "Quản lý Cloudflare API Key",
  [SubjectEnum.SERVER]: "Quản lý Server",
  [SubjectEnum.LOG]: "Quản lý logs",
  [SubjectEnum.TRANSACTION]: "Quản lý giao dịch",
  [SubjectEnum.ORDER]: "Quản lý đơn hàng",
  [SubjectEnum.ACCCESS_AAPANEL]: "Truy Cập Aapanel",
  [SubjectEnum.LOG_LOGIN]: "Quản lý log đăng nhập",
  [SubjectEnum.MANAGE_2FA_KEY]: "Quản lý 2FA Key",
  [SubjectEnum.DOMAIN_PROVIDER]: "Quản lý nhà cung cấp domain",
  [SubjectEnum.DOMAIN]: "Quản lý domain",
  [SubjectEnum.ORDER_DOMAIN]: "Quản lý đơn hàng domain",
  [SubjectEnum.ORDER_DOMAIN_STATUS]: "Quản lý trạng thái domain",
  [SubjectEnum.ORDER_DOMAIN_LOG]: "Quản lý log đơn hàng domain",
};

export const permissionState = Object.keys(roles)?.reduce(
  (values, role) => ({
    ...values,
    [role]: {
      label: roles[role],
      isRequire: false,
      value: {
        ...actionsRole,
        all: false,
      },
    },
  }),
  {},
);

export const inititalFormState = {
  name: {
    label: "Tên quyền hạn",
    type: "text",
    isRequire: true,
    value: "",
    errorMessage: "",
  },
  ...permissionState,
};

interface RoleItem {
  [key: string]: string;
}

export interface RoleAction {
  [key: string]: boolean;
}
