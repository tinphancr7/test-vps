import scaleWayApi from "@/apis/scaleway.api";
import { useAppDispatch } from "@/stores";
import { setVpsInstance } from "@/stores/slices/vps-scaleway-slice";
import NotifyMessage from "@/utils/notify";
import { Switch } from "@heroui/react";
import { useCallback } from "react";
import { FaMicrochip } from "react-icons/fa6";
import { useSelector } from "react-redux";

// Define TypeScript types for props
interface InstanceHeaderProps {
  commercialType: string;
  name: string;
  state: "running" | "starting" | "stopping" | "stopped";
  zone: string;
  serverId: string;
  teamId: string;
}

const InstanceHeader = ({
  commercialType,
  name,
  state,
  zone,
  serverId,
  teamId,
}: InstanceHeaderProps) => {
  const dispatch = useAppDispatch();
  const { vpsItem } = useSelector((state: any) => state?.scaleway);
  const serverActionService = useCallback(
    async (id: string, action: string) => {
      try {
        const desiredStatus =
          action === "poweron" || action === "reboot" ? "starting" : "stopping";

        dispatch(
          setVpsInstance({
            vps_id: {
              ...vpsItem?.vps_id,
              state: desiredStatus,
            },
          })
        );

        const response = await scaleWayApi.callPerformAction({
          zone,
          serverId: id,
          body: { action, teamId },
        });

        dispatch(
          setVpsInstance({
            vps_id: {
              ...vpsItem?.vps_id,
              state: response?.data?.data?.state || state,
            },
          })
        );
      } catch (error) {
        dispatch(
          setVpsInstance({
            vps_id: {
              ...vpsItem?.vps_id,
              state,
            },
          })
        );
        NotifyMessage(
          // @ts-ignore
          error?.response?.data?.message || "Something went wrong",
          "error"
        );
      }
    },
    [zone, setVpsInstance, state]
  );

  // Helper functions for conditional classes
  const getStatusIndicatorClass = () => {
    return state === "running"
      ? "bg-green-500"
      : state === "starting" || state === "stopping"
      ? "bg-blue-500"
      : "bg-black";
  };

  const isDisabled =
    state === "stopping" || state === "starting" || state === "stopped";

  return (
    <div className="mx-auto mb-10 flex max-w-4xl items-center justify-between">
      {/* Instance Icon and Details */}
      <div className="flex items-center space-x-4">
        {/* Status Indicator */}
        <span
          className={`${getStatusIndicatorClass()} inline-block h-2 w-2 rounded-full`}
        ></span>

        {/* Icon */}
        <div className="rounded-full bg-purple-100 p-2">
          <FaMicrochip className="text-purple-600" size={24} />
        </div>

        {/* Instance Name and Type */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{commercialType}</p>
        </div>
      </div>

      {/* Reboot Button and Switch */}
      <div className="flex items-center gap-4">
        <button
          className={`rounded bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 ${
            isDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => serverActionService(serverId, "reboot")}
          disabled={isDisabled}
        >
          Reboot
        </button>
        <Switch
          isSelected={state === "running" || state === "stopping"}
          isDisabled={state === "stopping" || state === "starting"}
          onValueChange={(checked) => {
            console.log("checked", checked);
            serverActionService(serverId, checked ? "poweron" : "poweroff");
          }}
        />
      </div>
    </div>
  );
};

export default InstanceHeader;
