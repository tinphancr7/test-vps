import { Checkbox, Select, SelectItem, Tooltip } from "@heroui/react";
import { systemDiskCategories } from "./utils";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
    setBurstingEnabled,
    setCategory,
    setDeleteWithInstance,
    // setEncrypted,
    setPerformanceLevel,
    setProvisionedIops,
    setProvisionedIopsEnabled,
    setSize,
} from "@/stores/slices/alibaba-ecs.slice";
import Count from "@/components/count";
import { useMemo } from "react";
import Container from "@/components/container";

function DiskSelect() {
    const dispatch = useAppDispatch();
    const {
        category,
        size,
        performanceLevel,
        provisionedIops,
        provisionedIopsEnabled,
        // burstingEnabled,
        // encrypted,
        deleteWithInstance,
        categoriesList,
        performanceLevelsList,
        minSize,
    } = useAppSelector((state) => state.alibabaEcs);

    const columns = [
        { _id: "Category", name: "Category", classes: "col-span-2" },
        { _id: "Size", name: "Size", classes: "col-span-2" },
        { _id: "Quantity", name: "Quantity", classes: "col-span-1" },
        { _id: 'IOPS', name: 'IOPS' },
        { _id: "Performance", name: "Performance", classes: "col-span-3" },
        { _id: "Actions", name: "Actions", classes: "col-span-3" },
    ];

    const handleChangeCategory = (value: any) => {
        const [parseValue] = [...value];

        dispatch(setCategory(parseValue));
        
        dispatch(setProvisionedIops(10));
        dispatch(setProvisionedIopsEnabled(false));
        dispatch(setBurstingEnabled(true));
    };

    const handleChangePerformanceLevel = (value: any) => {
        const [parseValue] = [...value];

        dispatch(setPerformanceLevel(parseValue));
    };

    const handleChangeSize = (value: number) => {
        let customSize = value;

        if (category && value < Number(minSize)) {
            customSize = minSize;
        }

        dispatch(setSize(customSize));
    };

    const handleChangeProvisionedIopsEnabled = (value: boolean) => {
        dispatch(setProvisionedIopsEnabled(value));
    };

    const handleChangeProvisionedIops = (value: number) => {
        dispatch(setProvisionedIops(value));
    };

    /*
    const handleChangeBurstingEnabled = (value: boolean) => {
        dispatch(setBurstingEnabled(value));
    };
    */

    /*
    const handleChangeEncrypted = (value: boolean) => {
        dispatch(setEncrypted(value));
    };
    */

    const handleChangeDeleteWithInstance = (value: boolean) => {
        dispatch(setDeleteWithInstance(value));
    };

    // https://www.alibabacloud.com/help/en/ecs/user-guide/elastic-block-storage-devices?spm=a2c63.p38356.0.i1 
    // Step 1: Calculate Baseline IOPS
    const baselineIOPS = useMemo(() => {
        let iops = 0;

        if (category === "cloud_auto") {
            iops = Math.max(
                Math.min(1800 + 50 * size, 50000), // Formula: min{1800 + 50 × Capacity, 50,000}
                3000 // Minimum Baseline IOPS = 3,000
            );
        }

        if (category === "cloud_efficiency") {
            iops = Math.min(1960 + 8 * size, 5000);
        }
        
        if (category === "cloud_essd_entry") {
            iops = Math.min(1880 + 8 * size, 6000);
        }
        
        if (category === "cloud" || category === "cloud_essd_entry") {
            iops = Math.min(1960 + 8 * size, 6000);
        }

        if (category === "cloud_ssd") {
            iops = Math.min(2400 + 30 * size, 8100);
        }

        if (category === "cloud_essd") {
            if (performanceLevel === performanceLevelsList[0]?.value) {
                iops = Math.min(1800 + 12 * size, 10000);
            }

            if (performanceLevel === performanceLevelsList[1]?.value) {
                iops = Math.min(1800 + 50 * size, 50000);
            }

            if (performanceLevel === performanceLevelsList[2]?.value) {
                iops = Math.min(1800 + 50 * size, 100000);
            }

            if (performanceLevel === performanceLevelsList[4]?.value) {
                iops = Math.min(1800 + 50 * size, 1000000);
            }
        }

        return iops;
    }, [category, size, performanceLevel, performanceLevelsList])

    const maxProvisionedIops = useMemo(() => {
        // Step 2: Calculate Raw Provisioned IOPS
        const rawProvisionedIOPS = 1000 * size - baselineIOPS; // Formula: 1,000 × Capacity - Baseline IOPS

        // Step 3: Cap Provisioned IOPS at 50,000
        const provisionedIOPS = Math.min(rawProvisionedIOPS, 50000);

        return provisionedIOPS;
    }, [baselineIOPS, size]);

    const renderTooltipSize = useMemo(() => {
        return `Phạm vi từ ${minSize} -> 2048`;
    }, [minSize]);

    const renderTooltipReleaseMode = (
        <div className="flex flex-col gap-2">
            <h3 className="text-base tracking-wide font-medium">
                Chế độ phát hành
            </h3>

            <span>Nếu bạn không chọn Phát hành cùng Phiên bản, đĩa sẽ được giữ lại dưới dạng đĩa trả tiền khi sử dụng 3 ngày sau khi phiên bản hết hạn hoặc khi phiên bản được tự động phát hành sau khi hết hạn.</span>
            <span>Lưu ý: Nếu đĩa là đĩa hệ thống, đĩa sẽ được tách ra và giữ lại như đĩa dữ liệu khi phiên bản được giải phóng. Bạn không thể tạo ảnh tùy chỉnh từ ảnh chụp nhanh của đĩa dữ liệu. Trước khi phiên bản được giải phóng, hãy tạo ảnh tùy chỉnh từ ảnh chụp nhanh của đĩa hệ thống dựa trên yêu cầu kinh doanh của bạn.</span>
        </div>
    );

    /*
    const renderTooltipEncryption = (
        <div className="flex flex-col gap-2">
            <h3 className="text-base tracking-wide font-medium">
                Disk Encryption
            </h3>

            <span>Disk encryption strengthens the security of your data without the need to modify your business or applications. Snapshots that are created from the disk and disks that are created from the snapshots inherit the Encryption attribute of the disk.</span>
            
            <h3 className="text-base tracking-wide font-medium">
                Billing of Disk Encryption
            </h3>

            <span>The disk encryption feature is provided free of charge. You are not charged additional fees for read/write operations on the disk.</span>
            <span>The first time you use the disk encryption feature in a region after you activate KMS, KMS creates a service key with the alias acs/ecs for ECS in the region. You cannot delete or disable the service key.</span>
        </div>
    );
    */

    const renderCell = (columnKey: string) => {
        switch (columnKey) {
            case "Category":
                return (
                    <Select
                        items={systemDiskCategories(categoriesList || [])}
                        selectionMode="single"
                        classNames={{
                            base: "w-full",
                            label: "text-dark font-medium",
                            trigger:
                                "text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                        }}
                        disallowEmptySelection={true}
                        selectedKeys={new Set([category])}
                        onSelectionChange={handleChangeCategory}
                    >
                        {(item) => (
                            <SelectItem
                                key={item?.value}
                                textValue={item?.label}
                            >
                                {item?.label}
                            </SelectItem>
                        )}
                    </Select>
                );

            case "Size":
                return (
                    <Tooltip
                        radius="sm"
                        content={renderTooltipSize}
                        classNames={{
                            content: "max-w-80 overflow-auto scroll-main p-2",
                        }}
                    >
                        <div className="flex items-center gap-1">
                            <Count 
                                max={2048} 
                                value={size} 
                                setValue={handleChangeSize} 
                            />
                            GiB
                        </div>
                    </Tooltip>
                );

            case "Quantity":
                return 1;

            case "IOPS":
                return baselineIOPS || '_';

            case "Performance":
                if (category === "cloud_essd") {
                    return (
                        <Select
                            items={performanceLevelsList || []}
                            selectionMode="single"
                            classNames={{
                                base: "w-full",
                                label: "text-dark font-medium",
                                trigger:
                                    "text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                            }}
                            disallowEmptySelection={true}
                            selectedKeys={new Set([performanceLevel])}
                            onSelectionChange={handleChangePerformanceLevel}
                        >
                            {(item: any) => (
                                <SelectItem
                                    key={item?.value}
                                    textValue={item?.label}
                                >
                                    {item?.label}
                                </SelectItem>
                            )}
                        </Select>
                    );
                }

                if (category === "cloud_auto") {
                    return (
                        <div className="flex flex-col gap-2">
                            <Checkbox 
                                isSelected={provisionedIopsEnabled} 
                                onValueChange={handleChangeProvisionedIopsEnabled}
                                isDisabled={size <= 3 ? true : false}
                            >
                                <p className="text-left text-base">Bật cung cấp hiệu suất</p>
                            </Checkbox>

                            {(provisionedIopsEnabled && size >=4) && (
                                <Tooltip
                                    radius="sm"
                                    content={`Giá trị hợp lệ: 1 -> ${maxProvisionedIops}`}
                                    classNames={{
                                        content: "max-w-80 overflow-auto scroll-main p-2",
                                    }}
                                >
                                    <div className="flex items-center gap-1">
                                        <Count 
                                            max={maxProvisionedIops} 
                                            value={provisionedIops} 
                                            setValue={handleChangeProvisionedIops} 
                                        />
                                        IOPS
                                    </div>
                                </Tooltip>
                            )}

                            {/*
                                <Checkbox 
                                    isSelected={burstingEnabled} 
                                    onValueChange={handleChangeBurstingEnabled}
                                    isDisabled={size <= 3 ? true : false}
                                >
                                    <p className="text-left text-base">Enable Performance Burst</p>
                                </Checkbox>
                            */}
                        </div>
                    )
                }

                return "_";

            case "Actions":
                return (
                    <div className="flex flex-col gap-2">
                        <Tooltip
                            radius="sm"
                            placement="left"
                            content={renderTooltipReleaseMode}
                            classNames={{
                                content: "max-w-80 overflow-auto scroll-main p-2",
                            }}
                        >
                            <Checkbox 
                                isSelected={deleteWithInstance} 
                                onValueChange={handleChangeDeleteWithInstance}
                            >
                                <p className="text-left text-base">Phát hành bằng phiên bản</p>
                            </Checkbox>
                        </Tooltip>

                        {/* 
                            {!["cloud_efficiency", "cloud_ssd"].includes(category) && (
                                <Tooltip
                                    radius="sm"
                                    placement="left"
                                    content={renderTooltipEncryption}
                                    classNames={{
                                        content: "max-w-80 overflow-auto scroll-main p-2",
                                    }}
                                >
                                    <Checkbox 
                                        isSelected={encrypted} 
                                        onValueChange={handleChangeEncrypted}
                                    >
                                        <p className="text-left text-base">Encryption</p>
                                    </Checkbox>
                                </Tooltip>
                            )}
                        */}
                    </div>
                );
        }
    };

    return (
        <Container className="grid grid-cols-7 gap-2">
            <h3 className="text-base tracking-wide font-medium">
                Lưu trữ (Đĩa hệ thống)
            </h3>

            <div className="col-span-6 border border-gray-200">
                <div className="grid grid-cols-12 gap-2 bg-primary">
                    {columns?.map((col) => (
                        <div
                            key={col?._id}
                            className={`${
                                col?.classes || ""
                            } text-center font-medium text-white text-base p-2`}
                        >
                            <h3>{col?.name}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                    {columns?.map((col) => (
                        <div
                            key={col?._id}
                            className={`${
                                col?.classes || ""
                            } text-center text-base p-2`}
                        >
                            {renderCell(col?._id)}
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}

export default DiskSelect;
