import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import moment from "moment";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useState } from "react";
import transactionApis from "@/apis/transaction.api";

const columns = [
  { _id: "dateTransaction", name: "Thời gian" },
  { _id: "provider", name: "Nhà cung cấp" },
  { _id: "team", name: "Team" },
  { _id: "amoutTransactionIn", name: "Số tiền vào" },
  { _id: "amoutTransactionOut", name: "Số tiền ra" },
  { _id: "typeTransaction", name: "Loại giao dịch" },
  { _id: "runningBalance", name: "Số dư" },
];

function ExportExcelTransaction() {
  const { query } = useAppSelector((state) => state.transaction);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    try {
      const { data } = await transactionApis.exportExcelTransaction(query);
      return {
        results: data?.data?.listTransaction,
        total: data?.data?.total,
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
      const worksheet = workbook.addWorksheet("Quản lý giao dịch");

      worksheet.addRow([]);

      const headerRowTotalVps = worksheet.addRow([
        "Tổng số giao dịch:",
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

      //   const calculatorTotal = parseFloat(dataExport?.totalMoney);
      //   const headerRowTotalPrice = worksheet.addRow([
      //     "Tổng số tiền:",
      //     calculatorTotal,
      //   ]);
      //   headerRowTotalPrice.eachCell({ includeEmpty: true }, (cell) => {
      //     cell.font = { bold: true };
      //     cell.alignment = { vertical: "middle", horizontal: "center" };
      //     cell.fill = {
      //       type: "pattern",
      //       pattern: "solid",
      //       fgColor: { argb: "F6A294" },
      //     };
      //   });

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
      console.log(dataExport);
      // Add data rows
      dataExport?.results?.forEach((item: any) => {
        const rowData = columns.map((col) => {
          switch (col._id) {
            case "dateTransaction":
              return moment(item.dateTransaction).format("DD-MM-YYYY HH:mm:ss");
            case "provider": {
              return item.providerId.name;
            }
            case "team": {
              return item.teamId.name;
            }

            case "amoutTransactionIn": {
              if (item.typeTransaction === "add_credit") {
                return convertVnToUsd(item.amountTransaction);
              }
              if (item.typeTransaction === "add_credit_USDT") {
                return item.amountTransaction + " USDT";
              }
              break;
            }

            case "amoutTransactionOut": {
              if (
                item.typeTransaction === "renew_vps" ||
                item.typeTransaction === "buy_vps"
              ) {
                return convertVnToUsd(item.amountTransaction);
              }
              break;
            }

            case "runningBalance": {
              return convertVnToUsd(item.runningBalance) + " $";
            }

            case "typeTransaction": {
              if (item.typeTransaction === "renew_vps") {
                return "Gia hạn VPS";
              }
              if (item.typeTransaction === "buy_vps") {
                return "Mua mới VPS";
              }
              return "Nạp tiền";
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
        a.download = `Quản lý giao dịch.xlsx`;
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

export default ExportExcelTransaction;
