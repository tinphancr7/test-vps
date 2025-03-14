import vpsApis from "@/apis/vps-apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadDetailVm = {
    service: unknown,
    vm: unknown,
	userAaPanel?: string;
	passWorkAaPanel?: string;
	uRLAaPanel?: string;
}

export const asyncThunkGetDetailVmServiceByVpsId = createAsyncThunk<PayloadDetailVm, string>(
	"/vps-vng/get-paging",
	async (id, { rejectWithValue }) => {
		try {
			const { data } = await vpsApis.getDetailVmServiceByVpsId(id);

			const getVm = () => {
				if (Object.keys(data?.data?.vm)?.length) {
					return data?.data?.vm;
				}
				
				if (Object.keys(data?.data?.service?.vm)?.length) {
					return data?.data?.service?.vm;
				}

				return {};
			}

			return {
                service: data?.data?.service,
                vm: getVm(),
				userAaPanel: data?.data?.userAaPanel || "",
				passWorkAaPanel: data?.data?.passWorkAaPanel || "",
				uRLAaPanel: data?.data?.uRLAaPanel || "",
            } as PayloadDetailVm;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);