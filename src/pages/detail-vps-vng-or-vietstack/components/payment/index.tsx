import { useAppSelector } from "@/stores";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { Chip, Spinner } from "@heroui/react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

function Payment() {
  const { service } = useAppSelector((state) => state.detailVps);
  const { pathname } = useLocation();

  const vpsType = useMemo(() => {
    const toArrayPath = pathname.split("/");

    if (toArrayPath.includes("vng") || toArrayPath.includes("vietserver")) {
      return "VNG";
    }

    return "";
  }, [pathname]);

  const columns = [
    { _id: "date_created", name: "Ngày đăng ký" },
    { _id: "firstpayment", name: "Số tiền thanh toán định kỳ" },
    { _id: "status", name: "Trạng thái" },
    { _id: "next_due", name: "Ngày hết hạn" },
    { _id: "next_invoice", name: "Hóa đơn tiếp theo" },
  ];

  const colorStatus = (type: string) => {
    switch (type) {
      case "Pending":
        return "warning";

      case "Active":
        return "success";

      default:
        return "danger";
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "firstpayment":
        return (
          <div className="flex items-center gap-1">
            <Chip
              variant="flat"
              radius="sm"
              color="warning"
              classNames={{
                content: "text-lg font-semibold",
              }}
            >
              {convertVnToUsd(Number(service?.total * 1.1) / 1, vpsType)} $
            </Chip>

            <span className="text-sm">/ {service?.billingcycle}</span>
          </div>
        );

      case "status":
        return (
          <Chip
            color={cellValue ? colorStatus(cellValue) : "default"}
            variant="flat"
            radius="sm"
            classNames={{
              content: "font-semibold tracking-wider flex items-center gap-2",
            }}
          >
            {cellValue === "Pending" && (
              <Spinner size="sm" aria-label="Loading..." />
            )}

            {cellValue || "Trống"}
          </Chip>
        );

      case "next_due":
        return (
          <div className="flex items-center gap-1">
            <Chip
              variant="flat"
              radius="sm"
              color="danger"
              classNames={{
                content: "text-lg font-semibold",
              }}
            >
              {cellValue}
            </Chip>
          </div>
        );

      default:
        return <span>{cellValue}</span>;
    }
  };

  return (
    <div className="grid grid-cols-12">
      {columns?.map((col) => (
        <div
          key={col?._id}
          className={`col-span-4 text-center tracking-wide flex justify-start items-center gap-4 p-4`}
        >
          <b>{col?.name}:</b>

          {renderCell(service, col?._id)}
        </div>
      ))}
    </div>
  );
}

export default Payment;
