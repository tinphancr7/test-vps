import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetImagesAlibabaEcs, asyncThunkGetInstanceTypesAlibabaEcs } from "@/stores/async-thunks/alibaba-ecs-thunk";
import { setInstanceType, setPageNumber, setZone } from "@/stores/slices/alibaba-ecs.slice";
import { Button, Spinner, Tooltip } from "@heroui/react";
import { RxQuestionMarkCircled } from "react-icons/rx";

function ZoneSelect() {
    const dispatch = useAppDispatch();
    const { region, zonesList, zone, isLoading } = useAppSelector(state => state.alibabaEcs);

    const zoneClassNames = (value: string) => {
        const items: string[] = ['bg-transparent cursor-pointer text-base tracking-wide min-w-[150px] p-2 border rounded-sm'];
        const activeRegion = zone === value ? 'border-primary font-medium' : 'border-gray-300/80 font-normal';

        items.push(activeRegion);

        const findOne = zonesList?.find((bill: any) => bill?.ZoneId === value);
        const disableBillMethods = findOne?.isDisabled ? 'opacity-60' : 'opacity-100';

        items.push(disableBillMethods);

        return items.join(' ');
    };

    const handleChangeRegion = async (value: string) => {
        dispatch(setZone(value));

        if (value) {
            dispatch(setPageNumber(1));

            const { instanceTypes } = await dispatch(
                asyncThunkGetInstanceTypesAlibabaEcs({
                    RegionId: region,
                    ZoneId: value,
                    PageNumber: 1
                })
            ).unwrap();

            dispatch(setInstanceType(instanceTypes[0]?.InstanceTypeId));
            dispatch(
                asyncThunkGetImagesAlibabaEcs({ 
                    RegionId: region, 
                    InstanceType: instanceTypes[0]?.InstanceTypeId 
                })
            );
        }
    };

    const renderTooltip = (
        <p>Mỗi vùng có nhiều vị trí biệt lập được gọi là vùng. Mỗi vùng có nguồn điện và mạng riêng biệt. Các phiên bản được triển khai trong cùng một vùng được kết nối với nhau qua cùng một mạng nội bộ, cung cấp độ trễ thấp và tốc độ truy cập cao giữa các phiên bản.</p>
    );

    return (
        <div className="grid grid-cols-7 gap-2">
            <div className="flex items-center gap-1">
                <h3 className="text-base tracking-wide font-medium">
                    Chọn vùng
                </h3>

                <Tooltip
                    radius="sm"
                    content={renderTooltip}
                    classNames={{
                        content:
                            "max-w-80 overflow-auto scroll-main p-2",
                    }}
                >
                    <span className="text-gray-500">
                        <RxQuestionMarkCircled />
                    </span>
                </Tooltip>
            </div>

            <div className="col-span-6 grid grid-cols-4 gap-2">
                {isLoading?.zonesList ? (
                    <div className="flex items-center justify-center bg-transparent cursor-pointer text-base tracking-wide min-w-[150px] p-2 border rounded-sm">
                        <Spinner color="primary" />
                    </div>
                ) : zonesList?.map((rg: any) => (
                    <Button
                        key={rg?.ZoneId} 
                        className={zoneClassNames(rg?.ZoneId)}
                        onPress={() => handleChangeRegion(rg?.ZoneId)}
                    >
                        {rg?.LocalName}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default ZoneSelect;