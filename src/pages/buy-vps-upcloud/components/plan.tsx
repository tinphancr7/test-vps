/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { Spinner } from "@heroui/react";
import { fetchPlans } from "@/stores/async-thunks/up-cloud.thunk";
import { RootState, useAppDispatch, useAppSelector } from "@/stores";
import {
  setCoreNumber,
  setMemory,
  setPlan,
  setPriceHourlyPlan,
  setStorageDeviceSize,
} from "@/stores/slices/upcloud/server.slice";
export default function UpCloudPlan() {
  const dispatch = useAppDispatch();

  // Redux selectors
  const plans = useAppSelector((state: RootState) => state.upcloudPlan.plans);
  const isPending = useAppSelector(
    (state: RootState) => state.upcloudPlan.loading
  );
  const minStorageOs = useAppSelector(
    (state: RootState) => state.upCloudServer.minStorageOs
  );
  const selectedPlan = useAppSelector(
    (state: RootState) => state.upCloudServer.server.plan
  );
  const prices = useAppSelector(
    (state: RootState) => state.upCloudResourcePlan.resourcePlans
  );
  const server = useAppSelector(
    (state: RootState) => state.upCloudServer.server
  );
  const priceZone = prices?.find((pr) => pr.name === server?.zone);

  // Dispatch actions to set values
  const setSelectedPlan = (plan: any) => dispatch(setPlan(plan));
  const _setStorageDeviceSize = (size: any) =>
    dispatch(setStorageDeviceSize(size));
  const _setCoreNumber = (coreNumber: any) =>
    dispatch(setCoreNumber(coreNumber));
  const _setMemory = (memory: any) => dispatch(setMemory(memory));
  const _setPriceHourlyPlan = (price: any) =>
    dispatch(setPriceHourlyPlan(price));

  // Fetch plans on mount
  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);
  const getNameTabs = (name: string) => {
    switch (name) {
      case "HICPU":
        return "Hiệu năng CPU cao";
      case "HIMEM":
        return "Bộ nhớ lớn";
      case "General":
        return "Đa năng";
      default:
        return "Developer";
    }
  };
  const getTextPlanByTab = (name: string) => {
    switch (name) {
      case "HICPU":
        return "Gói dịch vụ CPU cao cấp được vận hành trên phần cứng hàng đầu, mang lại hiệu suất tối ưu nhất cho các khối lượng công việc sản xuất.";
      case "HIMEM":
        return "Gói dịch vụ bộ nhớ cao cấp được vận hành trên phần cứng hàng đầu, mang lại hiệu suất tối ưu nhất cho các khối lượng công việc sản xuất.";
      case "General":
        return "Gói dịch vụ toàn năng được vận hành trên phần cứng hàng đầu, mang lại hiệu suất tối ưu nhất cho nhiều mục đích sử dụng khác nhau.";
      default:
        return "Developer plans are perfect for testing, development and hosting personal projects.";
    }
  };
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  const [selectedTab, setSelectedTab] = useState("");
  useEffect(() => {
    if (plans) setSelectedTab(plans[0].type);
  }, [plans]);
  useEffect(() => {
    if (selectedPlan && priceZone) {
      const hourlyPrice =
        (priceZone.lists[`server_plan_${selectedPlan}`]?.price || 0) / 100;
      _setPriceHourlyPlan(hourlyPrice);
    }
  }, [priceZone, selectedPlan, _setPriceHourlyPlan]);

  return (
    <div className="flex flex-col gap-3 rounded-sm border-b-[1px] border-b-gray-300 pb-5">
      <div className="border-b-1 flex w-full items-center justify-between gap-3 border-b-gray-200 px-4 py-5">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            style={{ color: "#ffb44d" }}
          >
            <g fill="#ffb44d" fill-rule="nonzero">
              <path d="M13 13.17a3.001 3.001 0 0 1 0 5.66V33h-2V18.83a3.001 3.001 0 0 1 0-5.66V7h2zm-1 4.33a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M22 23.17a3.001 3.001 0 0 1 0 5.66V33h-2v-4.17a3.001 3.001 0 0 1 0-5.66V7h2zm-1 4.33a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M30 13.17a3.001 3.001 0 0 1 0 5.66V33h-2V18.83a3.001 3.001 0 0 1 0-5.66V7h2zm-1 4.33a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"></path>
            </g>
          </svg>
          <p className="text-[22px]">Gói dịch vụ</p>
        </div>
      </div>
      {isPending ? (
        <div className="flex min-h-36 w-full flex-col items-center justify-center gap-3">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-row border border-gray-200">
              {plans?.map((planGroup) => (
                <div
                  key={planGroup._id}
                  className={`group relative flex basis-1/3 cursor-pointer flex-col items-center justify-center border-r-[1px] border-r-gray-200 py-3 last:!border-r-0 ${
                    selectedTab === planGroup.type
                      ? "text-up-cloud-primary"
                      : "text-black"
                  }`}
                  onClick={() => setSelectedTab(planGroup.type)}
                >
                  <p className="text-base font-normal">
                    {getNameTabs(planGroup.type)}
                  </p>
                  {/* <p className='text-base font-bold'>{tab.price}</p> */}
                  {selectedTab === planGroup.type ? (
                    <div className="absolute bottom-0 h-[2px] w-full bg-up-cloud-primary"></div>
                  ) : (
                    <div className="absolute bottom-0 h-0 w-1/4 bg-[#ffb44d] transition-all duration-200 group-hover:!h-[2px] group-hover:!w-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 py-2">
            <p className="pb-4 pt-2 text-sm text-black">
              {getTextPlanByTab(selectedTab)}
            </p>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full">
                <div className="pl-111 flex basis-1/4 px-2 pl-11">
                  <p className="text-sm font-bold text-black">Số lõi CPU</p>
                </div>
                <div className="flex basis-1/4 px-2 py-2">
                  <p className="text-sm font-bold text-black">Bộ nhớ</p>
                </div>
                <div className="flex basis-1/4 px-2 py-2">
                  <p className="text-sm font-bold text-black">Dung lượng</p>
                </div>
                <div className="flex basis-1/4 items-center gap-1 px-2 py-2">
                  <p className="text-sm font-bold text-black">Giá</p>
                  <p className="text-sm font-normal"> / tháng</p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                {plans
                  ?.find((el) => el.type === selectedTab)
                  ?.listPlan.map((plan) => (
                    <div
                      onClick={() =>
                        (minStorageOs || 0) <= plan.storage_size &&
                        (setSelectedPlan(plan.name),
                        _setStorageDeviceSize(plan.storage_size),
                        _setCoreNumber(plan.core_number),
                        _setMemory(plan.memory_amount))
                      }
                      key={plan._id}
                      className={`${
                        selectedPlan === plan.name && "!border-up-cloud-primary"
                      } ${
                        (minStorageOs || 0) <= plan.storage_size
                          ? "cursor-pointer border-gray-200 bg-gray-50 hover:border-up-cloud-primary"
                          : "cursor-not-allowed border-gray-200 bg-gray-200"
                      } group flex w-full rounded border-[1px]`}
                    >
                      <div
                        className={`flex basis-1/4 items-center gap-1 border-r-[1.5px] border-r-gray-200 px-2 py-4 first:rounded-bl first:rounded-tl last:rounded last:!border-r-0`}
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="plan"
                            value={plan.name}
                            checked={selectedPlan === plan.name}
                            className="mr-3 h-4 w-4 appearance-none rounded-full border-2 border-gray-300 checked:border-up-cloud-primary checked:bg-up-cloud-primary focus:outline-none"
                          />
                          <span
                            className={`absolute right-1/2 top-[42%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/4 rounded-full bg-white ${
                              selectedPlan === plan.name && "bg-white"
                            }`}
                          ></span>
                        </div>
                        <p className="b text-sm !font-bold text-black">
                          {plan.core_number}
                        </p>
                        <p className="b text-sm font-normal text-black">
                          {plan.core_number > 1 ? "cores" : "core"}
                        </p>
                      </div>
                      <div
                        className={`flex basis-1/4 items-center gap-1 border-r-[1.5px] border-r-gray-200 px-2 py-3 first:rounded-bl first:rounded-tl last:rounded last:!border-r-0`}
                      >
                        <p className="b text-sm font-normal text-black first:!font-bold">
                          {plan.memory_amount / 1024}
                        </p>
                        <p className="b text-sm font-normal text-black first:!font-bold">
                          GB
                        </p>
                      </div>
                      <div
                        className={`flex basis-1/4 items-center gap-1 border-r-[1.5px] border-r-gray-200 px-2 py-3 first:rounded-bl first:rounded-tl last:rounded last:!border-r-0`}
                      >
                        <p className="b text-sm font-normal text-black first:!font-bold">
                          {plan.storage_size}
                        </p>
                        <p className="b text-sm font-normal text-black first:!font-bold">
                          GB
                        </p>
                      </div>
                      <div
                        className={`flex basis-1/4 items-center gap-1 border-r-[1.5px] border-r-gray-200 px-2 py-3 first:rounded-bl first:rounded-tl last:rounded last:!border-r-0`}
                      >
                        <p className="b text-sm font-normal text-black first:!font-bold">
                          €{" "}
                          {Math.ceil(
                            ((priceZone?.lists[`server_plan_${plan.name}`]
                              .price || 0) /
                              100) *
                              24 *
                              28
                          )}
                          .00
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
