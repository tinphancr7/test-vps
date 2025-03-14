import invoiceApi from "@/apis/invoice.api";
import orderApis from "@/apis/order.api";
import { Pagination } from "@/interfaces/pagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TransactionHistoryI {
  listOrder: Array<any>;
  total: number;
  isLoading: boolean;
  isLoadingUpdate: boolean;
  detailOrder: any;
  listProvider: Array<any>;
  orderDomainLink: any;
  isOpenModal: boolean;
  isOpenModalRenew: boolean;
  orderDomainLinkList: Array<any>;
  totalPrice: any;
  isLoadingPaymentMethod: boolean;
  listPayment: Array<any>;
  paymentSelected: any;
  isLoadingActionOrder: boolean;
  responseAction: any;
  querySearch: any;
  isLoadingDeleteVPS: boolean;
}
const initialState: TransactionHistoryI = {
  listOrder: [],
  total: 0,
  isLoading: false,
  isLoadingUpdate: false,
  detailOrder: {},
  listProvider: [],
  orderDomainLink: new Set([""]),
  orderDomainLinkList: [],
  isOpenModal: false,
  isOpenModalRenew: false,
  totalPrice: 0,
  isLoadingPaymentMethod: false,
  listPayment: [],
  paymentSelected: new Set([""]),
  isLoadingActionOrder: false,
  responseAction: {},
  querySearch: {},
  isLoadingDeleteVPS: false,
};

export interface GetPagingOrder extends Pagination {
  team?: string;
  providerSelected?: string;
  dateRange?: any;
}
export const getListOrder: any = createAsyncThunk<GetPagingOrder, any>(
  "order/get",
  async (query: GetPagingOrder, { rejectWithValue }) => {
    try {
      const response = await orderApis.getPaggingOrder(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateReviewOrder: any = createAsyncThunk<any, any>(
  "order/update-order",
  async ({ status, _idOrder }, { rejectWithValue }) => {
    try {
      const response = await orderApis.reviewOrder(status, _idOrder);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const uploadBill: any = createAsyncThunk<any, any>(
  "order/uploadBill-order",
  async ({ formData, idOrder }, { rejectWithValue }) => {
    try {
      const response = await orderApis.uploadBill(formData, idOrder);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteOrder: any = createAsyncThunk<any, any>(
  "order/delete-order",
  async ({ _idOrder }, { rejectWithValue }) => {
    try {
      const response = await orderApis.deleteOrder(_idOrder);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getListProvider: any = createAsyncThunk<Pagination, any>(
  "provider/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.callFetchProvider({
        search: "",
        page: 1,
        limit: 100,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getPaymentMethod: any = createAsyncThunk<any, any>(
  "order/payment-method",
  async ({ team, providerId }, { rejectWithValue }) => {
    try {
      const response = await orderApis.paymentMethod({ team, providerId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const actionOrder: any = createAsyncThunk<any, any>(
  "order/action_vps_order",
  async ({ orderId, type }, { rejectWithValue }) => {
    try {
      const response = await orderApis.actionOrderVPS({ orderId, type });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteVPSInOrder: any = createAsyncThunk<any, any>(
  "order/delete_vps_order",
  async ({ _idOrder, ipVPS }, { rejectWithValue }) => {
    try {
      const response = await orderApis.deleteVPSOrder({ _idOrder, ipVPS });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setListOrder: (state, action) => {
      state.listOrder = action.payload;
    },
    setDetailOrder: (state, action) => {
      state.detailOrder = action.payload;
    },
    setDomainLinkOrder: (state, action) => {
      state.orderDomainLink = action.payload;
    },
    setIsOpenModal: (state, action) => {
      state.isOpenModal = action.payload;
    },
    setIsOpenModalRewew: (state, action) => {
      state.isOpenModalRenew = action.payload;
    },
    setDomainLinkOrderList: (state, action) => {
      state.orderDomainLinkList = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentSelected = action.payload;
    },
    setResponseAction: (state, action) => {
      state.responseAction = action.payload;
    },
    setQuerySearch: (state, action) => {
      state.querySearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(updateReviewOrder.pending, (state) => {
        state.isLoadingUpdate = true;
      })
      .addCase(updateReviewOrder.fulfilled, (state) => {
        state.isLoadingUpdate = false;
      })
      .addCase(updateReviewOrder.rejected, (state) => {
        state.isLoadingUpdate = false;
      })
      // Get Pagination Users
      .addCase(getListOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListOrder.fulfilled, (state, action) => {
        state.listOrder = action.payload.data.listOrder;
        state.total = action.payload.data.total;
        state.totalPrice = action.payload.data.totalPrice;
        state.isLoading = false;
      })
      .addCase(getListOrder.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getListProvider.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListProvider.fulfilled, (state, action) => {
        const provider = [
          "66dea61b22306cb524671c45", // VNG
          "66dea5f822306cb524671c44", // Viet stack
          "6711d27e4fa47d51268d04e6", // Viet server
        ];
        const filteredData = action.payload.data.data.filter((item: any) =>
          provider.includes(item._id),
        );
        state.listProvider = filteredData;
        state.isLoading = false;
      })
      .addCase(getListProvider.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteOrder.pending, (state) => {
        state.isLoadingUpdate = true;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.isLoadingUpdate = false;
      })
      .addCase(deleteOrder.rejected, (state) => {
        state.isLoadingUpdate = false;
      })

      .addCase(uploadBill.pending, (state) => {
        state.isLoadingUpdate = true;
      })
      .addCase(uploadBill.fulfilled, (state) => {
        state.isLoadingUpdate = false;
      })
      .addCase(uploadBill.rejected, (state) => {
        state.isLoadingUpdate = false;
      })

      .addCase(getPaymentMethod.pending, (state) => {
        state.isLoadingPaymentMethod = true;
      })
      .addCase(getPaymentMethod.fulfilled, (state, action) => {
        state.isLoadingPaymentMethod = false;
        state.listPayment = action?.payload?.data || [];
      })
      .addCase(getPaymentMethod.rejected, (state) => {
        state.isLoadingPaymentMethod = false;
      })

      .addCase(actionOrder.pending, (state) => {
        state.isLoadingActionOrder = true;
      })
      .addCase(actionOrder.fulfilled, (state, action) => {
        state.isLoadingActionOrder = false;
        state.responseAction = action.payload;
      })
      .addCase(actionOrder.rejected, (state) => {
        state.isLoadingActionOrder = false;
      })

      .addCase(deleteVPSInOrder.pending, (state) => {
        state.isLoadingDeleteVPS = true;
      })
      .addCase(deleteVPSInOrder.fulfilled, (state, action) => {
        state.detailOrder = action.payload.data;
        state.isLoadingDeleteVPS = false;
      })
      .addCase(deleteVPSInOrder.rejected, (state) => {
        state.isLoadingDeleteVPS = false;
      });
  },
});

export const {
  setListOrder,
  setDetailOrder,
  setDomainLinkOrder,
  setIsOpenModal,
  setIsOpenModalRewew,
  setDomainLinkOrderList,
  setPaymentMethod,
  setResponseAction,
  setQuerySearch,
} = orderSlice.actions;

export default orderSlice.reducer;
