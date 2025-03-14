import digitalOceanImageApi from "@/apis/digital-ocean-image.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DigitalOceanImage {
    listImage: [];
    selectedImage: object;
    selectedVersionImage: any;
    isLoading: boolean;
}
const initialState: DigitalOceanImage = {
    listImage: [],
    selectedImage: {},
    selectedVersionImage: new Set([]),
    isLoading: false,
};

export const getAllListImage = createAsyncThunk(
    "digital-ocean/images/get-all",
    async () => {
        const response = await digitalOceanImageApi.getAllListImage();
        return response?.data;
    }
);
const digitalOceanImageSlice = createSlice({
    name: "digitalOceanImageSlice",
    initialState,
    reducers: {
        setDataImageDigitalOcean: (state: any, action) => {
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
            .addCase(getAllListImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllListImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listImage = action.payload.data;
                const findU22 = action?.payload?.data?.find(
                    (item: any) => item._id === "Ubuntu"
                );
                state.selectedImage = findU22;

                const findU22Ver = findU22?.data?.find(
                    (item: any) => item.slug === "ubuntu-22-04-x64"
                );

                state.selectedVersionImage = new Set([findU22Ver?.slug]);
            })
            //
            .addCase(getAllListImage.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setDataImageDigitalOcean } = digitalOceanImageSlice.actions;

export default digitalOceanImageSlice.reducer;
