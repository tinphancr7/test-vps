export interface VpsVngState {
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
  os: string | undefined;
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}
