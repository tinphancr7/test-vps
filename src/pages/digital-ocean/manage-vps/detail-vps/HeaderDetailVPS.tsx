import digitalOceanApi from "@/apis/digital-ocean.api";
import Container from "@/components/container";
import { Status } from "@/components/digital-ocean/Status";
import IconWrapper from "@/pages/detail-vps-vng-or-vietstack/components/IconWrapper/IconWrapper";
import showToast from "@/utils/toast";
import {
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import moment from "moment";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { IoMdPower } from "react-icons/io";
import { IoRefresh, IoTerminal } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { LuPowerOff } from "react-icons/lu";
import { MdRestartAlt } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { TbTerminal2 } from "react-icons/tb";
import { Key, useState } from "react";
import ModalAapanel from "./ModalAapanel";

function HeaderDetailVPS({ info, setRender }: any) {
  const handleRefresh = () => {
    showToast("Lấy thông tin VPS thành công", "success");
    setRender((prev: any) => !prev);
  };
  const { isOpen: isOpenAapanel, onOpenChange: onOpenChangeAapanel } =
    useDisclosure();
  const handleClickActionAaPanel = (actionKey: Key): void => {
    switch (actionKey) {
      case "update-aaPanel":
        onOpenChangeAapanel();
        break;

      default:
        console.log("Invalid Action");
    }
  };
  const [pwAaPanel, setPwAaPanel] = useState("");
  const handleCopyPwAaPanel = async () => {
    if (pwAaPanel) {
      navigator.clipboard.writeText(pwAaPanel);

      return showToast("Đã sao chép mật khẩu", "success");
    }

    try {
      const { data } = await digitalOceanApi.getPwAaPanel(info?._id as string);

      if (data?.status === 1) {
        if (!data?.data) {
          showToast("Chưa đặt mật khẩu aaPanel", "info");
        } else {
          showToast("Đã sao chép mật khẩu", "success");
          setPwAaPanel(data?.data);

          navigator.clipboard.writeText(data?.data);
        }
      }
    } catch (error: any) {
      console.log("error: ", error);
      if (error?.response?.data?.status === 37) {
        showToast("Bạn chỉ có thể lấy mật khẩu một lần!", "error");
        return;
      }
      showToast("Sao chép mật khẩu thất bại", "error");
    }
  };
  const iconClasses = "text-xl pointer-events-none flex-shrink-0";
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

  const handlePowerVPSDigitalOcean = async () => {
    if (info?.status === "in-progress" || info?.status === "terminated") {
      return;
    }

    // nếu nó đang off
    if (info?.status === "off") {
      const resultZ = await digitalOceanApi.createActionDigitalOcean({
        key: "power_on",
        item: info,
      });
      if (!resultZ?.status) {
        showToast("Lỗi khi bật VPS", "error");
        return;
      }
      showToast("Đang bật  VPS", "info");
    }

    if (info?.status === "active") {
      const resultZ = await digitalOceanApi.createActionDigitalOcean({
        key: "shutdown",
        item: info,
      });
      if (!resultZ?.status) {
        showToast("Lỗi khi tắt VPS", "error");
        return;
      }
      showToast("Đang tắt  VPS", "info");
    }

    setRender((prev: any) => !prev);
  };

  const handleRebootVPS = async () => {
    if (info?.status === "in-progress") {
      return;
    }
    const resultZ = await digitalOceanApi.createActionDigitalOcean({
      key: "restart",
      item: info,
    });
    if (!resultZ?.status) {
      showToast("Lỗi khi khởi động lại VPS", "error");
      return;
    }
    showToast("Đang khởi động lại VPS", "info");
    setRender((prev: any) => !prev);
  };
  const navigate = useNavigate();
  return (
    <div>
      <Container className="sticky top-0 bg-white z-10 h-max flex flex-col gap-5">
        <div className="flex justify-between">
          <div className=" flex gap-2">
            {/* Back to VPS VNG Page */}
            <Button
              color="primary"
              className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg mt-1"
              onPress={() => navigate("/vps/digital-ocean")}
            >
              <HiOutlineArrowLeft />
            </Button>

            <div className="flex flex-col">
              <div className="flex gap-4">
                {" "}
                <Chip
                  radius="sm"
                  color="warning"
                  variant="flat"
                  classNames={{
                    base: "h-auto",
                    content: "pl-4 font-semibold tracking-wider text-xl py-1",
                  }}
                >
                  {info?.nameVPS}
                </Chip>
                {Status(info?.status)}
              </div>

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
                  {moment(info?.created_at).format("DD-MM-YYYY")}
                </b>
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
                <span>Team:</span>
                <b className="ml-2 text-primary">{info?.teamOwner}</b>
              </Chip>
              {/* <h1>{stringInfoVps(info)}</h1> */}
            </div>
          </div>
          <div className="flex gap-4">
            <Tooltip content={"Khởi động lại"}>
              <div onClick={() => handleRebootVPS()}>
                <IconWrapper
                  bgColor="bg-yellow-100"
                  textColor="text-yellow-600"
                  className={`${
                    info?.status === "in-progress" ||
                    info?.status === "terminated"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <MdRestartAlt size={20} />
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
            <Tooltip
              content={info?.status === "active" ? "Tắt nguồn" : "Bật nguồn"}
            >
              <div onClick={() => handlePowerVPSDigitalOcean()}>
                <IconWrapper
                  bgColor={
                    info?.status === "active" ? "bg-red-500" : "bg-green-500"
                  }
                  textColor="black"
                  className={`${
                    info?.status === "in-progress" ||
                    info?.status === "terminated"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {info?.status === "active" ? <LuPowerOff /> : <IoMdPower />}
                </IconWrapper>
              </div>
            </Tooltip>
            <Tooltip content={"Làm mới"}>
              <div onClick={() => handleRefresh()}>
                <IconWrapper bgColor="bg-blue-100" textColor="text-blue-600">
                  <IoRefresh />
                </IconWrapper>
              </div>
            </Tooltip>
          </div>
        </div>
      </Container>

      {/* <Divider className="mt-4" /> */}
      {/* <Container className="grid grid-cols-12 gap-5 mt-4">
                <div className="col-span-4 grid grid-cols-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        Địa chỉ IP:
                    </h3>
                    <div className=" col-span-3  my-auto ">
                        <div className=" flex ">
                            <p>
                                ipv4:
                                <Tooltip
                                    radius="sm"
                                    content={
                                        <div className="flex items-center gap-1 text-xs">
                                            <FaRegCopy />
                                            Sao chép
                                        </div>
                                    }
                                >
                                    <Button
                                        className="h-8 px-1 rounded-md bg-transparent  "
                                        onPress={() =>
                                            handleCopyPassword(
                                                publicNetworks?.ip_address
                                            )
                                        }
                                    >
                                        <p className="font-bold text-[16px]">
                                            {publicNetworks?.ip_address}
                                        </p>
                                    </Button>
                                </Tooltip>
                            </p>
                        </div>
                        <p>
                            ipv6: <strong>{publicIPV6?.ip_address}</strong>
                        </p>
                        <p>
                            Private IP:
                            <strong>{privateNetworks?.ip_address}</strong>
                        </p>
                    </div>
                </div>
                <div className="col-span-4 grid grid-cols-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        Tài khoản:
                    </h3>
                    <div className=" col-span-3 flex flex-col gap-4 my-auto">
                        <div className=" flex ">
                            <p>
                                Tài khoản: <strong>root</strong>
                            </p>
                        </div>
                        <div className=" flex ">
                            <p>
                                Mật khẩu:
                                <Tooltip
                                    radius="sm"
                                    content={
                                        <div className="flex items-center gap-1 text-xs">
                                            <FaRegCopy />
                                            Sao chép
                                        </div>
                                    }
                                >
                                    <Button
                                        className="h-4 px-1 rounded-md bg-transparent  "
                                        onPress={() =>
                                            handleCopyPassword(info?.password)
                                        }
                                    >
                                        {hideFromStart(info?.password, 10, 6)}
                                    </Button>
                                </Tooltip>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 grid grid-cols-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        Thông tin:
                    </h3>
                    <div className=" col-span-3 grid grid-cols-2 my-auto gap-4">
                        <p>
                            Số vCpu:{" "}
                            <strong>{info?.selectedSize?.vcpus}</strong>
                        </p>
                        <p>
                            Bộ nhớ:{" "}
                            <strong>
                                {handleDisplayMemory(
                                    info?.selectedSize?.memory
                                )}
                            </strong>
                        </p>
                        <p>
                            Ổ cứng:{" "}
                            <strong>{info?.selectedSize?.disk} GB</strong>
                        </p>
                        <p>
                            Vị trí:{" "}
                            <strong>{info?.selectedRegion?.label}</strong>
                        </p>

                        <p className="col-span-2">
                            Hệ điều hành:{" "}
                            <strong>
                                {getNameOfImage(
                                    info?.selectedImage,
                                    info?.selectedVersionImage
                                )}
                            </strong>
                        </p>
                    </div>
                </div>
            </Container> */}
      <ModalAapanel
        id={info?._id}
        isOpen={isOpenAapanel}
        onOpenChange={onOpenChangeAapanel}
        onCopyPwAaPanel={handleCopyPwAaPanel}
      />
      <Divider />
    </div>
  );
}

export default HeaderDetailVPS;
