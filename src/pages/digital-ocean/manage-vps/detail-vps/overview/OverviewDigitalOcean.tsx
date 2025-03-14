import digitalOceanApi from "@/apis/digital-ocean.api";
import {
  convertPriceMonthlyWithStr,
  getNameOfImage,
  handleDisplayMemory,
} from "@/utils/digital-ocean";
import showToast from "@/utils/toast";
import { Button, Divider, Tooltip } from "@heroui/react";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import { useParams } from "react-router-dom";

function OverviewDigitalOcean({ info }: any) {
  const { id } = useParams();
  const publicNetworks = info?.networks?.v4?.find((item: any) => {
    return item.type === "public";
  });

  const privateNetworks = info?.networks?.v4?.find((item: any) => {
    return item.type === "private";
  });

  const publicIPV6 = info?.networks?.v6?.find((item: any) => {
    return item.type === "public";
  });

  const handleCopyPassword = async () => {
    const data = await digitalOceanApi.getPasswordVPSDigitalOcean(id);
    setPassword(data?.data);
    setTimeout(() => {
      navigator.clipboard.writeText(data?.data);
    }, 0);
    return showToast("Đã sao chép", "success");
  };
  const [pwAaPanel, setPwAaPanel] = useState("");
  const handleCopyPwAaPanel = async () => {
    if (pwAaPanel) {
      navigator.clipboard.writeText(pwAaPanel);

      return showToast("Đã sao chép mật khẩu", "success");
    }

    try {
      const { data } = await digitalOceanApi.getPwAaPanel(id as string);

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
  const handleCopyIP = (value: any) => {
    navigator.clipboard.writeText(value);
    return showToast("Đã sao chép", "success");
  };

  const [password, setPassword] = useState(null);
  return (
    <div className="p-4">
      {/* <Divider className="mt-4" /> */}
      <div className="col-span-4 grid grid-cols-4 mb-4">
        <h3 className="col-span-1 text-base font-bold my-auto">Địa chỉ IP:</h3>
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
                  onPress={() => handleCopyIP(publicNetworks?.ip_address)}
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
      <Divider />
      <div className="col-span-4 grid grid-cols-4 mb-4">
        <h3 className="col-span-1 text-base font-bold my-auto">
          Thông tin Aapanel:
        </h3>
        <div className=" col-span-3  my-auto ">
          <div className=" flex ">
            <p>
              User aaPanel:
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
                  onPress={() => handleCopyIP(info?.userAaPanel || "")}
                >
                  <p className="font-bold text-[16px]">
                    {info?.userAaPanel || "(Trống)"}
                  </p>
                </Button>
              </Tooltip>
            </p>
          </div>
          <p>
            Mật khẩu aaPanel:
            <Tooltip
              radius="sm"
              content={
                <div className="flex items-center gap-1 text-xs">
                  <FaRegCopy />
                  Sao chép mật khẩu
                </div>
              }
            >
              <Button
                className="h-8 px-1 rounded-md bg-transparent  "
                onPress={handleCopyPwAaPanel}
              >
                <p className="font-bold text-[16px]">
                  {info?.passWordAaPanel || "*********"}
                </p>
              </Button>
            </Tooltip>
          </p>
          <p>
            URL aaPanel:
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
                onPress={() => handleCopyIP(info?.uRLAaPanel || "")}
              >
                <p className="font-bold text-[16px]">
                  {info?.uRLAaPanel || "(Trống)"}
                </p>
              </Button>
            </Tooltip>
          </p>
        </div>
      </div>
      <Divider />

      <div className="col-span-4 grid grid-cols-4 my-4">
        <h3 className="col-span-1 text-base font-bold my-auto">Tài khoản:</h3>
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
                  onPress={() => handleCopyPassword()}
                >
                  {password || "**************"}
                </Button>
              </Tooltip>
            </p>
          </div>
        </div>
      </div>
      <Divider />

      <div className="col-span-4 grid grid-cols-4 my-4">
        <h3 className="col-span-1 text-base font-bold my-auto">Thông tin:</h3>
        <div className=" col-span-3 grid grid-cols-2 my-auto gap-4">
          <p>
            Số vCpu: <strong>{info?.selectedSize?.vcpus}</strong>
          </p>
          <p>
            Bộ nhớ:{" "}
            <strong>{handleDisplayMemory(info?.selectedSize?.memory)}</strong>
          </p>
          <p>
            Ổ cứng: <strong>{info?.selectedSize?.disk} GB</strong>
          </p>
          <p>
            Vị trí: <strong>{info?.selectedRegion?.label}</strong>
          </p>

          <p>
            Hệ điều hành:{" "}
            <strong>
              {getNameOfImage(info?.selectedImage, info?.selectedVersionImage)}
            </strong>
          </p>
          <p>
            Giá:{" "}
            <strong>
              {convertPriceMonthlyWithStr(
                info?.selectedSize?.price_monthly || 0
              )}
            </strong>
          </p>
        </div>
      </div>

      <Divider />

      <div className="col-span-4 grid grid-cols-4 my-4">
        <h3 className="col-span-1 text-base font-bold my-auto">Ghi chú:</h3>
        <div className=" col-span-3 my-auto gap-4">
          <p>
            <strong>{info?.note}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OverviewDigitalOcean;
