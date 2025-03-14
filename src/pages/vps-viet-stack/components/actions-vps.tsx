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
import { TbTerminal2 } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import vpsApis from "@/apis/vps-apis";
import NotifyMessage from "@/utils/notify";

interface ActionItem {
  key: string;
  label: string;
  icon: IconType;
  color: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

function ActionsVps({
  id,
  vm,
  serviceId,
}: {
  id: string;
  vm: any;
  serviceId: string;
}) {
  const iconClasses = "text-xl pointer-events-none flex-shrink-0";
  const [statusVps, setStatusVps] = useState("pending");
  const [disabledKeys, setDisabledKeys] = useState([]);

  const actionsList: Array<ActionItem> = [
    {
      key: "console",
      label: "Truy cập panel",
      icon: TbTerminal2,
      color: "text-gray-700",
      isDisabled: false,
    },
    {
      key: "shutdown",
      label: "Tắt nguồn",
      icon: FaPowerOff,
      color: "text-danger",
      // isDisabled:
      //     !statusVps ||
      //     statusVps === "pending" ||
      //     statusVps === "stopped",
    },
    {
      key: "start",
      label: "Mở nguồn",
      icon: VscDebugStart,
      color: "text-primary",
      // isDisabled:
      //     !statusVps ||
      //     statusVps === "pending" ||
      //     statusVps === "running",
    },
    {
      key: "restart",
      label: "Khởi động lại",
      icon: VscDebugRestart,
      color: "text-blue-400",
      // isDisabled:
      //     !statusVps ||
      //     statusVps === "pending" ||
      //     statusVps === "stopped",
    },
    // {
    // 	key: "cancel",
    // 	label: "Hủy Cloud Server trước hạn",
    // 	icon: FaRegTrashCan,
    // 	color: "text-red-500",
    // },
  ];

  const onAction = (key: React.Key) => {
    switch (key) {
      case "console":
        getAccessPanel();
        break;

      case "shutdown":
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
    setStatusVps(vm?.status);

    const arrKeys: any = [];

    if (!vm || !serviceId || !vm?.status || vm?.status === "pending") {
      arrKeys.push(...["shutdown", "start", "restart"]);
    }

    if (vm?.status === "running") {
      arrKeys.push("start");
    }

    if (vm?.status === "stopped") {
      arrKeys.push(...["shutdown", "restart"]);
    }

    setDisabledKeys(arrKeys);

    return () => {};
  }, [vm]);

  const getAccessPanel = async () => {
    try {
      setStatusVps("pending");
      const data = await vpsApis.callAccessPanel(id);

      setStatusVps(vm?.status);
      if (data?.data?.data) {
        window.open(data?.data?.data, "_blank");
      }
    } catch (error) {
      setStatusVps(vm?.status);

      console.log("error: ", error);
      NotifyMessage("Có lỗi xảy ra khi truy cập panel", "error");
    }
  };

  const handleShutdownVps = async () => {
    try {
      setStatusVps("pending");
      await vpsApis.shutdownVps(id, serviceId, vm?.id);

      setStatusVps("stopped");
      NotifyMessage("Đã tắt VPS thành công", "success");
    } catch (error) {
      console.log("error: ", error);

      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
    }
  };

  const handleRebootVps = async () => {
    try {
      setStatusVps("pending");
      await vpsApis.rebootVps(id, serviceId, vm?.id);

      NotifyMessage("Đã khởi động lại VPS thành công", "success");
      setStatusVps("running");
    } catch (error) {
      console.log("error: ", error);
      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
    }
  };

  // const handleStopVps = async () => {
  // 	try {
  // 		setIsLoading(true);
  // 		await vpsApis.stopVps(id, service?.id, vm?.id);
  // 		setIsLoading(false);
  // 		NotifyMessage("Đã tạm dừng VPS thành công", "success");
  // 	} catch (error: any) {
  // 		console.log("error: ", error);
  // 		NotifyMessage("Có lỗi xảy ra", "error");
  // 		setIsLoading(false);
  // 	}
  // };

  const handleStartVps = async () => {
    try {
      setStatusVps("pending");
      await vpsApis.startVps(id, serviceId, vm?.id);
      setStatusVps("running");
      NotifyMessage("Đã khởi động VPS thành công", "success");
    } catch (error: any) {
      console.log("error: ", error);
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
