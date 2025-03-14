import { domainFields } from "@/constants";
import * as yup from "yup";

const teamSchema = yup.object({
  name: yup.string().required("không được để trống"),
  managers: yup.array().required("không được để trống").min(1, "không được để trống"),
  telegramIds: yup.array().of(yup.string().required("Không được để trống")),
});
const manage2FaKeySchema = yup.object({
  name: yup.string().required("không được để trống"),
  key: yup.string().required("không được để trống"),
  type: yup.object().required("Loại khóa không được để trống"),
});
const vpsOrtherSchema = yup.object().shape({
  domain: yup.string().required("Tên VPS là bắt buộc."),
  price: yup
    .number()
    .typeError("Giá tiền phải là số.") // Nếu không phải số
    .positive("Giá tiền phải lớn hơn 0") // Nếu nhỏ hơn hoặc bằng 0
    .required("Giá tiền là bắt buộc."), // Không được bỏ trống
  core: yup.number().typeError("Core phải là số.").required("Core là bắt buộc."),
  disk_limit: yup
    .number()
    .typeError("Dung lượng đĩa phải là số.")
    .required("Dung lượng đĩa là bắt buộc."),
  expires: yup.date().required("Ngày tạo là bắt buộc."), // Không bắt buộc
  guaranteed_ram: yup.number().typeError("RAM phải là số.").required("RAM là bắt buộc."),
  ip: yup
    .string()
    .required("Địa chỉ IP là bắt buộc.")
    .test("is-ip-valid", "Địa chỉ IP không hợp lệ (IPv4 hoặc IPv6).", (value) => {
      // Kiểm tra IPv4
      const ipv4Regex =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
      // Kiểm tra IPv6
      const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

      // Kiểm tra nếu giá trị là hợp lệ cho IPv4 hoặc IPv6
      return ipv4Regex.test(value) || ipv6Regex.test(value);
    }),
  os: yup.string().required("Hệ điều hành là bắt buộc."),
  password: yup.string(),
  passWorkAaPanel: yup.string(), // Không bắt buộc
  status: yup.object().required("Trạng thái là bắt buộc."),
  team: yup.object().required("không được để trống"),
  provider: yup.object().required("không được để trống"),
  mail: yup.string().nullable(),
  uRLAaPanel: yup.string().url("URL không hợp lệ."), // Không bắt buộc
  userAaPanel: yup.string(), // Không bắt buộc
  username: yup.string(),
});
const changePasswordSchema = yup.object({
  password: yup.string().required("không được để trống"),
  newPassword: yup.string().required("không được để trống"),
  confirmNewPassword: yup
    .string()
    .required("không được để trống")
    //@ts-ignore
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu không khớp"),
});
const accountSchema = yup.object({
  apikey: yup.string().required("không được để trống"), // Validate that apikey is required and is a string
  team: yup.object().required("không được để trống"),

  provider: yup.object().required("không được để trống"),
});
const cloudflareApiKeySchema = yup.object({
  api_key: yup.string().required("không được để trống"),
  team: yup.object().required("không được để trống"),

  email: yup
    .string()
    .email("Địa chỉ email không hợp lệ")
    .required("Địa chỉ email không được để trống"),
});
const osSchema = yup.object({
  os: yup.string().required("không được để trống"),
});
const sshKeySchema = yup.object({
  name: yup.string().required("không được để trống"),
  publicKey: yup.string().required("không được để trống"),
});

const userAaPanelSchema = yup.object({
  userAaPanel: yup.string().required("không được để trống"),
  passWorkAaPanel: yup.string().required("không được để trống"),
  uRLAaPanel: yup.string().required("không được để trống"),
});
const userAaPanelDigitalSchema = yup.object({
  userAaPanel: yup.string().required("không được để trống"),
  passWordAaPanel: yup.string().required("không được để trống"),
  uRLAaPanel: yup.string().required("không được để trống"),
});
const volumeSchema = yup.object({
  name: yup
    .string()
    .min(1, "Volume name is required")
    .matches(/^[a-zA-Z0-9 -]+$/, "Only alphanumeric characters, spaces, and dashes are allowed."),

  size: yup.number().min(10, "Size must be at least 10 GB").required("Size is required"),

  perf_iops: yup
    .number()
    .oneOf([5000, 15000], "IOPS must be either 5K or 15K")
    .required("IOPS selection is required"),
});

const rulesetSchema = yup.object({
  description: yup.string().required(),
  // value: yup.string().required(),
  action: yup.string().required(),
});

const domainProviderSchema = yup.object({
  title: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.title?.isRequired
      ? schema.required("Tên kết nối là bắt buộc.")
      : schema.optional();
  }),

  name: yup.string().required("Tên nhà cung cấp là bắt buộc."), // Luôn bắt buộc

  apiKey: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.apiKey?.isRequired
      ? schema.required("API Key là bắt buộc.")
      : schema.optional();
  }),

  secret: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.secret?.isRequired
      ? schema.required("Secret key là bắt buộc.")
      : schema.optional();
  }),

  exchangeRate: yup
    .number()
    .typeError("Tỷ giá phải là số.")
    .when("name", (name: any, schema) => {
      return domainFields[name]?.exchangeRate?.isRequired
        ? schema.required("Tỷ giá là bắt buộc.")
        : schema.optional();
    }),

  username: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.username?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  clientIp: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.clientIp?.isRequired
      ? schema.required("Client IP là bắt buộc.")
      : schema.optional();
  }),

  shopperId: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.shopperId?.isRequired
      ? schema.required("Shopper ID là bắt buộc.")
      : schema.optional();
  }),

  isOpen: yup.boolean().when("name", (name: any, schema) => {
    return domainFields[name]?.isOpen?.isRequired
      ? schema.required("Trạng thái là bắt buộc.")
      : schema.optional();
  }),

  teams: yup.array(yup.object()).when("name", (name: any, schema) => {
    return domainFields[name]?.teams?.isRequired
      ? schema.min(1, "Team là bắt buộc.") // Kiểm tra ít nhất có 1 phần tử
      : schema.optional();
  }),

  firstName: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.firstName?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  lastName: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.lastName?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  address: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.address?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  state: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.state?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  zip: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.zip?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  country: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.country?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  phone: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.phone?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  email: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.email?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),

  city: yup.string().when("name", (name: any, schema) => {
    return domainFields[name]?.city?.isRequired
      ? schema.required("Tên đăng nhập là bắt buộc.")
      : schema.optional();
  }),
});

// const domainProviderSchema = yup.object({
//   title: yup.string().optional(),
//   name: yup.string().required("Tên nhà cung cấp là bắt buộc."),
//   apiKey: yup.string().required("API Key là bắt buộc."),
//   secret: yup.string().optional(),
//   exchangeRate: yup.number().typeError("Tỷ giá phải là số."),
//   username: yup.string().optional(),
//   clientIp: yup.string().optional(),
//   shopperId: yup.string().optional(),
//   isOpen: yup.boolean().required("Trạng thái là bắt buộc."),
//   teams: yup.array(yup.object()).required("Team là bắt buộc."),
// });
export {
  vpsOrtherSchema,
  teamSchema,
  manage2FaKeySchema,
  accountSchema,
  osSchema,
  userAaPanelSchema,
  userAaPanelDigitalSchema,
  changePasswordSchema,
  sshKeySchema,
  volumeSchema,
  cloudflareApiKeySchema,
  rulesetSchema,
  domainProviderSchema,
};
