import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Tooltip,
} from "@heroui/react";
import { IconType } from "react-icons";
import {} from "react-icons/vsc";
import { FaPowerOff } from "react-icons/fa6";
import {
  VscSettingsGear,
  VscDebugRestart,
  VscDebugStart,
} from "react-icons/vsc";
import React, { useEffect, useState } from "react";
import NotifyMessage from "@/utils/notify";
import scaleWayApi from "@/apis/scaleway.api";

import { useAppDispatch } from "@/stores";
import { fetchInstances } from "@/stores/slices/vps-scaleway-slice";

interface ActionItem {
  key: string;
  label: string;
  icon: IconType;
  color: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

function ActionsVps({ vm }: { id: string; vm: any }) {
  const iconClasses = "text-xl pointer-events-none flex-shrink-0";
  const [statusVps, setStatusVps] = useState("");
  const dispatch = useAppDispatch();
  const [disabledKeys, setDisabledKeys] = useState([]);

  const actionsList: Array<ActionItem> = [
    {
      key: "stop",
      label: "Tắt nguồn",
      icon: FaPowerOff,
      color: "text-danger",
    },
    {
      key: "start",
      label: "Mở nguồn",
      icon: VscDebugStart,
      color: "text-primary",
    },
    {
      key: "restart",
      label: "Khởi động lại",
      icon: VscDebugRestart,
      color: "text-blue-400",
    },
  ];

  const onAction = (key: React.Key) => {
    switch (key) {
      case "stop":
        handleShutdownVps();
        break;

      case "start":
        handleStartVps();
        break;

      case "restart":
        handleRebootVps();
        break;
    }
  };

  useEffect(() => {
    setStatusVps(vm?.state);

    const arrKeys: any = [];

    if (vm?.state === "running") {
      arrKeys.push(...["start"]);
    } else if (vm?.state === "stopped") {
      arrKeys.push("stop", "restart");
    } else {
      arrKeys.push(...["stop", "start", "restart"]);
    }
    setDisabledKeys(arrKeys);

    return () => {};
  }, [vm]);

  const handleShutdownVps = async () => {
    try {
      setStatusVps("pending");
      await scaleWayApi.callPerformAction({
        zone: vm?.zone,
        serverId: vm?.id,
        body: { action: "poweroff" },
      });
      setStatusVps("stopped");
      dispatch(fetchInstances());
      NotifyMessage("Đã tắt VPS thành công", "success");
    } catch (error) {
      console.error("Error:", error);
      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
    }
  };

  const handleRebootVps = async () => {
    try {
      setStatusVps("pending");
      await scaleWayApi.callPerformAction({
        zone: vm?.zone,
        serverId: vm?.id,
        body: { action: "reboot" },
      });
      setStatusVps("running");
      dispatch(fetchInstances());
      NotifyMessage("Đã khởi động lại VPS thành công", "success");
    } catch (error) {
      console.error("Error:", error);
      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
    }
  };

  const handleStartVps = async () => {
    try {
      setStatusVps("pending");

      await scaleWayApi.callPerformAction({
        zone: vm?.zone,
        serverId: vm?.id,
        body: { action: "poweron" },
      });
      setStatusVps("running");
      dispatch(fetchInstances());
      NotifyMessage("Đã khởi động VPS thành công", "success");
    } catch (error) {
      console.error("Error:", error);
      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
    }
  };

  return (
    <>
      <Dropdown radius="sm">
        <DropdownTrigger>
          {statusVps === "pending" ? (
            <Spinner size="sm" color="primary" />
          ) : (
            <Button
              variant="solid"
              radius="full"
              className={`text-blue-500 bg-transparent min-w-0 w-max p-1 h-max min-h-max`}
            >
              <Tooltip
                content={"Điều khiển"}
                classNames={{
                  base: "",
                  content: "bg-blue-500 text-light",
                }}
              >
                <i>
                  <VscSettingsGear className="min-w-max text-base w-6 h-6" />
                </i>
              </Tooltip>
            </Button>
          )}
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          aria-label="Dropdown menu with icons"
          itemClasses={{
            base: "gap-3",
          }}
          onAction={onAction}
          disabledKeys={disabledKeys}
        >
          {actionsList?.map((ac: ActionItem) => {
            const Icon = ac?.icon;

            return (
              <DropdownItem
                key={ac?.key}
                startContent={
                  <Icon className={`${iconClasses} ${ac?.color}`} />
                }
              >
                {ac?.label}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

export default ActionsVps;
