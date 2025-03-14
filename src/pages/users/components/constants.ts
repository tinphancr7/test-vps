export const initialFormCreate = {
	username: {
		label: "Tên đăng nhập",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	password: {
		label: "Mật khẩu",
		type: "password",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	name: {
		label: "Họ và tên",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	email: {
		label: "Email",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	role: {
		label: "Quyền hạn",
		type: "autocomplete",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	teams: {
		label: "Teams",
		type: "select",
		options: [],
		value: [],
		errorMessage: "",
		isRequire: false,
	},
};

export const initialFormUpdate = {
	username: {
		label: "Tên đăng nhập",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	name: {
		label: "Họ và tên",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	email: {
		label: "Email",
		type: "text",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	role: {
		label: "Quyền hạn",
		type: "autocomplete",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	teams: {
		label: "Teams",
		type: "select",
		options: [],
		value: [],
		errorMessage: "",
		isRequire: false,
	},
};

export const initialFormResetPw = {
	password: {
		label: "Mật khẩu",
		type: "password",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
	verifyPw: {
		label: "Xác nhận mật khẩu",
		type: "password",
		value: "",
		errorMessage: "",
		isRequire: true,
	},
} 