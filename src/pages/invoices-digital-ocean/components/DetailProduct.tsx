import {
    convertDurationToHour,
    convertPriceToUSD,
} from "@/utils/digital-ocean";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@heroui/table";

function DetailProduct({ itemProduct }: any) {
    return (
        <>
            <div className="border-2 p-4 font-bold flex justify-between">
                <p>
                    {itemProduct?.product === "Droplets"
                        ? "VPS"
                        : itemProduct?.product}{" "}
                    - {itemProduct?.items?.length}
                </p>
                <p>{convertPriceToUSD(itemProduct?.totalAmount)}</p>
            </div>

            <div className="border-l-2 border-b-2 border-r-2">
                <Table
                    aria-label="Example table"
                    classNames={{
                        base: "p-2",
                        wrapper: "border-0 p-0 max-h-72 scroll-main",
                        th: "bg-primary uppercase tracking-wider text-sm text-white font-bold first:rounded-l-none last:rounded-r-none",
                    }}
                >
                    <TableHeader>
                        <TableColumn>Tên</TableColumn>
                        <TableColumn>Thời gian sử dụng</TableColumn>
                        <TableColumn>Giá tiền</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {itemProduct?.items.map((item: any) => (
                            <TableRow key={item?._id}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>
                                    {Number(item?.duration) === 0
                                        ? ""
                                        : convertDurationToHour(
                                              item?.duration,
                                              item?.duration_unit
                                          )}
                                </TableCell>
                                <TableCell>
                                    <p className="font-bold">
                                        {convertPriceToUSD(Number(item.amount))}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

export default DetailProduct;
