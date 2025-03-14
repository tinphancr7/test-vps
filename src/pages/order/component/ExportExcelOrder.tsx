import { Button } from "@heroui/react";
import { useMemo, useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatPriceUsd } from "@/utils/format-price-usd";
import { ProviderIDEnum } from "@/constants/enum";
import moment from "moment";
import { toast } from "react-toastify";

export default function ExportExcelOrder({ itemOrder }: any) {
	const renderOrderStatus = (status: string) => {
		if (status === "new") {
			return "Chờ duyệt";
		}
		if (status === "accept") {
			return "Đã duyệt";
		}
		if (status === "delete") {
			return "Hủy đơn hàng";
		}
		return "Không duyệt";
	};
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const convertVnToUsd = (price: number, type?: string) => {
		let calculator = price / 26000;
		if (type === "bu_cloud") {
			calculator = price / 25500;
		}
		return calculator;
	};

	const convertMoneyVAT = (value: any, type?: string) => {
		const total: any = convertVnToUsd(value, type);
		const VAT: any = convertVnToUsd(value * 0.1, type);
		const another: any = convertVnToUsd(value * 1.1, type);
		const totalReturn = total + VAT;
		const VAT_n = Math.floor(VAT * 100) / 100;
		const total_n = Math.floor(total.toFixed(2) * 100) / 100;
		const totalReturn_n = Math.floor(totalReturn * 100) / 100;

		return {
			total: formatPriceUsd(total),
			VAT: formatPriceUsd(VAT),
			totalReturn: totalReturn,
			another,
			totalReturn_n: formatPriceUsd(totalReturn_n),
			totalReturn_n_w: totalReturn_n,
			VAT_n: formatPriceUsd(VAT_n),
			total_n: formatPriceUsd(total_n),
		};
	};
	const totalAmount = useMemo(() => {
		let type = "VNG";
		if (itemOrder?.orderProviderId?._id === ProviderIDEnum.BuCloud) {
			type = "bu_cloud";
		}
		return itemOrder?.orderProduct?.reduce((curr: any, item: any) => {
			const totalReturn = convertMoneyVAT(item?.price, type).totalReturn;
			curr += Math.floor(totalReturn * 100) / 100;
			return curr;
		}, 0);
	}, [itemOrder]);
	const handleExportExcel = async () => {
		if (!itemOrder?.orderProduct?.length) {
			toast.error("Không có dữ liệu để xuất!");
			return;
		}

		setIsLoading(true);
		try {
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet(
				`Chi tiết đơn hàng ${itemOrder?.orderId}`
			);

			// Thêm tiêu đề
			worksheet.addRow([`Chi tiết đơn hàng ${itemOrder?.orderId}`]).font = {
				bold: true,
				size: 14,
			};
			worksheet.mergeCells("A1:C1");
			worksheet.addRow([
				"Trạng thái đơn hàng:",
				itemOrder?.isDelete
					? renderOrderStatus("delete")
					: renderOrderStatus(itemOrder.orderStatusReview),
			]);
			worksheet.addRow([
				"Tổng số dịch vụ:",
				itemOrder?.orderService === "buy_vps"
					? itemOrder?.orderProductQuanlity
					: itemOrder.orderProduct.length,
			]);
			worksheet.addRow([
				"Tổng tiền:",
				itemOrder?.orderService === "buy_vps"
					? formatPriceUsd(
							convertMoneyVAT(itemOrder.orderProduct[0].price).totalReturn_n_w *
								itemOrder.orderProductQuanlity
					  )
					: formatPriceUsd(totalAmount.toFixed(2)),
			]);
			worksheet.addRow([]);

			// Thêm header
			const headers = ["Tên dịch vụ", "Địa chỉ IP", "Giá", "VAT(10%)", "Tổng"];
			if (itemOrder?.orderService === "renew_vps") {
				headers.splice(3, 0, "Ngày hết hạn");
			}
			const headerRow = worksheet.addRow(headers);
			headerRow.font = { bold: true };
			headerRow.eachCell((cell) => {
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFFFCC00" },
				};
				cell.alignment = { horizontal: "center" };
			});

			// Thêm dữ liệu vào bảng
			itemOrder?.orderProduct?.forEach((item: any) => {
				let type = "VNG";
				if (itemOrder?.orderProviderId?._id === ProviderIDEnum.BuCloud) {
					type = "bu_cloud";
				}
				const rowData = [
					item?.productName || "",
					item?.ip || "(Trống)",
					convertMoneyVAT(item?.price, type).total,
					convertMoneyVAT(item?.price, type).VAT_n,
					convertMoneyVAT(item?.price, type).totalReturn_n,
				];
				if (itemOrder?.orderService === "renew_vps") {
					rowData.splice(3, 0, moment(item.expires).format("DD/MM/YYYY"));
				}
				worksheet.addRow(rowData);
			});

			// Căn chỉnh & tạo đường viền
			worksheet.columns.forEach((column) => {
				column.width = 20;
			});
			worksheet.eachRow((row) => {
				row.eachCell((cell) => {
					cell.alignment = { vertical: "middle", horizontal: "center" };
					cell.border = {
						top: { style: "thin" },
						left: { style: "thin" },
						bottom: { style: "thin" },
						right: { style: "thin" },
					};
				});
			});

			// Xuất file
			const buffer = await workbook.xlsx.writeBuffer();
			saveAs(new Blob([buffer]), `ChiTietDonHang_${itemOrder?.orderId}.xlsx`);

			toast.success("Xuất file thành công!");
		} catch (error) {
			console.error("Lỗi xuất Excel:", error);
			toast.error("Xuất file thất bại thử lại sau!");
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
