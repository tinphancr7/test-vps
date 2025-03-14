import Container from "@/components/container";
import { getCategoryName } from "@/pages/buy-vps-alibaba-ecs/components/utils";
import { useAppSelector } from "@/stores";
import { Chip, Snippet, Spinner } from "@heroui/react";
import moment from "moment";
import { useMemo } from "react";

function BasicInformationBlockStorage() {
    const { disks } = useAppSelector(
        (state) => state.alibabaEcs
    );

    const ecsInfo = useMemo(() => {
        return [
            { 
                key: "DiskId",
                label: "Disk ID", 
                value: disks[0]?.DiskId,
            },
            { 
                key: "Status",
                label: "Status", 
                value: disks[0]?.Status,
            },
            { 
                key: "Category",
                label: "Category", 
                value: getCategoryName(disks[0]?.Category),
            },
            { 
                key: "Size",
                label: "Size", 
                value: [disks[0]?.Size, disks[0]?.IOPS],
            },
            { 
                key: "Type",
                label: "Type", 
                value: disks[0]?.Type,
            },
            { 
                key: "Encrypted",
                label: "Encrypted/Unencrypted", 
                value: `${!disks[0]?.Encrypted && 'Not'} Encrypted`
            },
            { 
                key: "SerialNumber",
                label: "Serial Number", 
                value: disks[0]?.SerialNumber,
            },
            { 
                key: "CreationTime",
                label: "Creation Time", 
                value: moment(disks[0]?.CreationTime)?.format('DD-MM-YYYY | HH:mm:ss'),
            },
        ]
    }, [disks]);
    
    const colorStatus = (type: string) => {
        switch (type) {
            case "ReIniting":
            case "Creating":
            case "Attaching":
            case "Detaching":
                return "warning";

            case "In_use":
            case "All":
                return "success";

            default:
                return "danger";
        }
    };

    const renderValueInfo = (key: string, value: any) => {
        switch (key) {
            case "DiskId":
                return (
                    <div className="flex items-center gap-0">
                        <Snippet
                            size="sm" 
                            hideSymbol={true}
                            classNames={{
                                base: 'bg-transparent',
                                pre: 'text-base'
                            }}
                        >
                            {value}
                        </Snippet>
                    </div>
                );

            case "Status":
                return (
                    <div className="flex items-center gap-2">
                        <Chip
                            radius="sm"
                            color={colorStatus(value)}
                            variant="dot"
                            classNames={{
                                base: "h-auto border-none",
                                content:
                                    "font-semibold tracking-wider py-1 items-center gap-2 flex",
                                dot: "w-3 h-3",
                            }}
                        >
                            {value === "In_use" ? 'In Use' : value}

                            {["Creating", "ReIniting"].includes(value) && (
                                <Spinner size="sm" aria-label="Loading..." />
                            )}
                        </Chip>
                    </div>
                );
            
            case "Size":
                // eslint-disable-next-line no-case-declarations
                const [size, iops] = value;

                return (
                    <div className="flex items-center gap-1">
                        <span><b>{size}</b> GiB</span>
                        <span>
                            (<b>{iops}</b> IOPS)
                        </span>
                    </div>
                );

            case "Type":
                return (
                    <span className="text-base capitalize">{value} Disk</span>
                );

            default:
                return (
                    <span className="text-base">{value}</span>
                );
        }
    };

    return (
        <Container className="p-4 grid grid-cols-3 gap-3">
            <p className="font-medium col-span-3">Basic Information</p>

            {ecsInfo?.map((it: any, index: number) => (
                <div key={index} className="col-span-1">
                    <p className="text-base tracking-wide font-semibold">{it?.label}</p>

                    {renderValueInfo(it?.key, it?.value)}
                </div>
            ))}
        </Container>
    )
}

export default BasicInformationBlockStorage;