// import digitalOceanApi from "@/apis/digital-ocean.api";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppDispatch, useAppSelector } from "@/stores";
import { getBillingHistory } from "@/stores/slices/digital-ocean-slice/digital-ocean-billing.slice";
// import {
//     EnumBillingTypeDigitalOcean,
//     convertInvoiceString,
//     convertPriceToUSD,
// } from "@/utils/digital-ocean";

import moment from "moment";
import { useEffect } from "react";
// import ModalDetailInvoiceDigitalOcean from "./ModalDetailInvoiceDigitalOcean";

function TableInvoiceDigitalOcean() {
    const dispatch = useAppDispatch();
    const { billing, total, searchData } = useAppSelector(
        (state) => state.digitalOceanBillingHistory
    );
    // const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    // const [dataDetailInvoice, setDataDetailInvoice] = useState([]);
    const columns = [
        { _id: "nameProduct", name: "Tên sản phẩm" },
        { _id: "timeUse", name: "Thời gian sử dụng" },
        { _id: "amount", name: "Số tiền" },
        { _id: "teamOwner", name: "Team" },
        // { _id: "actions", name: "Hành động" },
    ];
    const invoiceDO = useAppSelector(
        (state) => state.table["invoice-digital-ocean"]
    );

    // const handleDetailInvoice = async (item: any) => {
    //     const dataRes = await digitalOceanApi.invoiceDetailDigitalOcean(
    //         item?._id
    //     );
    //     setDataDetailInvoice(dataRes?.data);
    //     setIsOpenModalConfirm(true);
    // };
    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "nameProduct":
                return (
                    <div className="w-full">
                        <p>
                            <strong>{item?.product}: </strong>
                            {item?.productInfo?.nameVPS ||
                                item?.productInfo?.name_load_balancer}
                        </p>

                        <p>{item?.description}</p>
                        {item?.product === "Load Balancers"
                            ? item?.productInfo?.ip
                            : item?.productInfo?.networks?.v4[0]?.ip_address}
                    </div>
                );
            case "timeUse":
                return (
                    <div>
                        <p>
                            <strong>Ngày bắt đầu:</strong>{" "}
                            {moment(item?.start_time).format("DD-MM-YYYY")}{" "}
                        </p>
                        <p>
                            <strong>Ngày kết thúc:</strong>{" "}
                            {moment(item?.end_time).format("DD-MM-YYYY")}
                        </p>
                        <p>
                            <strong>Tổng thời gian sử dụng:</strong>{" "}
                            {/* {item?.duration} {item?.duration_unit} */}
                            {item?.duration} Giờ
                        </p>
                    </div>
                );

            // case "description":
            //     return (
            //         <div>
            //             <p>
            //                 {item?.type ===
            //                 EnumBillingTypeDigitalOcean.PAYMENT ? (
            //                     "Đã thanh toán"
            //                 ) : (
            //                     <>
            //                         <p
            //                             className="underline text-blue-400 hover:cursor-pointer "
            //                             onClick={() =>
            //                                 handleDetailInvoice(item)
            //                             }
            //                         >
            //                             Chi tiết{" "}
            //                             {convertInvoiceString(
            //                                 item?.description
            //                             )}
            //                         </p>
            //                     </>
            //                 )}
            //             </p>
            //         </div>
            //     );
            case "amount":
                return (
                    <div>
                        <p className="font-bold">{item?.amount} $</p>
                    </div>
                );
            case "teamOwner":
                return (
                    <div>
                        <p className="font-bold">{item?.teamInfo?.name}</p>
                    </div>
                );
            // case "actions":
            //     return (
            //         <Tooltip
            //             color="danger"
            //             content={"Download PDF"}
            //             className={`capitalize`}
            //         >
            //             <Button
            //                 color="danger"
            //                 variant="solid"
            //                 radius="full"
            //                 className={` min-w-0 w-max p-[6px] h-max min-h-max`}
            //             >
            //                 <FiDownload className="min-w-max text-base w-4 h-4" />
            //             </Button>
            //         </Tooltip>
            //     );

            default:
                return cellValue;
        }
    };
    useEffect(() => {
        if (invoiceDO) {
            const cPageSize = invoiceDO?.pageSize
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                  [...invoiceDO?.pageSize][0]
                : 10;

            const query = {
                pageIndex: invoiceDO?.pageIndex || 1,
                pageSize: cPageSize,
            };
            dispatch(getBillingHistory({ ...searchData, ...query }));
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceDO, searchData]);

    
    return (
        <Container>
            <TableControl
                tableId={"invoice-digital-ocean"}
                columns={columns}
                data={billing}
                total={total}
                isLoading={false}
                renderCell={renderCell}
            />

            {/* <ModalDetailInvoiceDigitalOcean
                isOpenModalConfirm={isOpenModalConfirm}
                onOpenModalConfirm={setIsOpenModalConfirm}
                dataDetailInvoice={dataDetailInvoice}
            /> */}
        </Container>
    );
}

export default TableInvoiceDigitalOcean;
