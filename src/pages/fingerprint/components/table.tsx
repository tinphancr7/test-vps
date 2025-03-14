import Container from "@/components/container";
import TableControl from "@/components/table-control";

import { useAppSelector } from "@/stores";
import { Snippet } from "@heroui/react";

import { useCallback } from "react";

function TableFingerPrints() {
  const { fingerprints, total, isLoading } = useAppSelector(
    (state) => state.fingerprint
  );
  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
  const columns = [
    { _id: "user", name: "Người dùng" },
    { _id: "visitorId", name: "Visitor ID" },
    { _id: "requestId", name: "Request ID" },
    { _id: "browser_name", name: "Trình duyệt" },
    { _id: "device", name: "Thiết bị" },
    { _id: "ip", name: "Địa chỉ IP" },
    { _id: "os", name: "Hệ điều hành" },
    { _id: "createdAt", name: "Thời gian" },
  ];

  const renderCell = useCallback((item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "visitorId":
      case "requestId":
        return (
          <div className="flex items-center gap-0">
            <Snippet
              size="sm"
              variant="bordered"
              color="primary"
              hideSymbol={true}
              classNames={{
                base: "bg-transparent !border-[1px]",
                pre: "text-base",
              }}>
              {cellValue}
            </Snippet>
          </div>
        );
      case "createdAt":
        return formatDate(cellValue);
      case "user":
        return cellValue?.name || cellValue?.username || "(Trống)";
      default:
        return cellValue;
    }
  }, []);

  return (
    <Container>
      <TableControl
        tableId={"fingerprints"}
        columns={columns}
        data={fingerprints}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
      />
    </Container>
  );
}

export default TableFingerPrints;
