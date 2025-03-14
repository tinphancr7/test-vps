import { toast } from "react-toastify";

type ToastType = 'success' | 'error' | 'info' | 'warn';

const showToast = (title: string, type: ToastType) => {
    return toast[type](title, {
        position: "top-right",
        autoClose: 2000,
    });
}

export default showToast;