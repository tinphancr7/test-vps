import ActionsCell from "@/components/actions-cell";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { ProviderIDEnum } from "@/constants/enum";
import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkPaginationInvoiceServerVietServer } from "@/stores/async-thunks/invoice-server-vietserver";
import { formatPrice } from "@/utils/format-price";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useEffect } from "react";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function TableInvoiceServerVietServer() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { invoicesList, total, isLoading } = useAppSelector(
        (state) => state.invoiceServerVietServer
    );

    const columns = [
        { _id: "team", name: "Team" },
        { _id: "provider", name: "Nhà cung cấp" },
        { _id: "price", name: "Giá" },
        { _id: "actions", name: "Hành động" },
    ];

    useEffect(() => {
        dispatch(
            asyncThunkPaginationInvoiceServerVietServer({
                isServer: true,
                provider: ProviderIDEnum.VietServer,
            })
        );

        return () => {};
    }, []);

    const onDetail = (item: any) => {
        navigate(paths.invoices_server_vietserver + '/detail', {
            state: { id: item?.invoice_id },
            replace: true,
        });
    };

    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];

        const addNewActions = [
            {
                order: 1,
                label: "Xem hóa đơn",
                icon: FaFileInvoiceDollar,
                bgColor: "bg-warning",
                isDisabled: false,
                onPress: () => {
                    onDetail(item);
                },
            },
        ];

        switch (columnKey) {
            case "price":
                return (
                    <p className="font-medium tracking-wider min-w-max">
                        {formatPrice(convertVnToUsd(cellValue, "VietServer")) ||
                            ""}{" "}
                        $
                    </p>
                );

            case "team":
                return (
                    <p className="text-center tracking-wide">
                        {cellValue ? cellValue?.name : 'Trống'}
                    </p>
                )

            case "provider":
                return (
                    <p className="text-center tracking-wide">
                        {cellValue?.name}
                    </p>
                );

            case "actions":
                return (
                    <ActionsCell
                        disableDelete={true}
                        disableUpdate={true}
                        actionsAdd={addNewActions}
                    />
                );

            default:
                return <p className="text-center tracking-wide">{cellValue}</p>;
        }
    };

    return (
        <Container>
            <TableControl
                tableId={"invoices_server_vietserver"}
                columns={columns}
                data={invoicesList}
                total={total}
                isLoading={isLoading}
                renderCell={renderCell}
            />
        </Container>
    );
}

export default TableInvoiceServerVietServer;
