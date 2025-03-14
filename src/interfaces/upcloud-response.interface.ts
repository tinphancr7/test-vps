export interface UpCloudPlanResponse {
  status: number;
  message: string;
  data: PlanGroup[];
}
export interface Plan {
  _id: string;
  core_number: number;
  memory_amount: number;
  name: string;
  public_traffic_out: number;
  storage_size: number;
  storage_tier: string;
}

export interface PlanGroup {
  _id: string;
  type: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  listPlan: Plan[];
}
export interface UpCloudPriceResponse {
  status: number;
  message: string;
  data: ResourcePlan[];
}
export interface ResourceItem {
  amount: number;
  price: number;
}

export interface ResourcePlan {
  _id: string;
  name: string;
  lists: {
    [key: string]: ResourceItem;
  };
}
export interface StorageDevice {
  action: string;
  address: string;
  encrypted: string;
  size: number;
  storage: string;
  tier: string;
  title: string;
}

export interface IPAddress {
  family: string;
}

export interface NetworkInterface {
  ip_addresses: {
    ip_address: IPAddress[];
  };
  type: string;
}

export interface LoginUser {
  create_password?: string;
  ssh_keys?: {
    ssh_key?: string[];
  };
}

export interface Server {
  zone: string;
  title: string;
  hostname: string;
  labels: {
    label: string[];
  };
  plan: string;
  storage_devices: {
    storage_device: StorageDevice[];
  };
  networking: {
    interfaces: {
      interface: NetworkInterface[];
    };
  };
  login_user?: LoginUser;
  firewall: string;
  metadata: string;
  nic_model: string;
  password_delivery: string;
  simple_backup: string;
  timezone: string;
  user_data: string;
  video_model: string;
}
export interface StorageResponse {
  status: number;
  message: string;
  data: StorageUpCloud[];
}
export interface StorageUpCloud {
  _id: string;
  access: string;
  encrypted: string;
  labels: string[];
  license: number;
  size: number;
  state: string;
  template_type: string;
  title: string;
  type: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  version?: string;
}
export interface ZoneResponse {
  status: number;
  message: string;
  data: Zone[];
}
export interface Zone {
  _id: string;
  description: string;
  id: string;
  public: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StorageDevice {
  action: string;
  address: string;
  encrypted: string;
  size: number;
  storage: string;
  tier: string;
  title: string;
}

export interface IPAddress {
  family: string;
}

export interface NetworkInterface {
  ip_addresses: {
    ip_address: IPAddress[];
  };
  type: string;
}

export interface LoginUser {
  create_password?: string;
  ssh_keys?: {
    ssh_key?: string[];
  };
}

export interface Server {
  zone: string;
  title: string;
  hostname: string;
  labels: {
    label: string[];
  };
  plan: string;
  storage_devices: {
    storage_device: StorageDevice[];
  };
  networking: {
    interfaces: {
      interface: NetworkInterface[];
    };
  };
  login_user?: LoginUser;
  firewall: string;
  metadata: string;
  nic_model: string;
  password_delivery: string;
  simple_backup: string;
  timezone: string;
  user_data: string;
  video_model: string;
}
