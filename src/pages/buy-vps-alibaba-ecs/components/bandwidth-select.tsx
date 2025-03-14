import { useAppDispatch, useAppSelector } from "@/stores";
import { Button } from "@heroui/react";
import { BANDWIDTH_OPTIONS, MAX_BANDWIDTH } from "./constants";
import { setInternetMaxBandwidthOut } from "@/stores/slices/alibaba-ecs.slice";
import Count from "@/components/count";

function BandwidthsSelect() {
    const dispatch = useAppDispatch();
    const { internetMaxBandwidthOut } = useAppSelector(
        (state) => state.alibabaEcs
    );

    const billClassNames = (value: string) => {
        const items: string[] = [
            "bg-transparent cursor-pointer text-base tracking-wide p-2 border rounded-sm",
        ];
        const activeInstanceChargeType =
            String(internetMaxBandwidthOut) === String(value)
                ? "border-primary font-medium"
                : "border-gray-300/80 font-normal";

        items.push(activeInstanceChargeType);

        return items.join(" ");
    };
    
    const handleChangeInternetMaxBandwidthIn = (value: any) => {
        dispatch(setInternetMaxBandwidthOut(value));
    };

    return (
        <div className="grid grid-cols-7 gap-2">
            <h3 className="text-base tracking-wide font-medium">
                Băng thông
            </h3>

            <div className="col-span-6 grid grid-cols-12 gap-2">
                <div className="col-span-9 grid grid-cols-9 items-center">
                    {BANDWIDTH_OPTIONS?.map((bill) => (
                        <Button
                            key={bill}
                            className={billClassNames(bill)}
                            onPress={() =>
                                handleChangeInternetMaxBandwidthIn(bill)
                            }
                        >
                            {bill}
                        </Button>
                    ))}

                    <span className="ml-2">Mbps</span>
                </div>

                <div className="col-span-3 flex justify-center items-center gap-2">
                    <Count
                        max={MAX_BANDWIDTH}
                        value={internetMaxBandwidthOut}
                        setValue={handleChangeInternetMaxBandwidthIn}
                    />

                    Mbps
                </div>
            </div>
        </div>
    );
}

export default BandwidthsSelect;
