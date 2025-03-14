import { createAsyncThunk } from "@reduxjs/toolkit";
import cloudflareSslApi from "@/apis/cloudflare-ssl.api";
import cloudflareApis from "@/apis/cloudflare-api";

// Define thunks for each API call
export const getSslInfo = createAsyncThunk(
  "ssl/getSslInfo",
  async (zoneId: string, { rejectWithValue }) => {
    try {
      const response = await cloudflareSslApi.getInforSsl(zoneId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSslAutomaticMode = createAsyncThunk(
  "ssl/getSslAutomaticMode",
  async (zoneId: string, { rejectWithValue }) => {
    try {
      const response = await cloudflareSslApi.getInforSslAutomaticMode(zoneId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTlsVersions = createAsyncThunk(
  "ssl/getTlsVersions",
  async (
    { zoneTag, datetimeStart, datetimeEnd, limit }: any,
    { rejectWithValue }
  ) => {
    try {
      const response = await cloudflareSslApi.getTLSVersions({
        zoneTag,
        datetimeStart,
        datetimeEnd,
        limit,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getZone = createAsyncThunk(
  "ssl/zone",
  async (zoneId: string, { rejectWithValue }) => {
    try {
      const response = await cloudflareSslApi.getZone(zoneId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getZoneAnalytic = createAsyncThunk(
  "ssl/getZoneAnalytic",
  async ({ zone_id, since, until, type }: any, { rejectWithValue }) => {
    try {
      const response = await cloudflareApis.getZoneAnalytics({
        zone_id,
        since,
        until,
        type,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
