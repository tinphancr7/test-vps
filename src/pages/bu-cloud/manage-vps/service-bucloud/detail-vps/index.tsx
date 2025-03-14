import Access from "@/components/Access/access";
import Container from "@/components/container";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetDetailVmServiceByVpsId } from "@/stores/async-thunks/detail-vps-thunk";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Key, useEffect, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TabsDetail from "./components/tabs-detail";
import { IoIosPause, IoMdPower, IoMdSettings } from "react-icons/io";
import { FaPlay } from "react-icons/fa6";
import { IoRefresh, IoTerminal } from "react-icons/io5";
import { MdRestartAlt } from "react-icons/md";
import IconWrapper from "./components/IconWrapper/IconWrapper";
import vpsApis from "@/apis/vps-apis";
import NotifyMessage from "@/utils/notify";
import ModalRebuildVps from "./components/modal/ModalRebuildVps";
import { LiaEditSolid } from "react-icons/lia";
import { TbTerminal2 } from "react-icons/tb";
import moment from "moment";

function DetailVPSBuCloud() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id, slug } = useParams();
  const { service, isLoading, vm } = useAppSelector((state) => state.detailVps);
  const { isOpen: isOpenAapanel, onOpenChange: onOpenChangeAapanel } =
    useDisclosure();
  const { isOpen, onOpenChange } = useDisclosure();
  const [statusVps, setStatusVps] = useState("pending");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const toArrayPath = pathname.split("/");
    let vpsType = "VietServer";

    if (toArrayPath.includes("vng")) {
      vpsType = "VNG";
    }

    if (toArrayPath.includes("vietstack")) {
      vpsType = "VietStack";
    }

    if (toArrayPath.includes("bu-cloud")) {
      vpsType = "BuCloud";
    }

    (async () => {
      const { service: serviceData }: any = await dispatch(
        asyncThunkGetDetailVmServiceByVpsId(id as string)
      ).unwrap();

      document.title = `${vpsType}: ${serviceData?.domain}`;
    })();

    // dispatch(asyncThunkGetDetailVmServiceByVpsId(id as string));

    return () => {};
  }, [id]);

  useEffect(() => {
    setStatusVps(vm?.status);
  }, [vm]);

  useEffect(() => {
    const toArrayPath = pathname.split("/");
    let vpsType = "VietStack";

    if (toArrayPath.includes("vng")) {
      vpsType = "VNG";
    }

    if (toArrayPath.includes("vietstack")) {
      vpsType = "VietStack";
    }

    if (toArrayPath.includes("bu-cloud")) {
      vpsType = "BuCloud";
    }

    document.title = `${vpsType}: ${service?.domain}`;
    return () => {};
  }, [pathname, service, slug]);
  const handleNavigate = () => {
    const pathnameToArr = pathname?.split("/");

    if (pathnameToArr.includes("vng")) {
      navigate(paths.vps_management_vng);
    } else if (pathnameToArr.includes("vietstack")) {
      navigate(paths.vps_management_vietstack);
    } else if (pathnameToArr.includes("bu-cloud")) {
      navigate(paths.vps_manage_bu_cloud);
    } else {
      navigate(paths.vps_management_vietserver);
    }
  };

  const handleShutdownVps = async (id: string) => {
    try {
      setIsSubmitting(true);
      setStatusVps("pending");
      await vpsApis.shutdownVps(id, service?.id, vm?.id);

      setStatusVps("stopped");
      NotifyMessage("Đã tắt VPS thành công", "success");
      setIsSubmitting(false);
    } catch (error) {
      console.log("error: ", error);

      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
      setIsSubmitting(false);
    }
  };

  const handleRebootVps = async (id: string) => {
    try {
      setIsSubmitting(true);
      setStatusVps(statusVps);
      await vpsApis.rebootVps(id, service?.id, vm?.id);
      setStatusVps("running");
      NotifyMessage("Đã khởi động lại VPS thành công", "success");
      setIsSubmitting(false);
    } catch (error) {
      console.log("error: ", error);
      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
      setIsSubmitting(false);
    }
  };

  const handleRebuildVps = async (template_id: string) => {
    try {
      setStatusVps("pending");
      await vpsApis.rebuildVps(id as string, template_id, service?.id, vm?.id);
      dispatch(asyncThunkGetDetailVmServiceByVpsId(id as string));

      NotifyMessage("Đã cài đặt lại VPS thành công", "success");
      onOpenChange();
    } catch (error: any) {
      console.log("error: ", error);
      NotifyMessage("Có lỗi xảy ra", "error");
      setStatusVps(statusVps);
    }
  };

  const generateStatusVps = (status: string) => {
    switch (status) {
      case "running":
        return "Đang chạy";
      case "stopping":
        return "Đang tắt";
      case "stopped":
        return "Đã tắt";

      default:
        return "Đang chờ";
    }
  };

  const handleStartStopVps = async (id: string) => {
    try {
      if (statusVps === "running") {
        setIsSubmitting(true);
        setStatusVps("stopping");
        await vpsApis.stopVps(id, service?.id, vm?.id);
        setStatusVps("stopped");
        NotifyMessage("Đã tạm dừng VPS thành công", "success");
        setIsSubmitting(false);
      } else {
        setIsSubmitting(true);
        setStatusVps("pending");
        await vpsApis.startVps(id, service?.id, vm?.id);
        setStatusVps("running");
        NotifyMessage("Đã khởi động VPS thành công", "success");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.log("error: ", error);
      NotifyMessage("Có lỗi xảy ra", "error");

      setStatusVps(statusVps);
      setIsSubmitting(false);
    }
  };

  const aaPanelActions = [
    {
      key: "update-aaPanel",
      label: "Cập nhật aaPanel",
      icon: LiaEditSolid,
      color: "text-primary-600",
      isDisabled: false,
    },
    {
      key: "console-aaPanel",
      label: "Truy cập panel",
      icon: TbTerminal2,
      color: "text-warning",
      isDisabled: false,
    },
  ];

  const iconClasses = "text-xl pointer-events-none flex-shrink-0";

  const handleNavigateToAaPanel = async () => {
    try {
      setStatusVps("pending");
      const data = await vpsApis.callAccessPanel(id as string);

      setStatusVps(statusVps);
      if (data?.data?.data) {
        window.open(data?.data?.data, "_blank");
      }
    } catch (error) {
      setStatusVps(statusVps);

      console.log("error: ", error);
      NotifyMessage("Có lỗi xảy ra khi truy cập panel", "error");
    }
  };

  const handleClickActionAaPanel = (actionKey: Key): void => {
    switch (actionKey) {
      case "update-aaPanel":
        onOpenChangeAapanel();
        break;

      case "console-aaPanel":
        handleNavigateToAaPanel();
        break;

      default:
        console.log("Invalid Action");
    }
  };
  console.log(service);
  return (
    <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
      <div className="flex flex-col gap-3">
        <Container className="flex justify-between">
          <div className="flex items-start justify-start gap-6">
            <Button
              color="primary"
              className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg mt-1"
              onPress={handleNavigate}
            >
              <HiOutlineArrowLeft />
            </Button>

            <div className="flex flex-col">
              <Chip
                radius="sm"
                color="warning"
                variant="flat"
                classNames={{
                  base: "h-auto",
                  content: "pl-4 font-semibold tracking-wider text-xl py-1",
                }}
              >
                {isLoading ? (
                  <Spinner color="primary" size="sm" />
                ) : (
                  service?.domain
                )}
              </Chip>

              <Chip
                radius="sm"
                color="primary"
                variant="dot"
                classNames={{
                  base: "border-0",
                  content: "font-semibold tracking-wide text-xs",
                }}
              >
                <span>Ngày tạo:</span>
                <b className="ml-2 text-primary">
                  {service?.date_created &&
                    moment(service?.date_created).format("DD-MM-YYYY")}
                </b>
              </Chip>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                {new Array(5).fill(0).map(() => (
                  <Skeleton className="rounded-lg">
                    <div className="h-10 w-10 rounded-lg bg-default-300"></div>
                  </Skeleton>
                ))}
              </>
            ) : (
              <>
                <div className="text-red-600 flex items-center gap-1">
                  <span>{generateStatusVps(statusVps)}</span>
                </div>
                <Tooltip
                  content={statusVps === "running" ? "Tạm dừng" : "Chạy"}
                >
                  <div
                    onClick={() =>
                      !isSubmitting && handleStartStopVps(id as string)
                    }
                  >
                    <IconWrapper
                      bgColor="bg-cyan-100"
                      textColor="text-cyan-600"
                    >
                      {statusVps === "running" ? (
                        <IoIosPause />
                      ) : statusVps === "stopped" ? (
                        <FaPlay />
                      ) : (
                        <Spinner color="primary" size="sm" />
                      )}
                    </IconWrapper>
                  </div>
                </Tooltip>

                <Tooltip content={"Khởi động lại"}>
                  <div
                    onClick={() =>
                      !isSubmitting && handleRebootVps(id as string)
                    }
                  >
                    <IconWrapper
                      bgColor="bg-yellow-100"
                      textColor="text-yellow-600"
                      className={`${
                        statusVps === "stopped"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <MdRestartAlt size={20} />
                    </IconWrapper>
                  </div>
                </Tooltip>
                <Tooltip content={"Cài đặt lại"}>
                  <div onClick={onOpenChange}>
                    <IconWrapper bgColor="bg-red-100" textColor="text-red-600">
                      <IoMdSettings />
                    </IconWrapper>
                  </div>
                </Tooltip>

                <Dropdown radius="sm">
                  <DropdownTrigger>
                    <Button
                      variant="solid"
                      radius="sm"
                      className={`text-blue-600 bg-blue-100 min-w-0 w-10 h-10`}
                    >
                      <Tooltip
                        content={"Điều khiển"}
                        classNames={{
                          base: "",
                          content: "bg-blue-500 text-light",
                        }}
                      >
                        <i>
                          <IoTerminal className="min-w-max text-base w-5 h-5" />
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
                    onAction={handleClickActionAaPanel}
                  >
                    {aaPanelActions?.map((ac: any) => {
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

                <Tooltip content={"Tắt nguồn"}>
                  <div
                    onClick={() =>
                      !isSubmitting && handleShutdownVps(id as string)
                    }
                  >
                    <IconWrapper
                      bgColor="bg-purple-100"
                      textColor="text-purple-600"
                      className={`${
                        statusVps === "stopped"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <IoMdPower />
                    </IconWrapper>
                  </div>
                </Tooltip>
                <Tooltip content={"Làm mới"}>
                  <div
                    onClick={() =>
                      !isSubmitting &&
                      dispatch(
                        asyncThunkGetDetailVmServiceByVpsId(id as string)
                      )
                    }
                  >
                    <IconWrapper
                      bgColor="bg-blue-100"
                      textColor="text-blue-600"
                    >
                      <IoRefresh />
                    </IconWrapper>
                  </div>
                </Tooltip>
              </>
            )}
          </div>
        </Container>

        <TabsDetail isOpen={isOpenAapanel} onOpenChange={onOpenChangeAapanel} />
      </div>
      {isOpen && (
        <ModalRebuildVps
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onRebuildVps={handleRebuildVps}
        />
      )}
    </Access>
  );
}

export default DetailVPSBuCloud;
