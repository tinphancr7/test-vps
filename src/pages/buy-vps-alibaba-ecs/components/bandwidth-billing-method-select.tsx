import { useAppDispatch, useAppSelector } from "@/stores";
import { Button } from "@heroui/react";
import { INTERNET_BILL_METHODS } from "./constants";
import { setInternetChargeType } from "@/stores/slices/alibaba-ecs.slice";
import BandwidthsSelect from "./bandwidth-select";
import Container from "@/components/container";

function BandwidthBillingMethodSelect() {
    const dispatch = useAppDispatch();
    const { internetChargeType } = useAppSelector(
        (state) => state.alibabaEcs
    );

    // const handleChangeIsPublicIpAddress = (value: boolean) => {
    //     dispatch(setIsPublicIpAddress(value));
    // };

    const billClassNames = (value: string) => {
        const items: string[] = [
            "bg-transparent cursor-pointer text-base tracking-wide p-2 border rounded-sm",
        ];
        const activeInstanceChargeType =
            internetChargeType === value
                ? "border-primary font-medium"
                : "border-gray-300/80 font-normal";

        items.push(activeInstanceChargeType);

        const findOne = INTERNET_BILL_METHODS.find((bill) => bill?.value === value);
        const disableBillMethods = findOne?.isDisabled
            ? "opacity-60"
            : "opacity-100";

        items.push(disableBillMethods);

        return items.join(" ");
    };

    const handleChangeInternetChargeType = (value: string) => {
        const findOne = INTERNET_BILL_METHODS.find((bill) => bill?.value === value);

        if (!findOne?.isDisabled) {
            dispatch(setInternetChargeType(value));
        }
    };

    return (
        <Container className="flex flex-col gap-6">
            <h3 className="tracking-wide font-medium mb-2">
                Băng thông
            </h3>

            {/*
                <h3 className="text-base tracking-wide font-medium">
                    Public Ip Address
                </h3>

                <div className="col-span-6 grid grid-cols-4 gap-2">
                    <Checkbox
                        isSelected={isPublicIpAddress} 
                        onValueChange={handleChangeIsPublicIpAddress}
                    >
                        <p className="text-left text-base">Assign Public IPv4 Address</p>
                    </Checkbox>
                </div>
            */}
            
            <div className="grid grid-cols-7 gap-2">
                <h3 className="text-base tracking-wide font-medium">
                    Phương thức thanh toán băng thông
                </h3>

                <div className="col-span-6 grid grid-cols-4 gap-2">
                    {INTERNET_BILL_METHODS?.map((bill) => (
                        <Button
                            key={bill?.value}
                            className={billClassNames(bill?.value)}
                            onPress={() =>
                                handleChangeInternetChargeType(bill?.value)
                            }
                        >
                            {bill?.label}
                        </Button>
                    ))}
                </div>
            </div>

            <BandwidthsSelect />
        </Container>
    );
}

export default BandwidthBillingMethodSelect;
