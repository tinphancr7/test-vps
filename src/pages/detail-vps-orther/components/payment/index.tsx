import { useAppSelector } from "@/stores";
import { Chip, Spinner } from "@heroui/react";
import moment from "moment";

function Payment() {
  const { data } = useAppSelector((state) => state.detailVpsOrther);

  const columns = [
    { _id: "status", name: "Trạng thái" },
    { _id: "expires", name: "Ngày hết hạn" },
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
      case "expires":
        return (
          <p className="ml-2 text-md">
            {moment(cellValue)?.format("DD/MM/YYYY")}
          </p>
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

          {renderCell(data, col?._id)}
        </div>
      ))}
    </div>
  );
}

export default Payment;
