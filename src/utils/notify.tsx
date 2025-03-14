import {toast} from "react-toastify";

function NotifyMessage(title: string, type: string) {
	return (toast as any)[type](title, {
		position: "top-right",
		autoClose: 2000,
	});
}

export default NotifyMessage;
