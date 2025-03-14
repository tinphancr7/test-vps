import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppSelector } from "@/stores";
import { formatPrice } from "@/utils/format-price";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import moment from "moment";

function TableInvoiceBuCloud() {
  const { invoicesList, total, isLoading } = useAppSelector(
    (state) => state.invoiceBuCloud
  );

  const columns = [
    { _id: "invoiceType", name: "Nhà cung cấp" },
    { _id: "team", name: "Team" },
    { _id: "price", name: "Giá" },
    { _id: "date", name: "Ngày tạo" },
  ];

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "team":
        return (
          <div className="flex items-center justify-center">
            {cellValue?.name}
          </div>
        );

      case "price":
        return (
          <p className="font-medium tracking-wider">
            {formatPrice(convertVnToUsd(cellValue, "BuCloud"))}
            <b> $</b>
          </p>
        );

      case "date":
        return (
          <p className="tracking-wide">
            {moment(cellValue).format("HH:mm DD-MM-YYYY")}
          </p>
        );

      default:
        return cellValue;
    }
  };

  return (
    <Container>
      <TableControl
        tableId={"invoices_bu_cloud"}
        columns={columns}
        data={invoicesList}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
      />
    </Container>
  );
}

export default TableInvoiceBuCloud;
