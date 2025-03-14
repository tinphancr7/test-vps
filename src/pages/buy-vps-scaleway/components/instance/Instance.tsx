import { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchInstanceTypes,
  setInstance,
} from "@/stores/slices/vps-scaleway-slice";
import { AppDispatch } from "@/stores";
import { Card, Pagination, Skeleton, Tooltip } from "@heroui/react";
import {
  convertBandwidth,
  convertEuroToDollar,
  convertToMemory,
} from "@/utils";

const Instance = () => {
  const { instance, instanceTypes, isLoading } = useSelector(
    (state: any) => state?.scaleway
  );

  const dispatch = useDispatch<AppDispatch>();

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    // Fetch data here
    if (instance.zone?.value && instance.team) {
      dispatch(
        fetchInstanceTypes({
          page: current,
          perPage: 10,
          zone: instance.zone?.value,
          teamId: instance.team,
        })
      );
    }
  }, [instance.zone?.value, current, instance.team, dispatch]);

  return (
    <div className="">
      {/* Header Row */}
      <div className="mb-4 flex text-base font-medium text-gray-500">
        <div className="w-[20%]">Name</div>
        <div className="w-[20%]">Price (excl. tax.)</div>
        <div className="w-[15%]">vCPUs</div>
        <div className="w-[15%]">Memory</div>
        <div className="w-[15%]">Storage</div>
        <div className="w-[15%]">Bandwidth</div>
      </div>

      {/* Active Row */}
      {isLoading ? (
        <div className="grid grid-cols-12 gap-4">
          {new Array(6).fill(0).map((_) => (
            <Card className="col-span-4 p-5">
              <div className="w-full flex items-center gap-3">
                <Skeleton className="flex rounded-full w-12 h-12 flex-shrink-0" />
                <Skeleton className="h-3 w-full rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {instanceTypes?.result?.length > 0 ? (
            <div>
              {instanceTypes?.result?.map((item: any, index: number) => (
                <div
                  key={index}
                  onClick={() => dispatch(setInstance({ instanceType: item }))}
                  className={`mb-4 flex cursor-pointer items-center rounded-lg border bg-white py-2 font-semibold hover:border-primary ${
                    item?.commercialType ===
                    instance?.instanceType?.commercialType
                      ? "border-primary text-primary"
                      : "text-gray-600"
                  }`}
                >
                  <div className="w-[20%] whitespace-nowrap px-4 py-2">
                    {item?.commercialType}
                  </div>
                  <div className="w-[20%] whitespace-nowrap px-4 py-2">
                    ${convertEuroToDollar(item?.monthlyPrice)}/month
                  </div>
                  <div className="w-[15%] whitespace-nowrap px-4 py-2">
                    {item?.ncpus}
                  </div>
                  <div className="w-[15%] whitespace-nowrap px-4 py-2">
                    {convertToMemory(item?.ram)}
                  </div>
                  <div className="relative w-[15%] whitespace-nowrap px-4 py-2">
                    {item?.perVolumeConstraint?.lSsd?.minSize > 0 ? (
                      <div className="flex items-center gap-1">
                        <span> Block / Local</span>
                        <Tooltip
                          showArrow={true}
                          title={`Up to 300 GB NVMe and 10 TB Block Storage`}
                          className="w-full max-w-[150px] p-2 text-center"
                        >
                          <span>
                            <IoMdInformationCircleOutline size={18} />
                          </span>
                        </Tooltip>
                      </div>
                    ) : (
                      "Block"
                    )}
                  </div>
                  <div className="w-[15%] whitespace-nowrap px-4 py-2">
                    {convertBandwidth(item?.network?.sumInternalBandwidth)}
                  </div>
                </div>
              ))}
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={current}
                  total={instanceTypes?.meta?.totalPages || 0}
                  onChange={(page) => setCurrent(page)}
                />
              </div>
              {/* <Pagination
								showSizeChanger={false}
								align="center"
								defaultCurrent={1}
								total={instanceTypes?.meta?.totalItems || 0}
								current={current}
								onChange={onChange}
							/> */}
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 text-gray-500">
              No data found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Instance;
