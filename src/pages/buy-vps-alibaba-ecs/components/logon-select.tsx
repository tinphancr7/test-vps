import { Button } from "@heroui/react";
import { LOGON_CREDENTIAL_OPTIONS } from "./constants";
import Container from "@/components/container";
import LogonUsername from "./logon-username";
import LogonPassword from "./logon-password";
import LogonPasswordConfirm from "./logon-password-confirm";
import { useState } from "react";

function LogonSelect() {
    const [logonCredential, setLogonCredential] = useState('password');
    // const handleChangeIsPublicIpAddress = (value: boolean) => {
    //     dispatch(setIsPublicIpAddress(value));
    // };

    const billClassNames = (value: string) => {
        const items: string[] = [
            "bg-transparent cursor-pointer text-base tracking-wide p-2 border rounded-sm",
        ];

        const activeInstanceChargeType =
            logonCredential === value
                ? "border-primary font-medium"
                : "border-gray-300/80 font-normal";

        items.push(activeInstanceChargeType);

        return items.join(" ");
    };

    const handleChangeInternetChargeType = (value: string) => {
        setLogonCredential(value);
    };

    return (
        <Container className="flex flex-col gap-4">
            <h3 className="tracking-wide font-medium mb-4">Quản lý Instance</h3>

            <div className="grid grid-cols-7 items-center gap-2">
                <h3 className="text-base tracking-wide font-medium">
                    Thông tin xác thực
                </h3>

                <div className="col-span-6 grid grid-cols-4 gap-2">
                    {LOGON_CREDENTIAL_OPTIONS?.map((bill) => (
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

            <LogonUsername />
            <LogonPassword />
            <LogonPasswordConfirm />
        </Container>
    );
}

export default LogonSelect;
