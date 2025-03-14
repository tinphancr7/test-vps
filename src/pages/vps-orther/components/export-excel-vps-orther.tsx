import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import moment from "moment";
import { useState } from "react";
import vpsOrtherApis from "@/apis/vps-orther.api";

function ExportOrderExcel() {
  const tableVpsOrther = useAppSelector((state) => state.table["vps_orther"]);
  const { status, teamSelected, searchByIp, dueDate, provider } =
    useAppSelector((state) => state.vpsOrther);

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
      if (provider) {
        query.provider = provider;
      }
      if (dueDate) {
        const [dueDateValue] = [...dueDate];
        query.dueDate = dueDateValue || "all";
      }
      if (
        tableVpsOrther?.sortDescriptor?.direction &&
        tableVpsOrther?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsOrther?.sortDescriptor?.direction &&
        tableVpsOrther?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsOrther?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsOrther?.sortDescriptor?.column}`;
      }
      const { data } = await vpsOrtherApis.getPaging({
        ...query,
      });

      return {
        results: data?.data,
        total: data?.total,
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
  const { user } = useAppSelector((state) => state.auth);
  const handleExportExcel = async () => {
    try {
      setIsLoading(true);

      const dataExport = await fetchData();

      if (!dataExport?.results?.length) {
        return showToast("Không có dữ liệu để xuất!", "warn");
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Quản lý VPS Khác");

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

      worksheet.addRow([]);
      const columns = [
        { _id: "label", name: "Nhãn" },
        { _id: "ip", name: "Địa chỉ IP" },
        { _id: "cost", name: "Giá tiền" },
        { _id: "status", name: "Trạng thái" },
        { _id: "os", name: "Hệ điều hành" },
        { _id: "team", name: "Team" },
        { _id: "provider", name: " Nhà cung cấp" },
        { _id: "expires", name: "Ngày hết hạn" },
        { _id: "uRLAaPanel", name: "URL Aapanel" },
        ...(user?.username === "yonna"
          ? [
              { _id: "userAaPanel", name: "Username Aapanel" },
              { _id: "passWorkAaPanel", name: "Password Aapanel" },
            ]
          : []),
        { _id: "note", name: "Ghi chú" },
        { _id: "mail", name: "Địa chỉ email" },
      ];
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
          console.log(item);
          switch (col._id) {
            case "label":
              return item["domain"] || "";

            case "os":
              return item["os"];

            case "ip":
              return item["ip"] || "(Trống)";

            case "status":
              return item["status"] || "(Trống)";

            case "team":
              return item["team"]?.name;
            case "provider":
              return item["provider"]?.name;
            case "passWorkAaPanel":
              return item["passWorkAaPanel"] || "(Trống)";
            case "userAaPanel":
              return item["userAaPanel"] || "(Trống)";
            case "expires":
              return moment(item["expires"]).format("DD-MM-YYYY");
            case "cost":
              return item["cost"];
            case "uRLAaPanel":
              return item["uRLAaPanel"] || "(Trống)";
            case "mail":
              return item["mail"] || "(Trống)";
            default:
              return item[col?._id] || "(Trống)";
          }
        });
        worksheet.addRow(rowData);
      });

      // Set column widths
      worksheet.columns = columns.map((_, index) => {
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
        a.download = `quan-ly-vps-khac.xlsx`;
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
