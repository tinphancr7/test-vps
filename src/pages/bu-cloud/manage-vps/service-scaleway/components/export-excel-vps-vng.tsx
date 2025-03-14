import vpsApis from "@/apis/vps-apis";
import { VpsTypeEnum } from "@/constants/enum";
import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import moment from "moment";
import { formatPrice } from "@/utils/format-price";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useState } from "react";

const columns = [
    { _id: "label", name: "Nhãn" },
    { _id: "total", name: "Giá" },
    { _id: "ip", name: "Địa chỉ IP" },
    { _id: "status", name: "Trạng thái" },
    { _id: "os", name: "Hệ điều hành" },
    { _id: "team", name: "Team" },
    { _id: "expires", name: "Ngày hết hạn" },
    { _id: "uRLAaPanel", name: "URL Aapanel" },
    { _id: "note", name: "Ghi chú" },
];

function ExportOrderExcel() {
    const tableVpsVng = useAppSelector((state) => state.table["vps_bu_cloud"]);
    const { status, teamSelected, searchByIp, productName } = useAppSelector(
        (state) => state.vpsVng
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

            if (
                tableVpsVng?.sortDescriptor?.direction &&
                tableVpsVng?.sortDescriptor?.direction === "descending"
            ) {
                query.direction = -1;
            }

            if (
                tableVpsVng?.sortDescriptor?.direction &&
                tableVpsVng?.sortDescriptor?.direction === "ascending"
            ) {
                query.direction = 1;
            }

            if (tableVpsVng?.sortDescriptor?.column) {
                query.field = `vps_id.${tableVpsVng?.sortDescriptor?.column}`;
            }

            const { data } = await vpsApis.getPagingVpsVietStackOrVng({
                ...query,
                type: VpsTypeEnum.BU_CLOUD,
            });

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
            const worksheet = workbook.addWorksheet("Quản lý VPS - VNG");

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
                formatPrice(convertVnToUsd(dataExport.totalMoney, "VNG")),
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
                            return item["vps_id"]?.["vm"]?.["label"] || "";

                        case "total":
                            // eslint-disable-next-line no-case-declarations
                            const calculatorTotal =
                                item["vps_id"]?.["total"] +
                                item["vps_id"]?.["total"] * 0.1;

                            return formatPrice(
                                convertVnToUsd(calculatorTotal, "VNG")
                            );

                        case "os":
                            return item["vps_id"]?.["os"];

                        case "ip":
                            return item["vps_id"]?.["ip"] || "";

                        case "status":
                            return item["vps_id"]?.["status"] || "";

                        case "team":
                            return item["team"]?.name;

                        case "expires":
                            return moment(item["vps_id"]["expires"]).format(
                                "DD-MM-YYYY"
                            );

                        case "uRLAaPanel":
                            return item["vps_id"]?.["uRLAaPanel"] || "";

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
