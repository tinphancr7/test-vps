import { STATUSES_DOMAIN } from "@/constants/domain";

export const formDomain = {
    name: {
		label: "Tên domain",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    team: {
		label: "Team",
		type: "autocomplete",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    brand: {
		label: "Thương hiệu",
		type: "autocomplete",
		value: "",
		options: [],
		errorMessage: "",
		isRequire: true,
	},
    manager: {
		label: "Người quản lý",
		type: "users",
		options: [],
		value: "",
		errorMessage: "",
		isRequire: true,
	},
    status: {
		label: "Trạng thái",
		type: "autocomplete",
		value: "",
		options: STATUSES_DOMAIN,
		errorMessage: "",
		isRequire: true,
	},
    note: {
		label: "Ghi chú",
		type: "textarea",
		value: "",
		errorMessage: "",
		isRequire: false,
	},
}