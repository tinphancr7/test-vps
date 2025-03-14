import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkDetailInvoiceServerVietServer, asyncThunkPaginationInvoiceServerVietServer } from "../async-thunks/invoice-server-vietserver";

const initialState = {
    invoicesList: [],
    invoice: null,
    total: 0,
    isLoading: false,
    teamSelected: null,
    time: null,
    search: "",
};

const invoiceServerVietServerSlice = createSlice({
    name: "invoiceServerVietServer",
    initialState,
    reducers: {
        setTeamSelected: (state, action) => {
            state.teamSelected = action.payload;
        },

        setTime: (state, action) => {
            state.time = action.payload;
        },

        setSearchByIp: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkPaginationInvoiceServerVietServer.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(
                asyncThunkPaginationInvoiceServerVietServer.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.invoicesList = action.payload?.data?.result;
                    state.total = action.payload?.data?.meta?.totalItems;
                }
            )

            .addCase(asyncThunkPaginationInvoiceServerVietServer.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(asyncThunkDetailInvoiceServerVietServer.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(
                asyncThunkDetailInvoiceServerVietServer.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.invoice = action.payload;
                }
            )

            .addCase(asyncThunkDetailInvoiceServerVietServer.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default invoiceServerVietServerSlice.reducer;
