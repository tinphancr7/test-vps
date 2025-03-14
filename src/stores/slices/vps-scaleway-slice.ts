import scaleWayApi from "@/apis/scaleway.api";
import { listZones, osOptions } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// @ts-ignore
import randomName from "@scaleway/random-name";

// Thunk for fetching instances
export const fetchInstances = createAsyncThunk(
  "scaleway/fetchInstances",
  async (query, { rejectWithValue }) => {
    try {
      const response = await scaleWayApi.callFetchInstances(query);
      return response?.data?.data || { result: [], meta: {} };
    } catch (error) {
      console.error("Failed to fetch instances", error);
      return rejectWithValue(error);
    }
  }
);

// Thunk for fetching instance detail
export const fetchInstanceDetail = createAsyncThunk(
  "scaleway/fetchInstanceDetail",
  async (id, { rejectWithValue }) => {
    try {
      // @ts-ignore
      const response = await scaleWayApi.callFetchInstanceDetail(id);
      return response?.data?.data || {};
    } catch (error) {
      console.error("Failed to fetch instance detail", error);
      return rejectWithValue(error);
    }
  }
);

// Thunk for fetching instance types
export const fetchInstanceTypes = createAsyncThunk(
  "scaleway/fetchInstanceTypes",
  async (query: any, { rejectWithValue }) => {
    try {
      const response = await scaleWayApi.callFetchInstanceTypes(query);
      return response?.data?.data || { result: [], meta: {} };
    } catch (error) {
      console.error("Failed to fetch instance types", error);
      return rejectWithValue(error);
    }
  }
);

// Thunk for fetching IPs
export const fetchIps = createAsyncThunk(
  "scaleway/fetchIps",
  async ({ page, perPage, zone }: any, { rejectWithValue }) => {
    try {
      const response = await scaleWayApi.callFetchIps({ page, perPage, zone });
      const existIps =
        response?.data?.data?.ips
          ?.filter((item: any) => item.state === "detached")
          ?.map((it: any) => ({
            label: it?.address,
            value: it?.id,
          })) || [];
      return existIps;
    } catch (error) {
      console.error("Failed to fetch IPs", error);
      return rejectWithValue(error);
    }
  }
);

// Thunk for fetching SSH keys
export const fetchSSHKeys = createAsyncThunk(
  "scaleway/fetchSSHKeys",
  async ({ page, perPage }: any, { rejectWithValue }) => {
    try {
      const response = await scaleWayApi.callFetchSShKeys({ page, perPage });
      return response?.data?.data?.sshKeys || [];
    } catch (error) {
      console.error("Failed to fetch SSH keys", error);
      return rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  vpsList: { result: [], meta: {} },
  vpsItem: {},
  statusVps: "",
  instance: {
    zone: listZones[0],
    team: "",
    name: randomName("srv"),
    ipv4: "new-ipv4",
    tags: [],
    publicIps: [],
    instanceType: {},
    volume: {
      name: randomName("vol"),
      perf_iops: 5000,
      size: 10,
      volumeType: "sbs_volume",
    },
    selectedOS: osOptions[0],
  },
  instanceTypes: { result: [], meta: {} },
  existIps: [],
  sshKeys: [],
  isLoading: false,
  error: null,
  status: "",

  teamSelected: null,
  searchByIp: "",
};

// Slice for Scaleway
const scalewaySlice = createSlice({
  name: "scaleway",
  initialState,
  reducers: {
    setInstance(state, action) {
      state.instance = { ...state.instance, ...action.payload };
    },
    setVpsInstance(state, action) {
      state.vpsItem = {
        ...state.vpsItem,
        ...action.payload,
      };
    },
    setStatusVps(state, action) {
      state.statusVps = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setTeamSelected: (state, action) => {
      state.teamSelected = action.payload;
    },

    setSearchByIp: (state, action) => {
      state.searchByIp = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch instances
    builder
      .addCase(fetchInstances.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInstances.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.vpsList = action.payload;
      })
      .addCase(fetchInstances.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload;
      });

    // Fetch instance detail
    builder
      .addCase(fetchInstanceDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInstanceDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vpsItem = action.payload;
      })
      .addCase(fetchInstanceDetail.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload;
      });

    // Fetch instance types
    builder
      .addCase(fetchInstanceTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInstanceTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.instanceTypes = action.payload;
        state.instance.instanceType = action.payload.result[0] || {};
      })
      .addCase(fetchInstanceTypes.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload;
      });

    // Fetch IPs
    builder
      .addCase(fetchIps.fulfilled, (state, action) => {
        state.existIps = action.payload;
      })
      .addCase(fetchIps.rejected, (state, action) => {
        // @ts-ignore
        state.error = action.payload;
      });

    // Fetch SSH keys
    builder
      .addCase(fetchSSHKeys.fulfilled, (state, action) => {
        state.sshKeys = action.payload;
      })
      .addCase(fetchSSHKeys.rejected, (state, action) => {
        // @ts-ignore
        state.error = action.payload;
      });
  },
});

export const {
  setInstance,
  setVpsInstance,
  setStatusVps,
  setStatus,
  setTeamSelected,
  setSearchByIp,
} = scalewaySlice.actions;
export default scalewaySlice.reducer;
