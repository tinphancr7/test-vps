import prodVServerApis from "@/apis/product-vietserver-apis";
import {createAsyncThunk} from "@reduxjs/toolkit";

type PayloadProdVServer = {
	status: number;
	data: any;
};

export const asyncThunkGetAllProducts = createAsyncThunk<PayloadProdVServer>(
	"/product-vietserver/get-products",
	async (_, {rejectWithValue}) => {
		try {
			const {data} = await prodVServerApis.getAllProducts();

			if (data?.status === 1) {
				return {
					status: data?.status,
					data: data?.data,
				} as PayloadProdVServer;
			}

			return rejectWithValue("Invalid data format");
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const asyncThunkGetProductById = createAsyncThunk<
	PayloadProdVServer,
	string
>("/product-vietserver/get-product-by-id", async (id, {rejectWithValue}) => {
	try {
		const {data} = await prodVServerApis.getProductById(id);

		if (data?.status === 1) {
			return {
				status: data?.status,
				data: data?.data,
			} as PayloadProdVServer;
		}

		return rejectWithValue("Invalid data format");
	} catch (error) {
		return rejectWithValue(error);
	}
});
