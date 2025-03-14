import { useCallback, useMemo, useState } from "react";
import { FaCalculator } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/stores";
import { convertEuroToDollar } from "@/utils";
import scaleWayApi from "@/apis/scaleway.api";
import NotifyMessage from "@/utils/notify";
import { Spinner } from "@heroui/react";
import { setInstance } from "@/stores/slices/vps-scaleway-slice";

const EstimatedCost = () => {
  const { instance } = useSelector((state: any) => state?.scaleway);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const { ipv4, zone, name, team, selectedOS, instanceType, tags, publicIps } =
    instance;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const monthlyCost = useMemo(
    () => convertEuroToDollar(instanceType?.monthlyPrice || 0),
    [instanceType]
  );

  const ipCost = useMemo(
    () => (ipv4 === "new-ipv4" ? convertEuroToDollar(0.004 * 730) : 0),
    [ipv4]
  );

  const volumeCost = useMemo(
    () => convertEuroToDollar(0.000118 * instance.volume.size * 730),
    [instance.volume.size]
  );

  const totalCost = useMemo(
    () => parseFloat((monthlyCost + ipCost + volumeCost).toFixed(6)),
    [monthlyCost, ipCost, volumeCost]
  );

  const handleCreateInstance = useCallback(async () => {
    try {
      setConfirmLoading(true);
      let ipResult;
      if (ipv4 === "new-ipv4") {
        ipResult = await scaleWayApi.callCreateIp({
          zone: zone.value,
          body: {},
        });
        dispatch(setInstance({ publicIps: [ipResult.data.data.ip.id] }));
      }

      // Create instance
      const instanceResult = await scaleWayApi.callCreateInstance({
        zone: zone.value,
        body: {
          name,
          teamId: team,
          instanceType: instanceType,
          commercialType: instanceType?.commercialType,
          image: selectedOS?.version?.value,
          volumes: {
            "0": {
              size: instance.volume.size * 1000000000,
              volume_type: instance.volume.volumeType,
            },
          },
          enableDynamicIp: false,
          publicIps:
            ipv4 === "new-ipv4" && ipResult?.data?.data?.ip?.id
              ? [ipResult.data.data.ip.id]
              : publicIps,
          tags,
          pay_method: 17,

          price: totalCost * 26000,
        },
      });

      // start instance

      await scaleWayApi.callPerformAction({
        zone: zone.value,
        serverId: instanceResult?.data?.data?.vps_id?.id,
        body: { action: "poweron", teamId: team },
      });

      navigate(`/vps/bu-cloud/scaleway/${instanceResult?.data?.data?._id}`);

      // update volume

      // await scaleWayApi.callUpdateVolume({
      //   zone: zone.value,
      //   volumeId: instanceResult?.data?.data?.volumes['0'].id,
      //   body: instance?.volume
      // })

      setConfirmLoading(false);

      NotifyMessage("Instance created successfully", "success");
    } catch (error) {
      console.log(error);

      NotifyMessage(
        //   @ts-ignore
        error?.response?.data?.message || "something wrongs",
        "error"
      );
      setConfirmLoading(false);
    }
  }, [
    name,
    instance.volume.size,
    instance.volume.volumeType,
    zone.value,
    instanceType?.commercialType,
    selectedOS?.version?.value,
    ipv4,
    publicIps,
    tags,
    totalCost,
    navigate,
  ]);

  const isCreateDisabled =
    !name ||
    !instanceType?.commercialType ||
    !selectedOS?.version ||
    !zone ||
    !instanceType ||
    (ipv4 !== "new-ipv4" && publicIps.length === 0);

  return (
    <div>
      <div className="mx-auto space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center font-semibold text-gray-700">
            <FaCalculator className="mr-2 text-primary" />
            <span>Estimated cost</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 text-lg">
          <div className="col-span-8 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-500">Availability Zone</span>
              <span className="flex items-center">
                <img src={zone.url} alt="Zone Flag" className="mr-2 h-4 w-4" />
                <span className="font-medium text-gray-700">{zone.label}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-500">Server</span>
              <span className="font-medium text-gray-700">
                {instanceType?.commercialType}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-lg text-gray-500">Image</span>
              <span className="flex items-center">
                <img
                  src={`/icons/${selectedOS?.logoUrl}`}
                  alt="OS Logo"
                  className="mr-2 h-5 w-5"
                />
                <span className="font-medium text-gray-700">
                  {selectedOS?.version?.label}
                </span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-lg text-gray-500">
                Block Storage{" "}
                {instance?.volume.perf_iops === 5000 ? "5K" : "15K"}
              </span>
              <span className="font-medium text-gray-700">
                {instance.volume.size} GB
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-lg text-gray-500">Flexible IP</span>
              <span className="font-medium text-gray-700">
                {ipv4 === "new-ipv4" ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <div className="col-span-4 space-y-5">
            <div className="flex justify-end">
              <span className="text-gray-500">$0.00</span>
            </div>
            <div className="flex justify-end">
              <span className="font-medium text-primary">${monthlyCost}</span>
            </div>
            <div className="flex justify-end">
              <span className="text-gray-500">$0.00</span>
            </div>
            <div className="flex justify-end">
              <span className="font-medium text-primary">${volumeCost}</span>
            </div>
            <div className="flex justify-end">
              <span className="font-medium text-primary">${ipCost}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end text-2xl font-semibold text-primary">
          <span>${totalCost}</span>
        </div>
      </div>

      <button
        onClick={handleCreateInstance}
        className={`mt-10 flex w-full items-center justify-center gap-4 rounded-md bg-primary p-3 font-semibold text-white ${
          confirmLoading || isCreateDisabled
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
        disabled={isCreateDisabled}
      >
        {confirmLoading && (
          <Spinner
            size="sm"
            classNames={{
              circle1: "border-b-white",
              circle2: "border-b-white",
            }}
          />
        )}
        Create Instance
      </button>
    </div>
  );
};

export default EstimatedCost;
