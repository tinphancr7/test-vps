/* eslint-disable @typescript-eslint/no-unused-vars */
// src/store/slices/serverSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LoginUser,
  NetworkInterface,
  Server,
  StorageDevice,
} from "@/interfaces/upcloud-response.interface";

interface SSHKey {
  title: string;
  value: string;
}

interface ServerState {
  core_number: number | null;
  memory: number | null;
  sshKeys: SSHKey[];
  methodArr: ("ssh" | "otp")[];
  method: "ssh" | "otp";
  minStorageOs: number | null;
  serverName: string | null;
  priceHourlyPlan: number | null;
  licenseHourlyPlan: number | null;
  server: Server;
}

const initialState: ServerState = {
  core_number: null,
  memory: null,
  sshKeys: [],
  methodArr: ["otp", "ssh"],
  method: "ssh",
  minStorageOs: 0,
  serverName: null,
  priceHourlyPlan: 0,
  licenseHourlyPlan: 0,
  server: {
    zone: "sg-sin1",
    title: "",
    hostname: "",
    labels: {
      label: [],
    },
    plan: "",
    storage_devices: {
      storage_device: [
        {
          action: "clone",
          address: "virtio",
          encrypted: "yes",
          size: 0,
          storage: "",
          tier: "maxiops",
          title: "",
        },
      ],
    },
    networking: {
      interfaces: {
        interface: [
          {
            ip_addresses: {
              ip_address: [{ family: "IPv4" }],
            },
            type: "public",
          },
          {
            ip_addresses: {
              ip_address: [{ family: "IPv4" }],
            },
            type: "utility",
          },
          {
            ip_addresses: {
              ip_address: [{ family: "IPv6" }],
            },
            type: "public",
          },
        ],
      },
    },
    login_user: {
      create_password: "no",
      ssh_keys: {
        ssh_key: [],
      },
    },
    firewall: "on",
    metadata: "yes",
    nic_model: "virtio",
    password_delivery: "email",
    simple_backup: "no",
    timezone: "UTC",
    user_data: "",
    video_model: "vga",
  },
};

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    // Setters
    setCoreNumber(state, action: PayloadAction<number>) {
      state.core_number = action.payload;
    },
    setMemory(state, action: PayloadAction<number>) {
      state.memory = action.payload;
    },
    setMinStorageOs(state, action: PayloadAction<number>) {
      state.minStorageOs = action.payload;
    },
    setPriceHourlyPlan(state, action: PayloadAction<number | null>) {
      state.priceHourlyPlan = action.payload;
    },
    setLicenseHourlyPlan(state, action: PayloadAction<number | null>) {
      state.licenseHourlyPlan = action.payload;
    },
    setServerName(state, action: PayloadAction<string>) {
      state.serverName = action.payload;
    },
    setMethod(state, action: PayloadAction<"ssh" | "otp">) {
      state.method = action.payload;
      if (action.payload === "ssh") {
        state.server.login_user = {
          create_password: "no",
          ssh_keys: { ssh_key: [] },
        };
      } else {
        const { login_user, ...restServer } = state.server;
        state.server = restServer;
      }
    },
    setMethodArr(state, action: PayloadAction<("ssh" | "otp")[]>) {
      state.methodArr = action.payload;
    },
    addSSHKey(state, action: PayloadAction<SSHKey>) {
      state.sshKeys.push(action.payload);
    },
    setZone(state, action: PayloadAction<string>) {
      state.server.zone = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.server.title = action.payload;
    },
    setHostname(state, action: PayloadAction<string>) {
      state.server.hostname = action.payload;
    },
    setLabels(state, action: PayloadAction<string[]>) {
      state.server.labels.label = action.payload;
    },
    setPlan(state, action: PayloadAction<string>) {
      state.server.plan = action.payload;
    },
    setStorageDevices(state, action: PayloadAction<StorageDevice[]>) {
      state.server.storage_devices.storage_device = action.payload;
    },
    setNetworkingInterfaces(state, action: PayloadAction<NetworkInterface[]>) {
      state.server.networking.interfaces.interface = action.payload;
    },
    setLoginUser(state, action: PayloadAction<LoginUser>) {
      state.server.login_user = action.payload;
    },
    setFirewall(state, action: PayloadAction<string>) {
      state.server.firewall = action.payload;
    },
    setMetadata(state, action: PayloadAction<string>) {
      state.server.metadata = action.payload;
    },
    setNicModel(state, action: PayloadAction<string>) {
      state.server.nic_model = action.payload;
    },
    setPasswordDelivery(state, action: PayloadAction<string>) {
      state.server.password_delivery = action.payload;
    },
    setSimpleBackup(state, action: PayloadAction<string>) {
      state.server.simple_backup = action.payload;
    },
    setTimezone(state, action: PayloadAction<string>) {
      state.server.timezone = action.payload;
    },
    setUserData(state, action: PayloadAction<string>) {
      state.server.user_data = action.payload;
    },
    setVideoModel(state, action: PayloadAction<string>) {
      state.server.video_model = action.payload;
    },

    // Storage Device Setters
    setStorageDeviceAction(state, action: PayloadAction<string>) {
      if (state.server.storage_devices.storage_device[0]) {
        state.server.storage_devices.storage_device[0].action = action.payload;
      }
    },
    setStorageDeviceAddress(state, action: PayloadAction<string>) {
      if (state.server.storage_devices.storage_device[0]) {
        state.server.storage_devices.storage_device[0].address = action.payload;
      }
    },
    setStorageDeviceEncrypted(state, action: PayloadAction<string>) {
      if (state.server.storage_devices.storage_device[0]) {
        state.server.storage_devices.storage_device[0].encrypted =
          action.payload;
      }
    },
    setStorageDeviceSize(state, action: PayloadAction<number>) {
      if (state.server.storage_devices.storage_device[0]) {
        state.server.storage_devices.storage_device[0].size = action.payload;
      }
    },
    setStorageDeviceStorage(state, action: PayloadAction<string>) {
      if (state.server.storage_devices.storage_device[0]) {
        state.server.storage_devices.storage_device[0].storage = action.payload;
      }
    },
    setStorageDeviceTier(state, action: PayloadAction<string>) {
      if (state.server.storage_devices.storage_device[0]) {
        state.server.storage_devices.storage_device[0].tier = action.payload;
      }
    },
    setStorageDeviceTitle(state, action: PayloadAction<string>) {
      if (state.server.storage_devices.storage_device[0]) {
        state.server.storage_devices.storage_device[0].title = action.payload;
      }
    },
    setServerSSHKeys(state, action: PayloadAction<string[]>) {
      if (state.server?.login_user?.ssh_keys) {
        state.server.login_user.ssh_keys.ssh_key = action.payload;
      }
    },
  },
});

export const {
  setCoreNumber,
  setMemory,
  setMinStorageOs,
  setPriceHourlyPlan,
  setLicenseHourlyPlan,
  setServerName,
  setMethod,
  setMethodArr,
  addSSHKey,
  setZone,
  setTitle,
  setHostname,
  setLabels,
  setPlan,
  setStorageDevices,
  setNetworkingInterfaces,
  setLoginUser,
  setFirewall,
  setMetadata,
  setNicModel,
  setPasswordDelivery,
  setSimpleBackup,
  setTimezone,
  setUserData,
  setVideoModel,
  setStorageDeviceAction,
  setStorageDeviceAddress,
  setStorageDeviceEncrypted,
  setStorageDeviceSize,
  setStorageDeviceStorage,
  setStorageDeviceTier,
  setStorageDeviceTitle,
  setServerSSHKeys,
} = serverSlice.actions;

export default serverSlice.reducer;
