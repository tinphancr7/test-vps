import RenderIconOs from "@/components/render-icon-os";
import { useAppSelector } from "@/stores";

import showToast from "@/utils/toast";

import { Button, Tooltip } from "@heroui/react";
import { useMemo, useState } from "react";

import { useParams } from "react-router-dom";
import ModalAapanel from "../modal/ModalAapanel";
import vpsOrtherApis from "@/apis/vps-orther.api";

function Overview({ isOpen, onOpenChange }: any) {
  const { id } = useParams();

  const { data } = useAppSelector((state) => state.detailVpsOrther);
  console.log("data: ", data);
  const [pwVps, setPwVps] = useState("");
  const [pwAaPanel, setPwAaPanel] = useState("");

  const renderAccountName = useMemo(() => {
    return data?.username || "(Trống)";
  }, [data]);

  const handleCopyPwVps = async () => {
    if (pwVps) {
      navigator.clipboard.writeText(pwVps);

      return showToast("Đã sao chép mật khẩu", "success");
    }

    try {
      const { data } = await vpsOrtherApis.getPwVps(id as string);

      if (data?.status === 1) {
        if (!data?.data) {
          showToast("Chưa đặt mật khẩu VPS", "info");
        } else {
          showToast("Đã sao chép mật khẩu", "success");
          setPwVps(data?.data);

          navigator.clipboard.writeText(data?.data);
        }
      }
    } catch (error: any) {
      console.log("error: ", error);
      if (error?.response?.data?.status === 37) {
        showToast("Bạn chỉ có thể lấy mật khẩu một lần!", "error");
        return;
      } else if (error?.response?.data?.status === 47) {
        showToast(
          "VPS này đang có người sử dụng, thử lại sau 1 tiếng!",
          "error"
        );
        return;
      }
      showToast("Sao chép mật khẩu thất bại", "error");
    }
  };

  const handleCopyPwAaPanel = async () => {
    if (pwAaPanel) {
      navigator.clipboard.writeText(pwAaPanel);

      return showToast("Đã sao chép mật khẩu", "success");
    }

    try {
      const { data } = await vpsOrtherApis.getPwAaPanel(id as string);

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

  return (
    <>
      {isOpen && (
        <ModalAapanel
          id={id}
          isOpen={isOpen}
          onCopyPwAaPanel={handleCopyPwAaPanel}
          onOpenChange={onOpenChange}
        />
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* IP */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Địa chỉ IP:</h3>
          {data && data?.ip ? (
            <p className="col-span-2">{data?.ip}</p>
          ) : (
            <div className="col-span-1 flex items-center justify-center gap-1">
              <i className="text-base">(Trống)</i>
            </div>
          )}
        </div>

        {/* Số vCpu: */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Số vCpu:</h3>
          <p className="col-span-2">{data?.core} Cores</p>
        </div>

        {/* Server Id: */}
        {/* <div className="col-span-4 grid grid-cols-4">
				<h3 className="col-span-2 font-semibold text-base">Mã Server:</h3>
				<p className="col-span-2">{vm?.id}</p>
			</div> */}

        {/* Account */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Tài khoản:</h3>
          <p className="col-span-2 font-medium">{renderAccountName}</p>
        </div>

        {/* RAM */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Bộ nhớ:</h3>
          <p className="col-span-2">
            {isNaN(data?.guaranteed_ram) ? "" : data?.guaranteed_ram + " GB"}
          </p>
        </div>

        {/* Domain */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Tên nhãn:</h3>
          <p className="col-span-2">{data?.domain}</p>
        </div>

        {/* Password */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Mật khẩu:</h3>

          <Tooltip
            showArrow
            color="primary"
            content="Hiện mật khẩu và sao chép"
          >
            <Button
              className="col-span-2 bg-transparent data-[hover=true]:bg-primary/50 rounded-sm min-h-max py-1 h-max w-max justify-start font-medium tracking-wide"
              onPress={handleCopyPwVps}
            >
              ************
            </Button>
          </Tooltip>
        </div>

        {/* Disk Limit */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Ổ cứng:</h3>
          <p className="col-span-2">{data?.disk_limit} GB</p>
        </div>

        {/* Hệ điều hành */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Hệ điều hành:</h3>
          {data && data?.os ? (
            <div className="col-span-2 flex items-center gap-3">
              <RenderIconOs osName={data?.os || "Windows Server 2019"} />
              <p>{data?.os}</p>
            </div>
          ) : (
            <div className="col-span-1 flex items-center justify-center gap-1">
              <i className="text-base">Trống</i>
            </div>
          )}
        </div>

        {/* URL APannel */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">URL aaPanel:</h3>

          {data?.uRLAaPanel ? (
            <a
              href={data?.uRLAaPanel}
              target="_blank"
              className="col-span-2 truncate text-blue-500"
            >
              {data?.uRLAaPanel}
            </a>
          ) : (
            <div className="col-span-2 truncate">(Trống)</div>
          )}
        </div>

        {/* Username APannel */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">User aaPanel:</h3>
          <p className="col-span-2">{data?.userAaPanel || "(Trống)"}</p>
        </div>

        {/* Password APannel */}
        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">
            Mật khẩu aaPanel:
          </h3>
          <Tooltip
            showArrow
            color="primary"
            content="Hiện mật khẩu và sao chép"
          >
            <Button
              className="col-span-2 bg-transparent data-[hover=true]:bg-primary/50 rounded-sm min-h-max py-1 h-max w-max justify-start font-medium tracking-wide"
              onPress={handleCopyPwAaPanel}
            >
              ************
            </Button>
          </Tooltip>
        </div>

        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Nhà cung cấp:</h3>
          <p className="col-span-2">{data?.provider?.name || "(Trống)"}</p>
        </div>

        <div className="col-span-4 grid grid-cols-4">
          <h3 className="col-span-2 font-semibold text-base">Mail:</h3>
          <p className="col-span-2">{data?.mail || "(Trống)"}</p>
        </div>
      </div>
    </>
  );
}

export default Overview;
