import vpsApis from "@/apis/vps-apis";
import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import moment from "moment";
import { useState } from "react";
import { convertPriceToUSD } from "@/utils/digital-ocean";

const columns = [
  { _id: "name", name: "Nhãn", className: "text-left w-1/5" },
  { _id: "price", name: "Giá" },
  { _id: "os", name: "Hệ điều hành" },
  { _id: "publicIpAddress", name: "Địa chỉ IP", className: "w-[10%]" },
  { _id: "status", name: "Trạng thái" },
  { _id: "team", name: "Team" },
  { _id: "createdAt", name: "Ngày tạo" },
  { _id: "note", name: "Ghi chú" },
];

function ExportVpsAwsLightsailExcel() {
  const tableVpsAwsLightsail = useAppSelector(
    (state) => state.table["vps_aws_lightsail"]
  );
  const { status, teamSelected, searchByIp } = useAppSelector(
    (state) => state.awsLightsail
  );

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const query: any = {
        pageSize: 0,
        pageIndex: 0,
      };

      if (searchByIp !== undefined) {
        query.search = searchByIp;
      }

      if (status) {
        const [statusValue] = [...status];

        query.status = statusValue;
      }

      if (teamSelected) {
        query.team = teamSelected;
      }

      if (
        tableVpsAwsLightsail?.sortDescriptor?.direction &&
        tableVpsAwsLightsail?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsAwsLightsail?.sortDescriptor?.direction &&
        tableVpsAwsLightsail?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsAwsLightsail?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsAwsLightsail?.sortDescriptor?.column}`;
      }

      const { data } = await vpsApis.getPagingAwsLightsailInstances({
        ...query,
      });

      return {
        results: data?.data,
        total: data?.total,
        totalPrice: data?.totalPrice,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        results: [],
        total: 0,
        totalPrice: 0,
      };
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsLoading(true);

      const dataExport = await fetchData();

      if (!dataExport?.results?.length) {
        return showToast("Không có dữ liệu để xuất!", "warn");
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Quản lý VPS - AWS Lightsail");

      worksheet.addRow([]);

      const headerRowTotalVps = worksheet.addRow([
        "Tổng số VPS:",
        dataExport.total,
      ]);
      headerRowTotalVps.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "C5D9F1" },
        };
      });

      const calculatorTotal =
        dataExport?.totalPrice + dataExport?.totalPrice * 0.1;
      const headerRowTotalPrice = worksheet.addRow([
        "Tổng số tiền:",
        convertPriceToUSD(calculatorTotal),
      ]);
      headerRowTotalPrice.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F6A294" },
        };
      });

      worksheet.addRow([]);

      // Set header row
      const headerRow = worksheet.addRow(columns.map((col) => col.name));

      // Apply header styles
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFCC00" },
        };
      });

      // Add data rows
      dataExport?.results?.forEach((item: any) => {
        const rowData = columns.map((col) => {
          switch (col._id) {
            case "name":
              return item["vps_id"]?.["name"] || "";

            case "price":
              // eslint-disable-next-line no-case-declarations
              const calculatorTotal =
                item["vps_id"]?.["price"] + item["vps_id"]?.["price"] * 0.1;

              return convertPriceToUSD(calculatorTotal);

            case "os":
              return item["vps_id"]?.["blueprintName"];

            case "publicIpAddress":
              return item["vps_id"]?.["publicIpAddress"] || "";

            case "status":
              return item["vps_id"]?.["state"]?.["name"] || "";

            case "team":
              return item["team"]?.name;

            case "createdAt":
              return moment(item["createdAt"]).format("DD-MM-YYYY");

            default:
              return item[col?._id] || "";
          }
        });
        worksheet.addRow(rowData);
      });

      // Set column widths
      worksheet.columns = columns.map((_col, index) => {
        return { width: index === 0 ? 20 : 30 }; // First column narrower
      });

      // Set styles for all rows
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();

      if (buffer) {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `quan-ly-vps-aws-lightsail.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      showToast("Xuất file thành công!", "success");
    } catch (error) {
      showToast("Xuất file thất bại!", "success");
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="solid"
      color={"success"}
      className="bg-success-600 rounded-md min-w-32 text-white font-bold text-sm items-center"
      startContent={
        <RiFileExcel2Line className="text-white min-w-max min-h-max text-lg" />
      }
      onPress={handleExportExcel}
      isLoading={isLoading}
    >
      Xuất Excel
    </Button>
  );
}

export default ExportVpsAwsLightsailExcel;
