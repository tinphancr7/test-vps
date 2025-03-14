/* eslint-disable @typescript-eslint/no-unused-expressions */
import whoIsDomainApi from "@/apis/who-is-domain.api";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { Chip } from "@heroui/react";
import { Chart } from "react-google-charts";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { toast } from "react-toastify";

const WhoIsDomainPage = () => {
  const [domainName, setDomainName] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoDomain, setInfoDomain] = useState<any>();
  const [DNSDomain, setDNSDomain] = useState<any[]>([]);
  const [notFoundDomain, setNotFoundDomain] = useState(false);
  const handleSearch = async () => {
    if (!domainName.trim()) {
      toast.error("Vui lòng nhập tên miền!");
      return;
    }

    setLoading(true);

    try {
      const [dnsDomain, whoIsDomain] = await Promise.all([
        whoIsDomainApi.callFetchDNSDomain(domainName),
        whoIsDomainApi.callFetchWhoIsDomain(domainName),
      ]);
      if (whoIsDomain?.data?.code === "1") {
        setNotFoundDomain(true);
        setInfoDomain({ domainName });
      } else {
        setNotFoundDomain(false);
        setInfoDomain(whoIsDomain.data);
        setDNSDomain(dnsDomain.data);
      }
    } catch (err: any) {
      console.log("err: ", err);
      toast.error("Lỗi kết nối máy chủ vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Access subject={SubjectEnum.TEAM} action={ActionEnum.READ}>
      <div
        className="flex flex-col gap-5 w-full"
        style={{ padding: "40px 120px" }}
      >
        <div className="flex w-full">
          <div className="border-1 !border-r-0  border-gray-200 w-full rounded-l-md">
            <input
              type="text"
              value={domainName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  !loading && handleSearch();
                }
              }}
              onChange={(e) => setDomainName(e.target.value)}
              className="w-full h-full py-2.5 rounded-l-md px-2.5 outline-none font-normal text-[14px]"
              placeholder="Nhập tên miền cần tra cứu ở đây...!"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="group text-[13px] flex-shrink-0 px-5 font-medium text-white text-center bg-primary  rounded-r-md flex justify-center items-center gap-1 overflow-hidden"
          >
            <span className="group-active:scale-90 transition-transform duration-150 ease-out flex items-center gap-1">
              {loading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <IoIosSearch size={16} /> Tìm kiếm
                </>
              )}
            </span>
          </button>
        </div>
        <>
          {notFoundDomain ? (
            <>
              <div className="h-full flex flex-col gap-2 justify-center items-center">
                <img
                  src="/imgs/not_found_dns_data.svg"
                  alt="Không tìm thấy thông tin DNS...!"
                  className="w-[300px]"
                />
                <p className="text-gray-600 mt-2 px-36 text-center">
                  Không tìm thấy thông tin cho tên miền{" "}
                  <span className="font-bold text-primary">
                    {infoDomain?.domainName}
                  </span>
                  . Kiểm tra lại tên miền hoặc thử với một tên miền khác. Tra
                  cứu{" "}
                  <span className="font-bold text-primary">nhanh chóng</span> và{" "}
                  <span className="font-bold text-primary">chính xác</span>{" "}
                  thông tin <span className="font-semibold">chủ sở hữu</span>,{" "}
                  <span className="font-semibold">thời gian đăng ký</span>,{" "}
                  <span className="font-semibold">nhà cung cấp</span> và{" "}
                  <span className="font-semibold">tình trạng hoạt động</span>{" "}
                  của tên miền.
                </p>
              </div>
            </>
          ) : infoDomain && Object.keys(infoDomain).length > 0 ? (
            <>
              <div className="flex gap-4 w-full">
                <div className="flex flex-col gap-8 w-1/2">
                  <h3 className="text-[20px] font-bold">
                    Thông tin chi tiết tên miền
                  </h3>
                  <div className=" flex flex-col gap-3 ">
                    <div className="flex gap-2 items-center py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200  ">
                      <p className="text-base w-full max-w-56">Tên miền</p>
                      <p className="text-base font-bold text-primary">
                        {infoDomain?.domainName}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200 ">
                      <p className="text-base w-full max-w-56">Ngày đăng ký</p>
                      <p className="text-base font-normal ">
                        {infoDomain?.creationDate || "(Không có dữ liệu)"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200 ">
                      <p className="text-base w-full max-w-56">Ngày hết hạn</p>
                      <p className="text-base font-bold ">
                        {infoDomain?.expirationDate || "(Không có dữ liệu)"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200 ">
                      <p className="text-base w-full max-w-56">Chủ sở hữu</p>
                      <p className="text-base font-normal ">
                        {infoDomain?.registrantName || "(Không có dữ liệu)"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200 ">
                      <p className="text-base w-full max-w-56">Trạng thái</p>

                      <div className="text-base font-normal flex flex-col gap-1.5">
                        {infoDomain?.status?.map((ns: any, index: number) => (
                          <Chip
                            key={index}
                            className="mr-1 text-primary rounded-md border-1 border-primary bg-white"
                            color="primary"
                            variant="dot"
                          >
                            {ns}
                          </Chip>
                        )) || "(Không có dữ liệu)"}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200 ">
                      <p className="text-base w-full max-w-56">
                        Nhà cung cấp tên miền
                      </p>
                      <p className="text-base font-normal">
                        {infoDomain?.registrar || "(Không có dữ liệu)"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200 ">
                      <p className="text-base w-full max-w-56">Nameservers</p>
                      <p className="text-base font-normal ">
                        <div className="text-base font-normal flex flex-col gap-1.5">
                          {infoDomain?.nameServer?.map(
                            (ns: any, index: number) => (
                              <Chip
                                key={index}
                                className="mr-1 text-primary rounded-md border-1 border-primary bg-white"
                                color="primary"
                                variant="dot"
                              >
                                {ns}
                              </Chip>
                            )
                          ) || "(Không có dữ liệu)"}
                        </div>
                      </p>
                    </div>
                    <div className="flex gap-2 items-center py-1.5 even:bg-gray-50 even:border-t-1 even:border-b-1 even:border-t-gray-200 even:border-b-gray-200 ">
                      <p className="text-base w-full max-w-56">DNSSEC</p>
                      <p className="text-base font-normal ">
                        {infoDomain?.DNSSEC || "(Không có dữ liệu)"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-8 w-1/2 flex-grow ">
                  <h3 className="text-[20px] font-bold">
                    Thông tin bản đồ DNS
                  </h3>
                  {DNSDomain?.length === 0 ? (
                    <div className="h-full flex flex-col gap-2 justify-center items-center">
                      <img
                        src="/imgs/not_found_dns_data.svg"
                        alt="Không tìm thấy thông tin DNS...!"
                        className="w-[300px]"
                      />
                      <p className="text-gray-600 mt-2 px-10 text-center">
                        Không tìm thấy thông tin DNS. Kiểm tra lại tên miền hoặc
                        thử với một tên miền khác. Tra cứu{" "}
                        <span className="font-bold text-primary">
                          nhanh chóng
                        </span>{" "}
                        và{" "}
                        <span className="font-bold text-primary">
                          chính xác
                        </span>{" "}
                        thông tin{" "}
                        <span className="font-semibold">chủ sở hữu</span>,{" "}
                        <span className="font-semibold">thời gian đăng ký</span>
                        , <span className="font-semibold">nhà cung cấp</span> và{" "}
                        <span className="font-semibold">
                          tình trạng hoạt động
                        </span>{" "}
                        của tên miền.
                      </p>
                    </div>
                  ) : (
                    <div className="">
                      <Chart
                        chartEvents={[
                          {
                            eventName: "select",
                            callback: ({ chartWrapper }) => {
                              const chart = chartWrapper?.getChart();
                              const selection = chart?.getSelection();
                              if (selection && selection.length === 0) return;
                            },
                          },
                        ]}
                        chartType="GeoChart"
                        width="100%"
                        height="100%"
                        data={DNSDomain}
                        options={{
                          tooltip: { isHtml: true },
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-10 pt-16 justify-center items-start w-full">
              <img
                src="/imgs/who_is_domain.svg"
                alt="Nhập tên miền cần tra cứu ở đây...!"
                className="w-[300px]"
              />
              <div className="max-w-[400px] flex-shrink-0 pt-5">
                <h1 className="text-2xl font-bold text-gray-800">
                  Tra Cứu Thông Tin Tên Miền
                </h1>
                <p className="text-gray-600 mt-2">
                  Kiểm tra thông tin đăng ký tên miền một cách{" "}
                  <span className="font-bold text-primary">nhanh chóng</span> và{" "}
                  <span className="font-bold text-primary">chính xác</span>. Xem
                  chi tiết về <span className="font-semibold">chủ sở hữu</span>,{" "}
                  <span className="font-semibold">thời gian đăng ký</span>,{" "}
                  <span className="font-semibold">nhà cung cấp</span> và{" "}
                  <span className="font-semibold">tình trạng hoạt động</span>{" "}
                  của tên miền.
                </p>
              </div>
            </div>
          )}
        </>
      </div>
    </Access>
  );
};

export default WhoIsDomainPage;
