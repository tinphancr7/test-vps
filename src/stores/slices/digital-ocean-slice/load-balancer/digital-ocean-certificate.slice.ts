import digitalOceanApi from "@/apis/digital-ocean.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DigitalOceanConnectVPS {
    listCertificate: [];
    isLoading: boolean;
    dataResCertificate: object;
}
const initialState: DigitalOceanConnectVPS = {
    listCertificate: [],
    isLoading: false,
    dataResCertificate: {},
};
export const createCertificateDigitalOcean: any = createAsyncThunk<any, any>(
    "digital-ocean/certificate",
    async (data, { rejectWithValue }) => {
        try {
            const response =
                await digitalOceanApi.createCertificateDigitalOcean(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getListCertificateDigitalOcean: any = createAsyncThunk<any, any>(
    "digital-ocean/certificate/get-list",
    async ({ rejectWithValue }) => {
        try {
            const response =
                await digitalOceanApi.getListCertificateDigitalOcean();
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
const digitalOceanCertificate = createSlice({
    name: "digitalOcean_LB_Certificate",
    initialState,
    reducers: {
        setDataCertificateDigitalOcean: (state: any, action) => {
            Object.keys(action.payload).forEach((key) => {
                if (action.payload[key] !== undefined) {
                    state[key] = action.payload[key];
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Pagination Users
            .addCase(createCertificateDigitalOcean.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                createCertificateDigitalOcean.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.dataResCertificate = action.payload;
                }
            )
            .addCase(createCertificateDigitalOcean.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(getListCertificateDigitalOcean.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                getListCertificateDigitalOcean.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.listCertificate = action.payload;
                }
            )
            .addCase(getListCertificateDigitalOcean.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setDataCertificateDigitalOcean } =
    digitalOceanCertificate.actions;

export default digitalOceanCertificate.reducer;
