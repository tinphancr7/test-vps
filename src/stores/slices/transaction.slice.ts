import invoiceApi from "@/apis/invoice.api";
import transactionApis from "@/apis/transaction.api";
import { ProviderIDEnum } from "@/constants/enum";
import { Pagination } from "@/interfaces/pagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TransactionHistoryI {
  listTransaction: Array<any>;
  total: number;
  isLoading: boolean;
  detailTransaction: any;
  totalPrice: number;
  listProvider: Array<any>;
  query: any;
}
const initialState: TransactionHistoryI = {
  listTransaction: [],
  total: 0,
  isLoading: false,
  detailTransaction: {},
  totalPrice: 0,
  listProvider: [],
  query: {},
};

export interface GetPagingTransaction extends Pagination {
  team?: string;
  providerSelected?: string;
  dateRange?: any;
}
export const getListTransaction: any = createAsyncThunk<
  GetPagingTransaction,
  any
>(
  "transaction/get",
  async (query: GetPagingTransaction, { rejectWithValue }) => {
    try {
      const response = await transactionApis.getPaggingTransaction(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
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
  }
);
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setListTransaction: (state, action) => {
      state.listTransaction = action.payload;
    },
    setDetailTransaction: (state, action) => {
      state.detailTransaction = action.payload;
    },
    setQueryTransaction: (state, actions) => {
      state.query = actions.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Pagination Users
      .addCase(getListTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListTransaction.fulfilled, (state, action) => {
        state.listTransaction = action.payload.data.listTransaction;
        state.total = action.payload.data.total;
        state.isLoading = false;
      })
      .addCase(getListTransaction.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getListProvider.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListProvider.fulfilled, (state, action) => {
        const provider = [
          ProviderIDEnum.VNG, // VNG
          ProviderIDEnum.VIET_STACK, // Viet stack
          ProviderIDEnum.VietServer, // Viet server
          ProviderIDEnum.BuCloud, // Viet server
        ];
        const filteredData = action.payload.data.data.filter((item: any) =>
          provider.includes(item._id)
        );
        state.listProvider = filteredData;
        state.isLoading = false;
      })
      .addCase(getListProvider.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setListTransaction, setDetailTransaction, setQueryTransaction } =
  transactionSlice.actions;

export default transactionSlice.reducer;
