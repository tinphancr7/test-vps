import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import digitalOceanApi from "@/apis/digital-ocean.api";

const columns = [
    { _id: "label", name: "Nhãn" },
    { _id: "ip", name: "Địa chỉ IP" },
    { _id: "status", name: "Trạng thái" },
    // { _id: "info", name: "Thông tin Load Balancer" },
    { _id: "team", name: "Team" },
    { _id: "note", name: "Ghi chú" },
];

function ExportLBExcelDigitalOcean({
    teamSelected,
    searchByIp,
    statusVPS,
}: any) {
    // const loadBalancerManagement = useAppSelector(
    //     (state) => state.table["loadbalancer-management"]
    // );

    const [isLoading, setIsLoading] = useState(false);
    const searchMatch = useDebounce(searchByIp, 500);

    const fetchData = async () => {
        try {
            const query: any = {};

            if (searchMatch !== undefined) {
                query.search = searchMatch;
            }

            if (teamSelected) {
                query["team"] = teamSelected;
            }

            if (statusVPS) {
                query["statusVPS"] = statusVPS;
            }

            const result = await digitalOceanApi.exportLBExcelDigitalOcean(
                query
            );
            return {
                results: result?.data?.data?.listLoadBalancer,
                total: result?.data?.data?.total,
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
                "Quản lý Load Balancer - DigitalOcean"
            );

            worksheet.addRow([]);

            const headerRowTotalVps = worksheet.addRow([
                "Tổng số Load Balancer:",
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

            // const headerRowTotalPrice = worksheet.addRow([
            //     "Tổng số tiền:",
            //     convertPriceToUSD(dataExport.totalMoney),
            // ]);
            // headerRowTotalPrice.eachCell({ includeEmpty: true }, (cell) => {
            //     cell.font = { bold: true };
            //     cell.alignment = { vertical: "middle", horizontal: "center" };
            //     cell.fill = {
            //         type: "pattern",
            //         pattern: "solid",
            //         fgColor: { argb: "F6A294" },
            //     };
            // });

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
                            return item?.name_load_balancer || "";

                        case "ip": {
                            return `IPV4: ${item?.ip} `;
                        }

                        case "status":
                            return item?.status || "";

                        case "team":
                            return item?.teamName;
                        default:
                            return item[col?._id] || "";
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
                    cell.alignment = { wrapText: true };
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
                a.download = `quan-ly-load-balancer-digitalocean.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
            }

            showToast("Xuất file thành công!", "success");
        } catch (error) {
            showToast("Xuất file thất bại!", "error");
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

export default ExportLBExcelDigitalOcean;
