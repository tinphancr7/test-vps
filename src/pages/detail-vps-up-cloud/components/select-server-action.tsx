/* eslint-disable @typescript-eslint/no-unused-vars */
import cloudApi from "@/apis/upcloud-client.api";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { IoIosPower } from "react-icons/io";
import { RiRestartLine } from "react-icons/ri";

export default function SelectServerAction({
  id,
  onUpdateServer,
  status,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const checkServerStatus = async () => {
    try {
      const response: any = await cloudApi.getDetailServer(id || "");
      const currentStatus = response?.data?.server.server?.state;

      if (currentStatus === "started" || currentStatus === "stopped") {
        setIsRestarting(false);
        setIsShuttingDown(false);
        setIsStart(false);
        onUpdateServer(response?.data?.server?.server);
      } else {
        setTimeout(checkServerStatus, 5000);
      }
    } catch (error) {
      checkServerStatus();
    }
  };
  const handleAction = async (action: "start" | "stop" | "restart") => {
    const retryAction = async (action: "start" | "stop" | "restart") => {
      try {
        switch (action) {
          case "start":
            setIsStart(true);
            await cloudApi.startServer(id);
            break;
          case "stop":
            setIsShuttingDown(true);
            await cloudApi.stopServer(id);
            break;
          case "restart":
            setIsRestarting(true);
            await cloudApi.restartServer(id);
            break;
        }
        setTimeout(async () => {
          checkServerStatus();
        }, 5000);
      } catch (error) {
        console.error(`Error with action ${action}: Retrying...`, error);
        setTimeout(async () => {
          await retryAction(action);
        }, 5000);
      }
    };

    await retryAction(action);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex w-full items-center justify-end gap-1">
      <p className="text-[15px] font-normal">Trạng thái</p>
      <div className="flex flex-row items-center justify-center gap-2 px-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isShuttingDown || isRestarting || isStart
              ? "bg-yellow-500"
              : status === "maintenance"
              ? "bg-orange-500"
              : status === "started"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        ></span>
        <p className="text-sm font-bold">
          {status === "maintenance"
            ? "Đang bảo trì"
            : isShuttingDown
            ? "Đang tắt"
            : isRestarting
            ? "Đang khởi động lại"
            : isStart
            ? "Đang khởi động"
            : status === "started"
            ? "Đang chạy"
            : "Đã tắt"}
        </p>
      </div>
      <div
        className={`flex min-w-36 flex-row items-center justify-center gap-2`}
      >
        <div
          className={`${
            isShuttingDown || isRestarting || isStart
              ? "!cursor-not-allowed"
              : "cursor-pointer"
          } flex w-full select-none items-center justify-center gap-2 rounded-sm bg-up-cloud-primary px-4 py-2`}
          onClick={() => {
            if (
              status !== "maintenance" &&
              !isShuttingDown &&
              !isRestarting &&
              !isStart
            ) {
              handleAction(status === "started" ? "stop" : "start");
            }
          }}
        >
          <span className="font-bold">
            <IoIosPower color="white" size={20} />
          </span>
          <p className="text-sm text-white">
            {status === "maintenance"
              ? "Đang khởi tạo"
              : isShuttingDown
              ? "Đang tắt"
              : isRestarting
              ? "Đang khởi động lại"
              : isStart
              ? "Đang khởi động"
              : status === "started"
              ? "Tắt máy"
              : "Khởi động"}
          </p>
        </div>
      </div>
      {status !== "maintenance" && (
        <div ref={dropdownRef} className="relative z-[9999] flex h-full">
          <div
            className={clsx(
              "flex h-full min-h-9 w-9 items-center justify-between gap-2 rounded-sm border-[1px] bg-up-cloud-primary px-2.5 py-1",
              isShuttingDown || isRestarting || isStart
                ? "!cursor-not-allowed"
                : "cursor-pointer"
            )}
            onClick={() => {
              if (!isShuttingDown && !isRestarting && !isStart) {
                toggleDropdown();
              }
            }}
          >
            <span className="text-sm text-white">
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>

          {!isShuttingDown && !isRestarting && !isStart && isOpen && (
            <div className="absolute right-0 top-full z-[999] mt-1.5 w-full min-w-40 rounded-sm border-[1px] border-gray-200 bg-white shadow-lg">
              {status !== "started" && (
                <div
                  className="flex w-full cursor-pointer items-center gap-3 border-b-[1px] border-b-gray-300 px-2 py-2.5 text-up-cloud-primary hover:bg-up-cloud-primary hover:text-white"
                  onClick={() => {
                    if (!isShuttingDown && !isRestarting && !isStart) {
                      handleAction("start");
                    }
                  }}
                >
                  <IoIosPower size={23} />
                  <p className="text-sm font-medium">Khởi động</p>
                </div>
              )}
              {status === "started" && (
                <>
                  <div
                    className="flex w-full cursor-pointer items-center gap-3 border-b-[1px] border-b-gray-300 px-2 py-2.5 text-up-cloud-primary hover:bg-up-cloud-primary hover:text-white"
                    onClick={() => {
                      if (!isShuttingDown && !isRestarting && !isStart) {
                        handleAction("stop");
                      }
                    }}
                  >
                    <IoIosPower size={23} />
                    <p className="text-sm font-medium">Tắt máy</p>
                  </div>
                  <div
                    className="flex w-full cursor-pointer items-center gap-3 border-b-[1px] border-b-gray-300 px-2 py-2.5 text-up-cloud-primary hover:bg-up-cloud-primary hover:text-white"
                    onClick={() => {
                      if (!isShuttingDown && !isRestarting && !isStart) {
                        handleAction("restart");
                      }
                    }}
                  >
                    <RiRestartLine size={23} />
                    <p className="text-sm font-medium">Khởi động lại</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
