import alibabaEcsApis from "@/apis/alibaba-ecs.api";
import buCloudAlibabaEcsApis from "@/apis/bu-cloud-alibaba-ecs.api";
import useForm from "@/hooks/use-form";
import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    Input,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useLocation } from "react-router-dom";

function ModifyInstancePassword() {
    const { pathname } = useLocation();
    const { instance } = useAppSelector(state => state.alibabaEcs);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { form, getState, setType, setValue, getValue, setErrorMessage } = 
        useForm({
            password: {
                label: "New Password",
                value: "",
                type: "password",
                errorMessage: ""
            },
            pwConfirm: {
                label: "Confirm Password",
                value: "",
                type: "password",
                errorMessage: ""
            },
        })

    const handleClosePopup = () => {
        setIsOpen(false);
    };

    const handleValueChange = (key: string, value: any) => {
        setValue(key, value);

        if (key === "pwConfirm" && value !== getValue('password')) {
            setErrorMessage('pwConfirm', 'The passwords do not match');
        }

        if (key === "pwConfirm" && value === getValue('password')) {
            setErrorMessage('pwConfirm', '');
        }
    };
    
    const handleTypeInputChange = (key: string, type: string) => {
        setType(key, type === "text" ? "password" : "text");
    };

    const renderEndContent = (key: string, type: string) => {
        if (key === "password" || key === "pwConfirm") {
          return (
            <span
              className="cursor-pointer"
              onClick={() => handleTypeInputChange(key, type)}
            >
              {type === "password" ? (
                <IoIosEyeOff className="text-base" />
              ) : (
                <IoIosEye className="text-base" />
              )}
            </span>
          );
        }
        return null;
    };
    
    const validatePw = useMemo(() => {
        const checks = [
            {
                isValid: /^.{8,30}$/.test(getValue('password')),
                message: "Mật khẩu phải có từ 8 đến 30 ký tự.",
            },
            {
                isValid: /[a-z]/.test(getValue('password')),
                message: "Mật khẩu phải chứa ít nhất một chữ cái viết thường.",
            },
            {
                isValid: /[A-Z]/.test(getValue('password')),
                message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.",
            },
            {
                isValid: /[0-9]/.test(getValue('password')),
                message: "Mật khẩu phải chứa ít nhất một chữ số.",
            },
            {
                // eslint-disable-next-line no-useless-escape
                isValid: /[()~!@#$%^&*\-_=+\[\]{}|;:<>,.?/]/.test(getValue('password')),
                message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.",
            },
        ];
        
        return checks;
    }, [getValue]);

    const handleChangeInstancePassword = async () => {
        try {
            setIsLoading(true);

            const split = pathname?.split('/');
            let api: any = alibabaEcsApis;

            if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
                api = buCloudAlibabaEcsApis;
            }

            const { data } = await api.modifyInstanceAttribute({
                InstanceId: instance?.["vps_id"]?.InstanceId,
                Password: getValue('password'),
            });

            if (data?.status === 1) {
                showToast('Modify Instance Password Success!', 'success');
            }
        } catch (error: any) {
            showToast(error?.response?.data?.message || "Modify Instance Password Error!", "error");
            console.log('error: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover
            showArrow
            backdrop="transparent"
            classNames={{
                content: [
                    "px-3 py-4 border border-default-200 shadow-container rounded-sm min-w-96",
                ],
            }}
            placement="right"
            isOpen={isOpen} 
            onOpenChange={(open) => setIsOpen(open)}
        >
            <PopoverTrigger>
                <Button
                    variant="solid"
                    radius="full"
                    className={`bg-transparent min-w-0 w-max p-[6px] h-max min-h-max data-[hover=true]:text-primary-400 text-primary-500 tracking-wide font-medium`}
                >
                    Reset Password
                </Button>
            </PopoverTrigger>
            <PopoverContent className="items-start">
                <h3 className="text-lg text-gray-500 font-semibold">
                    Reset Instance Password
                </h3>

                <div className="flex flex-col gap-3 w-full mt-4">
                    {Object.keys(form).map((key, index) => (
                        <>
                            <Input
                                key={index}
                                color="primary"
                                variant="bordered"
                                labelPlacement="outside"
                                placeholder={`${getState(key).label}...`}
                                classNames={{
                                    inputWrapper:
                                        "h-10 data-[hover=true]:border-primary border border-slate-400 rounded-sm",
                                    label: "text-dark font-medium",
                                }}
                                type={getState(key).type}
                                label={getState(key).label}
                                value={getState(key).value}
                                onValueChange={(value) => handleValueChange(key, value)}
                                endContent={renderEndContent(key, getState(key).type as string)}
                                errorMessage={getState(key).errorMessage}
                                isInvalid={key === 'password' ? !!validatePw?.slice(0, -1)?.find(it => !it?.isValid) : !!getState(key).errorMessage}
                            />

                            {key === 'password' && (
                                <div key={index} className="col-span-4 ml-2 flex flex-col gap-2">
                                    {validatePw?.map((err) => (
                                        <div className="flex items-center gap-2">
                                            <FaCheckCircle className={`text-base ${err?.isValid ? "text-success-600" : "text-gray-400"}`} />
                
                                            <span className="text-base">
                                                {err?.message}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ))}

                    <p className="text-gray-400 text-base italic break-words max-w-96">
                        You can only reset the password corresponding to the username specified when you created the instance. After you reset the password, the instance will restart for the new password to take effect.
                    </p>
                </div>

                <div className="flex w-full gap-2 mt-5 items-center justify-end">
                    <Button
                        color="primary"
                        className="bg-primary-500 rounded-sm text-lg min-h-max h-8 font-medium"
                        onPress={handleChangeInstancePassword}
                        isLoading={isLoading}
                        isDisabled={!!validatePw?.slice(0, -1)?.find(it => !it?.isValid)}
                    >
                        OK
                    </Button>

                    <Button
                        variant="bordered"
                        className="border rounded-sm bg-transparent text-lg min-h-max h-8 font-medium"
                        onPress={handleClosePopup}
                    >
                        Cancel
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default ModifyInstancePassword;