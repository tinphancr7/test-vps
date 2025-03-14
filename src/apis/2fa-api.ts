import HttpService from "@/configs/http";
import {AxiosInstance} from "axios";

class TwoFAServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}

	generate() {
		return this.instance.post("/2fa/generate");
	}

    create(payload: { token: string, secret: string }) {
		return this.instance.post("/2fa", payload);
	}

	verify(token: string) {
		return this.instance.post("/2fa/verify", { token });
	}

	getQrCode() {
		return this.instance.get("/2fa")
	}
}

const twoFAApis = new TwoFAServices();
export default twoFAApis;
