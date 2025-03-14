export interface VpsBuCloudState {
  vpsList: Array<any>;
  total: number;
  totalMoney: number;
  isLoading: boolean;
  isSubmitting: boolean;
  status: string | undefined;
  site: any;
  teamSelected: string | null;
  searchByIp: string;
  productName: string;
  dueDate: string | undefined;
  os: string | undefined;
  search: any;
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}
