import prodVngApis from "@/apis/product-vng-apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadProdVng = {
	status: number;
	data: any;
};

export const asyncThunkGetAllProducts = createAsyncThunk<PayloadProdVng>(
	"/product-vng/get-products",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await prodVngApis.getAllProducts();

			if (data?.status === 1) {
				return {
					status: data?.status,
					data: data?.data,
				} as PayloadProdVng;
			}

			return rejectWithValue("Invalid data format");
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const asyncThunkGetProductById = createAsyncThunk<
	PayloadProdVng,
	string
>("/product-vng/get-product-by-id", async (id, { rejectWithValue }) => {
	try {
		const { data } = await prodVngApis.getProductById(id);

		if (data?.status === 1) {
			return {
				status: data?.status,
				data: data?.data,
			} as PayloadProdVng;
		}

		return rejectWithValue("Invalid data format");
	} catch (error) {
		return rejectWithValue(error);
	}
});
