import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import moment from "moment";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useState } from "react";
import invoiceApi from "@/apis/invoice.api";
import { exchangeRateVNG } from "@/constants";

const columns = [
  { _id: "date", name: "Thời gian" },
  { _id: "invoice_id", name: "Mã hóa đơn" },
  { _id: "team", name: "Team" },
  { _id: "price", name: "Giá" },
  { _id: "provider", name: "Nhà cung cấp" },
];

function ExportExcelInvoiceVNG({ dataInvoice }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    try {
      const dataFetch = dataInvoice;
      if (dataInvoice.from) {
        dataFetch.from = Number(dataInvoice.from) * exchangeRateVNG;
      }
      if (dataInvoice.to) {
        dataFetch.to = Number(dataInvoice.to) * exchangeRateVNG;
      }
      if (dataInvoice.time) {
        dataFetch.startDate = moment(dataInvoice?.time?.start?.toDate())
          .startOf("day")
          .toISOString();
        dataFetch.endDate = moment(dataInvoice?.time?.end?.toDate())
          .endOf("day")
          .toISOString();
      }
      const { data } = await invoiceApi.callFetchInvoiceExcel(dataFetch);
      return {
        results: data?.data?.result,
        total: data?.data?.totalItems,
        totalMoney: data?.data?.totalMoney,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        results: [],
        total: 0,
        totalMoney: 0,
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
      const worksheet = workbook.addWorksheet("Danh sách hóa đơn CLOUD 2");

      worksheet.addRow([]);

      const headerRowTotalVps = worksheet.addRow([
        "Tổng số lượng hóa đơn:",
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

      const calculatorTotal = dataExport?.results.reduce(
        (acc: any, item: any) => {
          return acc + convertVnToUsd(item.price, "VST");
        },
        0
      );
      const headerRowTotalPrice = worksheet.addRow([
        "Tổng số tiền:",
        calculatorTotal,
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
            case "date":
              return moment(item.date).format("DD-MM-YYYY HH:mm:ss");
            case "provider": {
              return item.provider.name;
            }
            case "team": {
              return item.team.name;
            }

            case "price": {
              return convertVnToUsd(item.price, "VST");
            }
            case "invoice_id": {
              return item.invoice_id;
            }
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
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
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
        a.download = `Hóa đơn Cloud 02.xlsx`;
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
      className="bg-success-600 rounded-md min-w-32 w-32 text-white font-bold text-sm items-center"
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

export default ExportExcelInvoiceVNG;
