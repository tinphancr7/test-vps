/* eslint-disable no-case-declarations */
import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";

import { formatPrice } from "@/utils/format-price";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useState } from "react";
import cloudApi from "@/apis/upcloud-client.api";

const columns = [
  { _id: "label", name: "Nhãn" },
  { _id: "total", name: "Giá / Tháng" },
  { _id: "ip", name: "Địa chỉ IP" },
  { _id: "status", name: "Trạng thái" },
  { _id: "os", name: "Hệ điều hành" },
  { _id: "size", name: "Cấu hình" },
  { _id: "team", name: "Team" },
  { _id: "note", name: "Ghi chú" },
];

function ExportOrderExcel() {
  const { status, teamSelected, searchByIp, productName } = useAppSelector(
    (state) => state.upcloudVps
  );

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const query: any = {
        pageSize: 100000000000000000,
        pageIndex: 1,
      };

      if (searchByIp !== undefined) {
        query.search = searchByIp;
      }

      if (productName) {
        query.product_name = productName;
      }

      if (status) {
        const [statusValue] = [...status];

        query.status = statusValue;
      }

      if (teamSelected) {
        query.team = teamSelected;
      }

      const { data } = await cloudApi.getPaging(query);

      return {
        results: data?.data,
        total: data?.total,
        totalMoney: data?.totalMoney,
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
      const worksheet = workbook.addWorksheet(
        "Quản lý VPS - BuCloud - UpCloud"
      );

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

      const headerRowTotalPrice = worksheet.addRow([
        "Tổng số tiền:",
        formatPrice(convertVnToUsd(dataExport.totalMoney, "VNG")) + "$",
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
            case "label":
              return item["vps_id"]?.hostname || "Trống";

            case "total":
              return (
                formatPrice(convertVnToUsd(item["vps_id"]?.price ?? 0, "VNG")) +
                "$"
              );

            case "os":
              const os =
                item[
                  "vps_id"
                ]?.storage_devices?.storage_device[0]?.labels?.find(
                  (label: any) => label?.key === "_os_brand_name"
                )?.value +
                " " +
                item[
                  "vps_id"
                ]?.storage_devices?.storage_device[0]?.labels?.find(
                  (label: any) => label?.key === "_os_brand_version"
                )?.value;
              return os;

            case "ip": {
              const publicIPv4 = item["vps_id"]?.ip_addresses?.ip_address?.find(
                (ip: any) => ip.family === "IPv4" && ip.access === "public"
              )?.address;
              return publicIPv4 ?? "Trống";
            }

            case "status":
              return item["vps_id"]?.state || "";

            case "team":
              return item?.team?.name;
            case "size":
              const size = `${
                (item["vps_id"].memory_amount ?? 0) / 1024
              } GB RAM - ${item["vps_id"].core_number ?? 0} vCPUs - ${
                item["vps_id"]?.storage_devices?.storage_device?.[0]
                  ?.storage_size ?? "-"
              } GB DISK`;

              return size;

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
        a.download = `quan-ly-vps-vng.xlsx`;
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

export default ExportOrderExcel;
