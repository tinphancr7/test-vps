import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Image, Spinner } from "@heroui/react";
import { useReactToPrint } from "react-to-print";
import invoiceApi from "@/apis/invoice.api";
import { addCommas } from "@/utils";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import paths from "@/routes/paths";
import { ProviderIDEnum } from "@/constants/enum";

// Define TypeScript interfaces for better type safety
interface VMConfig {
    cpus: number;
    memory: number; // in MB
    disk: number; // in GB
    ipv4?: string;
}

interface InvoiceItem {
    invoice_id: string;
    invoice: {
        vm: VMConfig;
        date_created: string;
        total: number;
    };
}

interface GroupedItems {
    [key: string]: InvoiceItem[];
}

const DetailInvoiceVNG: React.FC = () => {
    const location = useLocation();
    const [provider, setProvider] = useState<any>({});
    const navigate = useNavigate();

    const id = location.state?.id;

    const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef });

    // Fetch invoice details
    useEffect(() => {
        const fetchDetailInvoice = async (invoiceId: string) => {
            setIsLoading(true);

            try {
                const response = await invoiceApi.callFetchInvoiceById(
                    invoiceId,
                    provider?._id
                );
                const data: InvoiceItem[] = response?.data?.data || [];
                setInvoices(data);
            } catch (err) {
                console.error("Error fetching invoice details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id && provider) {
            fetchDetailInvoice(id);
        }
    }, [id, provider]);
    useEffect(() => {
        // Fetch providers
        const fetchProvider = async () => {
            const response = await invoiceApi.callFetchProvider({
                search: "",
                page: 1,
                limit: 100,
            });

            if (response?.data?.data?.data?.length > 0) {
                const objData = response?.data?.data?.data?.find(
                    (item: any) => item._id ===  ProviderIDEnum.VNG
                );
                setProvider(objData);
            }
        };
        fetchProvider();
    }, []);
    // Group invoices based on VM configuration
    const groupItems: GroupedItems = useMemo(() => {
        const grouped: GroupedItems = {};
        invoices.forEach((item) => {
            const key = `${item?.invoice?.vm?.cpus || 0}-${
                Math.floor(item?.invoice?.vm?.memory / 1024) || 0
            }-${item?.invoice?.vm?.disk || 0}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        });
        return grouped;
    }, [invoices]);

    // Compute total quantities and amounts
    const totalQuantity = useMemo(() => {
        return Object.values(groupItems).reduce(
            (total, group) => total + group.length,
            0
        );
    }, [groupItems]);

    const totalAmount = useMemo(() => {
        return Object.values(groupItems).reduce(
            (total, group) => total + group[0]?.invoice.total * group.length,
            0
        );
    }, [groupItems]);

    const taxAmount = useMemo(() => totalAmount * 0.1, [totalAmount]);
    const grandTotal = useMemo(
        () => totalAmount + taxAmount,
        [totalAmount, taxAmount]
    );

    // Extract first invoice for header information
    const firstInvoice = invoices[0];

    return (
        <div className="h-[90vh] overflow-hidden overflow-y-auto">
            <div className="mx-auto flex flex-col items-center justify-center py-2">
                {/* Action Buttons */}
                <div className="flex items-center justify-between w-full max-w-[800px] my-4">
                    <Button
                        className="bg-red-500 text-white  text-sm uppercase"
                        onClick={() => navigate(paths.invoices_vng)}
                    >
                        Quay lại
                    </Button>
                    <Button
                        className="bg-primary text-white uppercase  text-sm "
                        onClick={handlePrint as any}
                    >
                        In hóa đơn
                    </Button>
                </div>
                <div
                    className="border border-gray-200 w-[800px] min-w-[800px] min-h-[900px] bg-no-repeat bg-cover"
                    style={{
                        backgroundImage: `url("/imgs/background-invoice.png")`,
                    }}
                    ref={contentRef}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full mt-[400px]">
                            <Spinner size="lg" color="primary" />
                        </div>
                    ) : (
                        <div className="px-12 py-20">
                            {/* Header Section */}
                            <div className="mb-12">
                                <Image
                                    src="/imgs/logo-vng.png"
                                    alt="VNG Logo"
                                    className="w-fit h-fit"
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-10">
                                {/* Invoice Details */}
                                <div className="col-span-6 text-white uppercase space-y-2 text-sm font-medium">
                                    <div className="flex items-center justify-between">
                                        <span>HÓA ĐƠN</span>
                                        <span>
                                            {firstInvoice?.invoice_id || ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>NGÀY LẬP HÓA ĐƠN</span>
                                        <span>
                                            {firstInvoice?.invoice
                                                ?.date_created || ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>NGÀY CẦN THANH TOÁN</span>
                                        <span>
                                            {firstInvoice?.invoice
                                                ?.date_created || ""}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="col-span-6 text-white uppercase space-y-2 text-sm font-medium">
                                    <div className="flex items-center justify-between">
                                        <span className="whitespace-nowrap">
                                            PHƯƠNG THỨC THANH TOÁN
                                        </span>
                                        <span className="whitespace-nowrap">
                                            CHUYỂN KHOẢN
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            color="success"
                                            className="text-white text-sm"
                                        >
                                            ĐÃ THANH TOÁN
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Content */}
                            <div className="mt-20 text-sm">
                                {/* Content Header */}
                                <div className="bg-white w-full p-4 font-bold">
                                    NỘI DUNG HÓA ĐƠN
                                </div>
                                <div className="bg-[#cefaf0] w-full p-4 font-bold flex items-center justify-between">
                                    <span>CHI TIẾT HÓA ĐƠN</span>
                                    <span>
                                        {firstInvoice?.invoice_id || ""}
                                    </span>
                                </div>

                                {/* Invoice Items */}
                                <div>
                                    {invoices.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white w-full p-4 font-bold flex items-center justify-between"
                                        >
                                            <div>
                                                {`IP (CPU: ${
                                                    item?.invoice?.vm?.cpus || 0
                                                } Core - RAM: ${
                                                    Math.floor(
                                                        item?.invoice?.vm
                                                            ?.memory / 1024
                                                    ) || 0
                                                } GB - SSD: ${
                                                    item?.invoice?.vm?.disk || 0
                                                } GB)`}
                                            </div>
                                            <div>
                                                {item?.invoice?.vm?.ipv4 || ""}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Grouped Items */}
                                {Object.entries(groupItems).map(
                                    ([key, group]) => (
                                        <div
                                            key={key}
                                            className="bg-[#cefaf0] w-full p-4 font-bold flex items-center justify-between"
                                        >
                                            <div>
                                                CLOUD VPS{" "}
                                                {group[0].invoice?.vm?.cpus ||
                                                    0}
                                                -
                                                {Math.floor(
                                                    group[0].invoice?.vm
                                                        ?.memory / 1024
                                                ) || 0}
                                            </div>
                                            <div>
                                                {addCommas(
                                                    convertVnToUsd(
                                                        group[0].invoice?.total,
                                                        "VNG"
                                                    ) || ""
                                                )}{" "}
                                                x {group.length} ={" "}
                                                {addCommas(
                                                    convertVnToUsd(
                                                        group[0].invoice
                                                            ?.total *
                                                            group.length,
                                                        "VNG"
                                                    ) || ""
                                                )}{" "}
                                                $
                                            </div>
                                        </div>
                                    )
                                )}

                                {/* Totals Section */}
                                <div className="bg-white flex flex-col items-end space-y-2 font-bold p-4">
                                    <div className="">
                                        <span>SỐ LƯỢNG</span>
                                        <span className="w-[150px] text-right inline-block">
                                            {totalQuantity}
                                        </span>
                                    </div>
                                    <div className="">
                                        <span>THÀNH TIỀN</span>
                                        <span className="w-[150px] text-right inline-block">
                                            {addCommas(
                                                convertVnToUsd(
                                                    totalAmount,
                                                    "VNG"
                                                ) || ""
                                            ) || 0}{" "}
                                            $
                                        </span>
                                    </div>
                                    <div className="">
                                        <span>THUẾ</span>
                                        <span className="w-[150px] text-right inline-block">
                                            {addCommas(
                                                convertVnToUsd(
                                                    taxAmount,
                                                    "VNG"
                                                ) || ""
                                            ) || 0}{" "}
                                            $
                                        </span>
                                    </div>
                                    <div className="">
                                        <span>GIẢM GIÁ</span>
                                        <span className="w-[150px] text-right inline-block">
                                            0
                                        </span>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div
                                    style={{
                                        background:
                                            "linear-gradient(to right, #0cebeb, #20e3b2, #29ffc6)",
                                    }}
                                    className="p-4"
                                >
                                    <div className="flex items-center justify-end font-bold">
                                        <span>TỔNG</span>
                                        <span className="w-[150px] text-right">
                                            {addCommas(
                                                convertVnToUsd(
                                                    Math.round(grandTotal),
                                                    "VNG"
                                                ) || ""
                                            ) || 0}{" "}
                                            $
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex flex-col items-end p-4 space-y-1 bg-white">
                                    <p className="font-bold">
                                        VNG CLOUD TECHNOLOGY COMPANY LIMITED
                                    </p>
                                    <p className="font-normal">
                                        698/1/12 Truong Chinh Street, Ward 15,
                                        Tan Binh District, Ho Chi Minh City,
                                        Vietnam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailInvoiceVNG;
