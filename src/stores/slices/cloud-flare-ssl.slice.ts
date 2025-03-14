/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getSslAutomaticMode,
  getSslInfo,
  getTlsVersions,
  getZone,
  getZoneAnalytic,
} from "../async-thunks/cloud-flare-ssl.thunk";

interface SslState {
  ssl: {
    value: string;
    modified_on: Date | string;
    certificate_status: string;
    editable: boolean;
  };
  ssl_automatic_mode: {
    value: string;
    next_scheduled_scan: Date | string;
    modified_on: Date | string;
    editable: boolean;
  };
  clientSSLMap: any[];
  loadingSsl: boolean;
  loadingSslMode: boolean;
  loadingVersion: boolean;
  errorSsl: boolean;
  errorSslMode: boolean;
  errorVersion: boolean;
  accountId: string;
  domainName: string;
  domainStatus: string;
  loadingZone: boolean;
  loadingAnalytic: boolean;
  errorAnalytic: boolean;
  analyticMap: any[];
}

const initialState: SslState = {
  ssl: {
    value: "",
    modified_on: new Date(),
    certificate_status: "",
    editable: false,
  },
  ssl_automatic_mode: {
    value: "",
    next_scheduled_scan: new Date(),
    modified_on: new Date(),
    editable: false,
  },
  clientSSLMap: [],
  loadingSsl: false,
  loadingSslMode: false,
  loadingVersion: false,
  errorSsl: false,
  errorSslMode: false,
  errorVersion: false,
  accountId: "",
  domainName: "",
  domainStatus: "",
  loadingZone: false,
  loadingAnalytic: false,
  errorAnalytic: false,
  analyticMap: [],
};

const sslSlice = createSlice({
  name: "ssl",
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
    },
    setDomainName: (state, action: PayloadAction<string>) => {
      state.domainName = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get SSL Info
    builder
      .addCase(getSslInfo.pending, (state) => {
        state.loadingSsl = true;
        state.errorSsl = false;
      })
      .addCase(getSslInfo.fulfilled, (state, action: PayloadAction<any>) => {
        state.errorSsl = false;
        state.loadingSsl = false;
        state.ssl = {
          value: action.payload.value,
          modified_on: new Date(action.payload.modified_on),
          certificate_status: action.payload.certificate_status,
          editable: action.payload.editable,
        };
      })
      .addCase(getSslInfo.rejected, (state, _action) => {
        state.errorSsl = true;
        state.loadingSsl = false;
      });

    // Get SSL Automatic Mode
    builder
      .addCase(getSslAutomaticMode.pending, (state) => {
        state.loadingSslMode = true;
        state.errorSslMode = false;
      })
      .addCase(
        getSslAutomaticMode.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.errorSslMode = false;
          state.loadingSslMode = false;
          state.ssl_automatic_mode = {
            value: action.payload.value,
            next_scheduled_scan: action.payload.next_scheduled_scan
              ? new Date(action.payload.next_scheduled_scan)
              : new Date(),
            modified_on: new Date(action.payload.modified_on),
            editable: action.payload.editable,
          };
        }
      )
      .addCase(getSslAutomaticMode.rejected, (state, _action) => {
        state.errorSslMode = true;
        state.loadingSslMode = false;
      });

    // Get TLS Versions
    builder
      .addCase(getTlsVersions.pending, (state) => {
        state.loadingVersion = true;
        state.errorVersion = false;
      })
      .addCase(
        getTlsVersions.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.errorVersion = false;
          state.loadingVersion = false;
          state.clientSSLMap =
            action.payload?.data?.viewer?.zones[0]?.httpRequests1hGroups[0]?.sum
              ?.clientSSLMap || [];
        }
      )
      .addCase(getTlsVersions.rejected, (state, _action) => {
        state.clientSSLMap = [];
        state.loadingVersion = false;
        state.errorVersion = false;
      });

    //getZone
    builder
      .addCase(getZone.pending, (state) => {
        state.loadingZone = true;
      })
      .addCase(getZone.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingZone = false;

        state.domainName = action.payload?.name;
        state.domainStatus = action.payload?.status;
      })
      .addCase(getZone.rejected, (state, _action) => {
        state.domainName = "(Trống)";
        state.domainStatus = "pending";
        state.loadingZone = false;
      });

    builder
      .addCase(getZoneAnalytic.pending, (state) => {
        state.loadingAnalytic = true;
        state.errorAnalytic = false;
      })
      .addCase(
        getZoneAnalytic.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.errorAnalytic = false;
          state.loadingAnalytic = false;
          state.analyticMap = action.payload?.data?.viewer?.zones[0] || [];
        }
      )
      .addCase(getZoneAnalytic.rejected, (state, _action) => {
        state.analyticMap = [];
        state.loadingAnalytic = false;
        state.errorAnalytic = false;
      });
  },
});
export const { setAccountId, setDomainName } = sslSlice.actions;
export default sslSlice.reducer;
