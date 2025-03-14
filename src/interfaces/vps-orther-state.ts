export interface VpsOrtherState {
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
  search: any;
  os: string | undefined;
  provider: string;
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}
