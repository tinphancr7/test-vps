import { Button, Spinner } from "@heroui/react";
import ToooltipSSL from "./components/tooltip";
import { useEffect, useState } from "react";
import { IoReloadOutline } from "react-icons/io5";
import { RootState, useAppDispatch, useAppSelector } from "@/stores";
import {
  getSslAutomaticMode,
  getSslInfo,
  getTlsVersions,
} from "@/stores/async-thunks/cloud-flare-ssl.thunk";
import { useParams } from "react-router-dom";

import CloudflareConfigSslPage from "./components/config-ssl";

export default function CloudFlareSslPage() {
  const { id: zoneId = "" } = useParams();
  const [location, setLocation] = useState<"main" | "detail">("main");
  const mapSslValue = (value: string) => {
    switch (value) {
      case "off":
        return "Tắt (Không bảo mật)";
      case "flexible":
        return "Linh hoạt";
      case "full":
        return "Đầy đủ";
      case "strict":
        return "Đầy đủ (nghiêm ngặt)";
      default:
        return "Không xác định";
    }
  };
  const getLast24Hours = () => {
    const now = new Date();
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return {
      datetimeStart: past24Hours.toISOString(), // ISO8601 format
      datetimeEnd: now.toISOString(), // ISO8601 format
    };
  };
  function timeAgo(inputDate: string | Date): string {
    const now = new Date();
    const date = new Date(inputDate);

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `vài giây trước`;
    } else if (minutes < 60) {
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else if (days < 30) {
      return `${days} ngày trước`;
    } else if (months < 12) {
      return `${months} tháng trước`;
    } else {
      return `${years} năm trước`;
    }
  }
  function formatDate(_date: string | Date): string {
    const date = new Date(_date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  const dispatch = useAppDispatch();
  const {
    clientSSLMap,
    ssl,
    ssl_automatic_mode,
    loadingSsl,
    loadingSslMode,
    loadingVersion,
    errorSsl,
    errorSslMode,
  } = useAppSelector((state: RootState) => state.cloudFlareSsl);

  const fetchSslData = async () => {
    const { datetimeStart, datetimeEnd } = getLast24Hours();

    try {
      await Promise.all([
        dispatch(getSslInfo(zoneId)),
        dispatch(getSslAutomaticMode(zoneId)),
        dispatch(
          getTlsVersions({
            zoneTag: zoneId,
            datetimeStart,
            datetimeEnd,
            limit: 7,
          })
        ),
      ]);
    } catch (err) {
      console.error("Error fetching SSL data:", err);
    }
  };

  useEffect(() => {
    fetchSslData();
  }, [zoneId]);
  return location === "main" ? (
    <div className="w-full flex flex-col gap-3 p-6 scroll-main overflow-auto h-full">
      <p className="text-2xl font-semibold">Tổng quan SSL/TLS</p>
      {errorSsl || errorSslMode ? (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3">
          <p className="text-xl font-medium">
            Có lỗi xảy ra trong quá trình xử lý.
          </p>
          <Button
            onPress={() => fetchSslData()}
            startContent={<IoReloadOutline />}
            color="danger"
            className="rounded min-w-48 text-xl"
          >
            Thử lại!
          </Button>
        </div>
      ) : loadingSsl || loadingSslMode || loadingVersion ? (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3">
          <Spinner color="primary" label="Đang tải..." labelColor="primary" />
        </div>
      ) : (
        <>
          <p className="text-xl ">
            Chọn cách Cloudflare mã hóa lưu lượng giữa khách truy cập của bạn và
            Cloudflare, cũng như giữa Cloudflare và máy chủ gốc của bạn, để ngăn
            chặn việc đánh cắp dữ liệu và các hành vi giả mạo khác.
          </p>
          <div className="w-full flex flex-row   border-[1px]  border-gray-200 rounded">
            <div className=" p-4 flex flex-col gap-2 w-full border-r-[1px] border-gray-200">
              <p className="text-[20px] font-bold">Mã hóa SSL/TLS</p>
              <div className="flex gap-4">
                <p className="text-[15px] font-bold">Chế độ mã hóa hiện tại:</p>
                <p className="text-[15px] text-green-500">
                  {mapSslValue(ssl?.value)}
                </p>
              </div>
              <p className="text-[15px]">
                Chế độ mã hóa đã được thay đổi lần cuối cách đây{" "}
                {timeAgo(ssl?.modified_on)}.
              </p>
              <p className="text-[15px]">
                Chế độ tự động{" "}
                {ssl_automatic_mode.value === "auto"
                  ? "được kích hoạt"
                  : "đã bị tắt"}{" "}
                cách đây {timeAgo(ssl_automatic_mode?.modified_on)}.
              </p>
              {ssl_automatic_mode?.next_scheduled_scan && (
                <p className="text-[15px]">
                  Lần quét tự động tiếp theo:{" "}
                  {formatDate(ssl_automatic_mode?.next_scheduled_scan)}.
                </p>
              )}
              <div className="flex justify-start items-center my-3 gap-4">
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
                    ["flexible", "full", "strict"].includes(ssl?.value)
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
                    ["full", "strict"].includes(ssl?.value)
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
                    {ssl?.value === "strict" && (
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
            <div className="flex-shrink-0 w-1/3 flex justify-center items-center bg-gray-100">
              <Button
                onPress={() => {
                  setLocation("detail");
                }}
                color="primary"
                className="rounded min-w-48"
              >
                Cấu hình
              </Button>
            </div>
          </div>
          <div className="w-full flex flex-col  border-[1px]  border-gray-200 rounded gap-10">
            <div className="flex flex-col gap-1 p-8">
              <p className="text-[20px] font-bold">
                Lưu lượng được phục vụ qua TLS
              </p>
              <div className="flex gap-1 justify-start items-center">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <p className="text-[15px]">24 giờ qua</p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-1 px-8 pb-8">
              <div className="w-full gap-1 flex flex-col">
                <ToooltipSSL clientSSLMap={clientSSLMap} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  ) : (
    <CloudflareConfigSslPage
      handleOnSuccess={() => {
        setLocation("main");
        fetchSslData();
      }}
      zoneId={zoneId}
    />
  );
}
