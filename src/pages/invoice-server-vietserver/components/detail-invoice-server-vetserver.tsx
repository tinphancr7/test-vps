import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkDetailInvoiceServerVietServer } from "@/stores/async-thunks/invoice-server-vietserver";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { Button, Image, Spinner } from "@heroui/react";
import moment from "moment";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function DetailServerVietServer() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, invoice }: any = useAppSelector(
    (state) => state.invoiceServerVietServer
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  useEffect(() => {
    dispatch(asyncThunkDetailInvoiceServerVietServer(location.state?.id));

    return () => {};
  }, []);

  const serverInfo = useMemo(() => {
    return [
      { label: "Service", value: invoice?.invoice?.config },
      { label: "Main", value: invoice?.invoice?.configure?.main },
      { label: "CPU", value: invoice?.invoice?.configure?.cpu },
      { label: "RAM", value: invoice?.invoice?.configure?.ram },
      { label: "SSD", value: invoice?.invoice?.configure?.ssd },
      { label: "HDD", value: invoice?.invoice?.configure?.HDD },
      { label: "IP", value: invoice?.invoice?.ip },
      {
        label: "Backup",
        value: invoice?.invoice?.backup ? "Có" : "Không",
      },
      {
        label: "Premium - SP",
        value: invoice?.invoice?.premiumSupport ? "YES" : "NO",
      },
    ].filter((item) => item.value !== undefined);
  }, [invoice]);

  return (
    <div className="h-[90vh] overflow-hidden overflow-y-auto">
      <div className="mx-auto flex flex-col items-center justify-center py-2">
        <div className="flex items-center justify-between w-full max-w-[800px] my-4">
          <Button
            className="bg-red-500 text-white  text-sm uppercase"
            onPress={() => navigate(paths.invoices_server_vietserver)}>
            Quay lại
          </Button>
          <Button
            className="bg-primary text-white uppercase  text-sm "
            onClick={handlePrint as any}>
            In hóa đơn
          </Button>
        </div>

        <div
          className="border border-gray-200 w-[800px] min-w-[800px] min-h-[900px] bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url("/imgs/background-login.png")`,
          }}
          ref={contentRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full mt-[400px]">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <div className="px-12 py-16">
              {/* Header Section */}
              <div className="mb-12">
                <Image
                  src="/imgs/vietserver-01.png"
                  alt="VNG Logo"
                  className="w-fit max-w-44 h-fit"
                />
              </div>

              <div className="grid grid-cols-12 gap-10">
                {/* Invoice Details */}
                <div className="col-span-6 text-black uppercase space-y-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span>HÓA ĐƠN</span>
                    <span>{invoice?.invoice_id || ""}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NGÀY LẬP HÓA ĐƠN</span>
                    <span>
                      {moment(invoice?.invoice?.createdAt).format(
                        "YYYY-MM-DD"
                      ) || ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NGÀY CẦN THANH TOÁN</span>
                    <span>
                      {moment(invoice?.invoice?.createdAt).format(
                        "YYYY-MM-DD"
                      ) || ""}
                    </span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="col-span-6 text-black uppercase space-y-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className="whitespace-nowrap">
                      PHƯƠNG THỨC THANH TOÁN
                    </span>
                    <span className="whitespace-nowrap">CHUYỂN KHOẢN</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button color="success" className="text-white text-sm">
                      ĐÃ THANH TOÁN
                    </Button>
                  </div>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="mt-16 text-sm">
                {/* Content Header */}
                <div className="bg-white w-full p-4 font-bold">
                  NỘI DUNG HÓA ĐƠN
                </div>
                <div className="bg-[#87f5db66] w-full p-4 font-bold flex items-center justify-between">
                  <span>CHI TIẾT HÓA ĐƠN</span>
                  <span>{invoice?.invoice_id}</span>
                </div>

                <div className="flex flex-col">
                  {serverInfo.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex gap-3 justify-between p-4 ${
                        index % 2 === 1 ? "bg-[#87f5db66]" : "bg-white"
                      }`}>
                      <b className="text-base">{item.label}:</b>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Totals Section */}
                <div className="bg-white flex flex-col items-end space-y-2 font-bold p-4">
                  <div className="">
                    <span>SỐ LƯỢNG</span>
                    <span className="w-[150px] text-right inline-block">1</span>
                  </div>
                  <div className="">
                    <span>THÀNH TIỀN</span>
                    <span className="w-[150px] text-right inline-block">
                      {convertVnToUsd(
                        invoice?.price ? (invoice?.price * 100) / 110 : 0,
                        "VietServer"
                      ) || 0}{" "}
                      $
                    </span>
                  </div>
                  <div className="">
                    <span>THUẾ</span>
                    <span className="w-[150px] text-right inline-block">
                      {convertVnToUsd(
                        invoice?.price ? (invoice?.price * 10) / 110 : 0,
                        "VietServer"
                      ) || 0}{" "}
                      $
                    </span>
                  </div>
                  <div className="">
                    <span>GIẢM GIÁ</span>
                    <span className="w-[150px] text-right inline-block">0</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div
                  style={{
                    background:
                      "linear-gradient(to right, #0cebeb, #87f5db66, #87f5db66)",
                  }}
                  className="p-4">
                  <div className="flex items-center justify-end font-bold">
                    <span className="text-lg">TỔNG</span>
                    <span className="w-[150px] text-right text-lg">
                      {convertVnToUsd(
                        Math.round(invoice?.price),
                        "VietServer"
                      ) || 0}{" "}
                      $
                    </span>
                  </div>
                </div>

                {/* Footer */}
                {/* <div className="flex flex-col items-end p-4 space-y-1 bg-white">
                                    <p className="font-bold">
                                        VNG CLOUD TECHNOLOGY COMPANY LIMITED
                                    </p>
                                    <p className="font-normal">
                                        698/1/12 Truong Chinh Street, Ward 15,
                                        Tan Binh District, Ho Chi Minh City,
                                        Vietnam.
                                    </p>
                                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailServerVietServer;
