export interface VpsGeneralState {
  vpsList: Array<any>;
  total: number;
  totalMoney: number;
  isLoading: boolean;
  isSubmitting: boolean;
  status: string | null;
  site: any;
  teamSelected: string | null;
  searchByIp: string;
  productName: string;
  dueDate: string | undefined;
  search: any;
  provider: string;
  os: string | undefined;
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}
