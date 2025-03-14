import { fetchResourcePlans } from "@/stores/async-thunks/up-cloud.thunk";
import UpCloudLocation from "./components/location";
import UpCloudStorage from "./components/storage";
import { useAppDispatch } from "@/stores";
import { useEffect } from "react";
import UpCloudPlan from "./components/plan";
import UpCloudOperatorSystem from "./components/operator-system";
import UpCloudLoginMethod from "./components/login-method";
import UpCloudSummary from "./components/summary";

export default function BuyVpsUpCloud() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchResourcePlans());
  }, [dispatch]);
  return (
    <div className="flex w-full flex-col">
      <div className="select-none grid-cols-12 rounded-xl">
        <div className="scroll-main relative grid h-full grid-cols-12 gap-x-4 gap-y-6 overflow-visible p-4">
          <div className="col-span-9 flex flex-col gap-2">
            <UpCloudLocation />
            <UpCloudPlan />
            <UpCloudStorage />
            <UpCloudOperatorSystem />
            <UpCloudLoginMethod />
          </div>
          <div className="col-span-3 overflow-y-visible p-4">
            <UpCloudSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
