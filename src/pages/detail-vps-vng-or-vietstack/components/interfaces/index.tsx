import { useAppSelector } from "@/stores";

function Interfaces() {
    const { vm } = useAppSelector((state) => state.detailVps);

    const columns = [
        { _id: "id", name: "ID" },
        { _id: "model", name: "MODEL" },
        { _id: "mac", name: "MAC" },
        { _id: "ip_address", name: "Địa chỉ IP" },
        { _id: "firewall", name: "Tường lửa" },
        { _id: "bridge", name: "BRIDGE" },
    ];

    const rowsInterface = Object.values(vm?.interfaces || []).map(
        (item: any) => ({
            key: item.id,
            id: item.name,
            model: item.model,
            mac: item.mac,
            ip_address: item.ip[0]?.ipaddress || "",
            firewall: item.firewall ? "Có" : "Không",
            bridge: item.bridge,
        })
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
                {columns?.map((col) => (
                    <div key={col?._id} className="col-span-2 tracking-wide uppercase text-base text-white p-2 font-semibold text-center">
                        {col?.name}
                    </div>
                ))}
            </div>

            {/* Render Rows */}
            {rowsInterface?.map(
                (row, index) => (
                    <div key={index} className="grid grid-cols-12">
                        {columns?.map((col) => (
                            <div key={col?._id} className="col-span-2 tracking-wide uppercase text-base text-center p-2">
                                {renderCell(row, col?._id)}
                            </div>
                        ))}
                    </div>
                )
            )}
            {!rowsInterface?.length && (
                <div className="h-full flex justify-center items-center tracking-wider">
                    <p className="mb-6">Không có dữ liệu</p>
                </div>
            )}
        </>
    );
}

export default Interfaces;
