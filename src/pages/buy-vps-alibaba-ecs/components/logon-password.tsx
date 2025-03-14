import { useAppDispatch, useAppSelector } from "@/stores";
import { setPassword } from "@/stores/slices/alibaba-ecs.slice";
import { Input } from "@heroui/react";
import { useMemo, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

function LogonPassword() {
    const dispatch = useAppDispatch();
    const { password } = useAppSelector((state) => state.alibabaEcs);

    const [type, setType] = useState<string>("text");

    const handleChangePassword = (value: string) => {
        dispatch(setPassword(value));
    };

    const errorMessage = useMemo(() => {
        const checks = [
            {
              isValid: /^.{8,30}$/.test(password),
              message: "Mật khẩu phải có từ 8 đến 30 ký tự.",
            },
            {
              isValid: /[a-z]/.test(password),
              message: "Mật khẩu phải chứa ít nhất một chữ cái viết thường.",
            },
            {
              isValid: /[A-Z]/.test(password),
              message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.",
            },
            {
              isValid: /[0-9]/.test(password),
              message: "Mật khẩu phải chứa ít nhất một chữ số.",
            },
            {
              // eslint-disable-next-line no-useless-escape
              isValid: /[()~!@#$%^&*\-_=+\[\]{}|;:<>,.?/]/.test(password),
              message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.",
            },
        ];
      
        return checks;
    }, [password]);

    const handleChangeType = () => {
        let value = "";

        if (type === "password") {
            value = "text";
        } else {
            value = "password";
        }

        setType(value);
    };

    return (
        <>
            <div className="grid grid-cols-7 items-start gap-2">
                <h3 className="text-base tracking-wide font-medium">
                    Mật khẩu
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
                        placeholder="Password..."
                        type={type}
                        label={""}
                        value={password}
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
                        isInvalid={!!errorMessage?.slice(0, -1)?.find(it => !it?.isValid)}
                    />
                </div>

                <div className="col-span-4 ml-4 flex flex-col gap-2">
                    {errorMessage?.map((err, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <FaCheckCircle className={`text-base ${err?.isValid ? "text-success-600" : "text-gray-400"}`} />

                            <span className="text-base">
                                {err?.message}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default LogonPassword;
