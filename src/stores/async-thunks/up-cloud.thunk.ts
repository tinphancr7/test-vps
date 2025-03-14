/* eslint-disable @typescript-eslint/no-unused-vars */
import cloudApi from "@/apis/upcloud-client.api";
import {
  ResourcePlan,
  StorageUpCloud,
  UpCloudPlanResponse,
  Zone,
} from "@/interfaces/upcloud-response.interface";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPlans = createAsyncThunk<UpCloudPlanResponse["data"]>(
  "plans/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cloudApi.getListPlan();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch plans");
    }
  }
);

export const fetchResourcePlans = createAsyncThunk<ResourcePlan[]>(
  "resourcePlans/fetchResourcePlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cloudApi.getPrices();
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch resource plans");
    }
  }
);
export const fetchStorages = createAsyncThunk<StorageUpCloud[]>(
  "storage/fetchStorages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cloudApi.getStorages();
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch storages");
    }
  }
);
export const fetchZones = createAsyncThunk<Zone[]>(
  "zone/fetchZones",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cloudApi.getZones();
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch zones");
    }
  }
);

export const createServer = createAsyncThunk(
  "server/createServer",
  async (body: any, { rejectWithValue }) => {
    try {
      const response = await cloudApi.createServer(body);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// type PayloadVps = {
//   totalMoney: number;
//   data: Array<any>;
//   total: number;
//   pageIndex: number;
//   pageSize: number;
//   totalPages: number;
// };

export const asyncThunkPaginationVpsBuCloudUpCloud = createAsyncThunk(
  "/bucloud/get-paging-upcloud",
  async (query: any, { rejectWithValue }) => {
    try {
      const { data } = await cloudApi.getPaging(query);

      return {
        data: data?.data,
        total: data?.total,
        totalMoney: data?.totalMoney,
        pageIndex: data?.pageIndex,
        pageSize: data?.pageSize,
        totalPages: data?.totalPages,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
