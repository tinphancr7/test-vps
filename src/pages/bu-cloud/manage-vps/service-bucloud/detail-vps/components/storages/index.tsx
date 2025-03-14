import { useAppSelector } from "@/stores";

function Storages() {
    const { vm } = useAppSelector((state) => state.detailVps);

    const columnsStorage = [
        { _id: "bus_device", name: "BUS/DEVICE" },
        { _id: "size", name: "Kích thước" },
        { _id: "storage", name: "STORAGE" },
    ];

    const rowsStorage = Object.values(vm?.storage || []).map(
        (item: any, index: any) => ({
          key: index,
          bus_device: item.name,
          size: item.size_gb,
          storage: item.zone,
        }),
    );

    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            default: 
                return cellValue;
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 bg-primary rounded-tl-md rounded-tr-md">
                {columnsStorage?.map((col) => (
                    <div key={col?._id} className="col-span-4 tracking-wide uppercase text-base text-white p-2 font-semibold text-center">
                        {col?.name}
                    </div>
                ))}
            </div>

            {/* Render Rows */}
            {rowsStorage?.map(
                (row, index) => (
                    <div key={index} className="grid grid-cols-12">
                        {columnsStorage?.map((col) => (
                            <div key={col?._id} className="col-span-4 tracking-wide uppercase text-base text-center p-2">
                                {renderCell(row, col?._id)}
                            </div>
                        ))}
                    </div>
                )
            )}

            {!rowsStorage?.length && (
                <div className="h-full flex justify-center items-center tracking-wider">
                    <p className="mb-6">Không có dữ liệu</p>
                </div>
            )}
        </>
    )
}

export default Storages;