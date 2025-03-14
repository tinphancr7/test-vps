import cloudflareSslApi from "@/apis/cloudflare-ssl.api";

import { RootState, useAppSelector } from "@/stores";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDone } from "react-icons/md";

import { toast } from "react-toastify";

export default function CloudflareConfigSslPage({
  handleOnSuccess,
  zoneId,
}: {
  zoneId: string;
  handleOnSuccess: () => void;
}) {
  const { ssl, ssl_automatic_mode } = useAppSelector(
    (state: RootState) => state.cloudFlareSsl
  );

  const [selectMode, setSelectMode] = useState<"auto" | "custom">("auto");
  const [selectedCustomMode, setSelectedCustomMode] = useState<
    "strict" | "full" | "flexible" | "off"
  >("full");
  const [initialSelectMode, setInitialSelectMode] = useState<"auto" | "custom">(
    "auto"
  );
  const [initialCustomMode, setInitialCustomMode] = useState<
    "strict" | "full" | "flexible" | "off"
  >("full");
  const isDisabled =
    selectMode === initialSelectMode &&
    (selectMode === "auto" || selectedCustomMode === initialCustomMode);
  useEffect(() => {
    setSelectMode(ssl_automatic_mode?.value as any);
    setSelectedCustomMode(ssl?.value as any);

    setInitialSelectMode(ssl_automatic_mode.value as any);
    setInitialCustomMode(ssl.value as any);
  }, [ssl_automatic_mode, ssl]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (selectMode === "auto") {
        await cloudflareSslApi.updateSslAutomaticMode(zoneId, "auto");
        toast.success("Cài đặt tự động được lưu thành công!");
      } else {
        await cloudflareSslApi.updateSslAutomaticMode(zoneId, "custom");
        await cloudflareSslApi.updateInforSsl(zoneId, selectedCustomMode);
        toast.success(
          `Chế độ tùy chỉnh (${selectedCustomMode}) được lưu thành công!`
        );
      }
      handleOnSuccess();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại.");
      console.error("Error saving SSL settings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" flex-col gap-2 flex p-5 h-full overflow-y-auto overflow-x-hidden w-full">
      <div className="flex">
        <div
          onClick={() => {
            handleOnSuccess();
          }}
          className="group flex select-none items-center gap-2  cursor-pointer flex-shrink-0 "
        >
          <FaArrowLeft className="text-primary" size={15} />
          <p className="text-[15px] text-primary group-hover:underline">
            Quay về tổng quan SSL/TLS
          </p>
        </div>
      </div>
      <p className="text-3xl font-bold mt-5">Thiết lập chế độ mã hóa</p>
      <p className="text-xl text-gray-500">
        Chọn chế độ mã hóa SSL/TLS phù hợp nhất với nhu cầu của bạn.
      </p>
      <div className="flex gap-5 items-center mt-3 w-full ">
        <div className="flex-shrink-0 flex flex-col gap-4  w-2/4">
          <p className="text-xl font-bold flex-shrink-0">Chọn chế độ mã hóa</p>
          <div
            className={`${
              selectMode === "auto" && "bg-primary bg-opacity-5 !border-primary"
            } py-5 border-gray-400 rounded w-[90%] border-[1px] flex flex-col gap-3 `}
          >
            <p className=" px-5 font-bold text-[20px]">
              SSL/TLS tự động (mặc định)
            </p>
            <p className="px-5 text-xl">
              Cloudflare kiểm tra xem lưu lượng của bạn có cần chế độ mã hóa bảo
              mật hơn không và tự động cập nhật cài đặt của bạn.
            </p>
            <div
              onClick={() => {
                setSelectMode("auto");
                setSelectedCustomMode(ssl.value as any);
              }}
              className="mx-5 hover:bg-primary hover:bg-opacity-10 bg-transparent transition-background duration-300 w-fit select-none border-[1px] border-primary text-primary px-4 py-1 justify-center items-center rounded flex gap-2 flex-shrink-0 cursor-pointer"
            >
              {selectMode === "auto" && <MdDone />}

              <p className="text-[15px] font-medium">
                {selectMode === "auto" ? "Đã chọn" : "Chọn"}
              </p>
            </div>
          </div>
          <div
            className={`${
              selectMode === "custom" &&
              "bg-primary bg-opacity-5 border-primary"
            } py-5  border-gray-400 rounded w-[90%] border-[1px] flex flex-col gap-3 `}
          >
            <p className="px-5 font-bold text-[20px]">SSL/TLS tùy chỉnh</p>
            <p className="px-5 text-xl">
              Chọn chế độ mã hóa mà Cloudflare sử dụng để kết nối với máy chủ
              gốc của bạn.
            </p>
            <div
              onClick={() => {
                setSelectMode("custom");
              }}
              className="mx-5 hover:bg-primary hover:bg-opacity-10 bg-transparent transition-background duration-300 w-fit select-none border-[1px] border-primary text-primary px-4 py-1 justify-center items-center rounded flex gap-2 flex-shrink-0 cursor-pointer"
            >
              {selectMode === "custom" && <MdDone />}

              <p className="text-[15px] font-medium">
                {selectMode === "custom" ? "Đã chọn" : "Chọn"}
              </p>
            </div>
            {selectMode === "custom" && (
              <div className="px-5 w-full flex flex-col gap-3 py-5 border-t-1 border-t-primary">
                <div
                  onClick={() => {
                    setSelectedCustomMode("strict");
                  }}
                  className="flex gap-5 items-center cursor-pointer select-none"
                >
                  <div
                    className={`${
                      selectedCustomMode === "strict"
                        ? "border-primary"
                        : "border-black"
                    } rounded-full flex justify-center items-center border-[1px]  w-4 h-4 flex-shrink-0 p-[2px]`}
                  >
                    {selectedCustomMode === "strict" && (
                      <div className="w-full h-full bg-primary rounded-full"></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[15px] font-semibold">Full (Strict)</p>
                    <p className="text-[15px]">
                      Bật mã hóa từ đầu đến cuối và thực thi xác thực trên các
                      chứng chỉ gốc. Sử dụng Origin CA của Cloudflare để tạo
                      chứng chỉ cho máy chủ gốc của bạn.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedCustomMode("full");
                  }}
                  className="flex gap-5 items-center cursor-pointer select-none"
                >
                  <div
                    className={`${
                      selectedCustomMode === "full"
                        ? "border-primary"
                        : "border-black"
                    } rounded-full flex justify-center items-center border-[1px]  w-4 h-4 flex-shrink-0 p-[2px]`}
                  >
                    {selectedCustomMode === "full" && (
                      <div className="w-full h-full bg-primary rounded-full"></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[15px] font-semibold">Full</p>
                    <p className="text-[15px]">
                      Bật mã hóa từ đầu đến cuối. Sử dụng chế độ này khi máy chủ
                      gốc của bạn hỗ trợ chứng chỉ SSL nhưng không sử dụng chứng
                      chỉ hợp lệ được công nhận công khai.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedCustomMode("flexible");
                  }}
                  className="flex gap-5 items-center cursor-pointer select-none"
                >
                  <div
                    className={`${
                      selectedCustomMode === "flexible"
                        ? "border-primary"
                        : "border-black"
                    } rounded-full flex justify-center items-center border-[1px]  w-4 h-4 flex-shrink-0 p-[2px]`}
                  >
                    {selectedCustomMode === "flexible" && (
                      <div className="w-full h-full bg-primary rounded-full"></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[15px] font-semibold">Flexible</p>
                    <p className="text-[15px]">
                      Chỉ bật mã hóa giữa khách truy cập của bạn và Cloudflare.
                      Điều này sẽ tránh cảnh báo bảo mật trên trình duyệt, nhưng
                      tất cả các kết nối giữa Cloudflare và máy chủ gốc của bạn
                      được thực hiện qua HTTP.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedCustomMode("off");
                  }}
                  className="flex gap-5 items-center cursor-pointer select-none"
                >
                  <div
                    className={`${
                      selectedCustomMode === "off"
                        ? "border-primary"
                        : "border-black"
                    } rounded-full flex justify-center items-center border-[1px]  w-4 h-4 flex-shrink-0 p-[2px]`}
                  >
                    {selectedCustomMode === "off" && (
                      <div className="w-full h-full bg-primary rounded-full"></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[15px] font-semibold">
                      Off (not secure)
                    </p>
                    <p className="text-[15px]">
                      Không áp dụng mã hóa. Tắt SSL sẽ vô hiệu hóa HTTPS và
                      khiến trình duyệt hiển thị cảnh báo rằng trang web của bạn
                      không an toàn.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" flex-shrink-0 flex justify-start w-2/4 items-center my-3 gap-4 self-start mt-32">
          <div className="flex flex-col justify-center items-center self-end">
            <img
              src="/cloudflare-ssl/browser.svg"
              alt="Browser"
              className="min-w-[96px]"
            />
            <span className="font-semibold">Trình Duyệt</span>
          </div>
          <img
            src={
              ["flexible", "full", "strict"].includes(selectedCustomMode) &&
              selectMode === "custom"
                ? "/cloudflare-ssl/arrow-secure.svg"
                : "/cloudflare-ssl/arrow.svg"
            }
            alt="Arrow"
            className="w-[105px] h-[39px]"
          />
          <img
            src="/cloudflare-ssl/cloudflare.svg"
            alt="Cloud Flare"
            className="w-[120px] h-[120px]"
          />
          <img
            src={
              ["full", "strict"].includes(selectedCustomMode) &&
              selectMode === "custom"
                ? "/cloudflare-ssl/arrow-secure.svg"
                : "/cloudflare-ssl/arrow.svg"
            }
            alt="Arrow"
            className="w-[105px] h-[39px]"
          />
          <div className="flex flex-col justify-center items-center self-end">
            <div className="relative">
              <img
                src="/cloudflare-ssl/origin-server.svg"
                alt="Browser"
                className="min-w-[121px] h-[36px] mb-4"
              />
              {selectedCustomMode === "strict" && selectMode === "custom" && (
                <img
                  src="/cloudflare-ssl/medal.svg"
                  alt="Browser"
                  className="h-[50px] w-[50px] absolute bottom-0 right-0"
                />
              )}
            </div>
            <span className="font-semibold">Server Gốc</span>
          </div>
        </div>
      </div>

      <div className="w-full py-2 border-t-1 border-t-gray-300 flex gap-2 mt-3 pt-4">
        <Button
          onPress={() => {
            handleOnSuccess();
          }}
          color="default"
          className="rounded min-w-48"
        >
          Quay về
        </Button>
        <Button
          isLoading={isLoading}
          onClick={handleSave}
          disabled={isDisabled || isLoading}
          color="primary"
          className={`rounded min-w-48 ${
            isDisabled && "cursor-not-allowed bg-opacity-50"
          }`}
        >
          Lưu
        </Button>
      </div>
    </div>
  );
}
