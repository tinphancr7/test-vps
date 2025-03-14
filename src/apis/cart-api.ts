import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

export type PayloadAddToCart = {
    domainProvider: string;
    domain: string;
    price: number;
    renewal: number;
};

class CartServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

    getCartInfo() {
        return this.instance.get("/carts/user")
    }

    addToCart(payload: PayloadAddToCart[]) {
        return this.instance.put("/carts", {
            cartInfo: payload
        });
    }
}

const cartApis = new CartServices();
export default cartApis;
