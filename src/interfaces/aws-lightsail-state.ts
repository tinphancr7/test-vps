export interface AwsLightsailState {
  instancesList: Array<any>;
  instance: any;
  total: number;
  totalPrice: number;
  isLoading: boolean;
  isSubmitting: boolean;
  status: string | undefined;
  teamSelected: string | null;
  searchByIp: string;
}
