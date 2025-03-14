import { useAppDispatch, useAppSelector } from "@/stores";
import { setPwConfirm } from "@/stores/slices/alibaba-ecs.slice";
import { Input } from "@heroui/react";
import { useMemo, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

function LogonPasswordConfirm() {
    const dispatch = useAppDispatch();
    const { password, pwConfirm } = useAppSelector((state) => state.alibabaEcs);

    const [type, setType] = useState<string>("text");

    const handleChangePassword = (value: string) => {
        dispatch(setPwConfirm(value));
    };

    const handleChangeType = () => {
        let value = "";

        if (type === "password") {
            value = "text";
        } else {
            value = "password";
        }

        setType(value);
    };

    const errorMessage = useMemo(() => {
        if (password && pwConfirm !== password) {
            return "Mật khẩu không khớp. Vui lòng nhập lại!"
        }

        return ""
    }, [password, pwConfirm]);

    return (
        <>
            <div className="grid grid-cols-7 items-start gap-2">
                <h3 className="text-base tracking-wide font-medium">
                    Xác nhận mật khẩu
                </h3>

                <div className="col-span-2 items-center">
                    <Input
                        radius="none"
                        color="primary"
                        variant="bordered"
                        labelPlacement="outside"
                        classNames={{
                            base: "w-full",
                            inputWrapper:
                                "h-18 data-[hover=true]:border-primary border border-slate-400",
                            label: "text-dark font-medium",
                        }}
                        placeholder="Confirm Password..."
                        type={type}
                        label={""}
                        value={pwConfirm}
                        onValueChange={handleChangePassword}
                        endContent={
                            <span
                                className="cursor-pointer"
                                onClick={handleChangeType}
                            >
                                {type === "password" ? (
                                    <IoIosEyeOff className="text-base" />
                                ) : (
                                    <IoIosEye className="text-base" />
                                )}
                            </span>
                        }
                        errorMessage={errorMessage}
                        isInvalid={!!errorMessage}
                    />
                </div>
            </div>
        </>
    );
}

export default LogonPasswordConfirm;
