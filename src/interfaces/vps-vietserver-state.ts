export interface VpsVietServerState {
  vpsList: Array<any>;
  total: number;
  totalMoney: number;
  isLoading: boolean;
  isSubmitting: boolean;
  status: string | undefined;
  teamSelected: string | null;
  searchByIp: string;
  productName: string;
  site: any;
  dueDate: string | undefined;
  os: string | undefined;
  search: any;
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}
