import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
// import { TbTerminal2 } from "react-icons/tb";
import React, { useMemo } from "react";
import digitalOceanApi from "@/apis/digital-ocean.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { getListVPSBuCloud } from "@/stores/slices/digital-ocean-slice/digital-ocean-vps-bu-cloud.slice";

interface ActionItem {
  key: string;
  label: string;
  icon: IconType;
  color: string;
}

function ActionVPSDigitalOcean({ item, searchByIp, teamSelected }: any) {
  const iconClasses = "text-xl pointer-events-none flex-shrink-0";
  const actionsList: Array<ActionItem> = [
    // {
    //     key: "console",
    //     label: "Xem console",
    //     icon: TbTerminal2,
    //     color: "text-gray-700",
    // },
    {
      key: "shutdown",
      label: "Tắt nguồn",
      icon: FaPowerOff,
      color: "text-danger",
    },
    {
      key: "power_on",
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
    // {
    //     key: "destroy",
    //     label: "Xóa VPS",
    //     icon: FaRegTrashCan,
    //     color: "text-red-500",
    // },
  ];
  const dispatch = useAppDispatch();
  const vpsManagement = useAppSelector(
    (state) => state.table["vpsmanagement_digital_ocean_bucloud"]
  );
  const fetchData = () => {
    const query: any = {};

    if (searchByIp) {
      query.search = searchByIp;
    }

    if (teamSelected) {
      query["team"] = teamSelected;
    }

    if (vpsManagement) {
      const cPageSize = vpsManagement?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...vpsManagement?.pageSize][0]
        : 10;

      query["pageIndex"] = vpsManagement?.pageIndex || 1;
      query["pageSize"] = cPageSize;

      dispatch(getListVPSBuCloud(query));
    }

    return () => {};
  };
  const onAction = async (key: React.Key) => {
    switch (key) {
      case "restart": {
        const resultZ = await digitalOceanApi.createActionBuCloudDigitalOcean({
          key,
          item,
        });
        if (!resultZ?.status) {
          showToast("Lỗi khi khởi động lại VPS", "error");
          return;
        }
        fetchData();
        showToast("Đang khởi động lại VPS", "info");
        break;
      }
      case "shutdown": {
        const resultZ = await digitalOceanApi.createActionBuCloudDigitalOcean({
          key,
          item,
        });

        if (!resultZ?.status) {
          showToast("Lỗi khi tắt VPS", "error");
          return;
        }
        fetchData();
        showToast("Đang tắt  VPS", "info");
        break;
      }
      case "power_on": {
        const resultZ = await digitalOceanApi.createActionBuCloudDigitalOcean({
          key,
          item,
        });
        if (!resultZ?.status) {
          showToast("Lỗi khi bật VPS", "error");
          return;
        }
        fetchData();
        showToast("Đang bật  VPS", "info");
        break;
      }
    }
  };

  const disableKey = useMemo(() => {
    if (item?.status === "active") {
      return ["power_on"];
    }
    if (
      item?.status === "new" ||
      item?.status === "in-progress" ||
      item?.status === "terminated"
    ) {
      return ["power_on", "destroy", "shutdown", "console", "restart"];
    }
    if (item?.status === "off") {
      return ["shutdown", "restart"];
    }
    return [];
  }, [item]);
  return (
    <>
      <Dropdown radius="sm">
        <DropdownTrigger>
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
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          aria-label="Dropdown menu with icons"
          itemClasses={{
            base: "gap-3",
          }}
          disabledKeys={disableKey}
          onAction={onAction}
        >
          {actionsList?.map((ac: ActionItem) => {
            const Icon = ac?.icon;

            return (
              <DropdownItem
                key={ac?.key}
                // shortcut="⌘N"
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

export default ActionVPSDigitalOcean;
