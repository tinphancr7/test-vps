import { UserSchema } from "@/interfaces/user-schema";
import { useAppDispatch } from "@/stores";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { initialFormResetPw } from "./constants";
import useForm from "@/hooks/use-form";
import { Button, Input, ModalFooter } from "@heroui/react";
import { resetModal } from "@/stores/slices/modal-slice";
import userApis from "@/apis/user-api";
import showToast from "@/utils/toast";
import { useState } from "react";

function FormResetPw({ user }: { user: UserSchema }) {
    const {
        isEmptyValues,
        initialState,
        getState,
        setErrorMessage,
        setType,
        setValue,
        getValue,
        validateForm,
    } = useForm(initialFormResetPw);

    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleValueChange = (key: string, value: any) => {
        setValue(key, value);
        setErrorMessage(key, value && "");
    };

    const handleTypeInputChange = (key: string, type: string) => {
        setType(key, type === "text" ? "password" : "text");
    };

    const renderEndContent = (key: string, type: string) => {
        if (["password", "verifyPw"].includes(key)) {
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

    const onSubmit = async () => {
        if (isEmptyValues) {
            return validateForm();
        }

        if (getValue('verifyPw') !== getValue('password')) {
            return setErrorMessage('verifyPw', 'Xác nhận mật khẩu không đúng!');
        }

        try {
            setIsSubmitting(true);

            const { data } = await userApis.resetPassword(
                user?._id,
                getValue('password')
            );

            if (data?.status === 1) {
                showToast('Đổi mật khẩu thành công!', 'success');
                dispatch(resetModal());
            }
        } catch (error) {
            console.log('error: ', error);
            showToast('Đổi mật khẩu thất bại!', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full relative flex flex-col justify-between overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-3">
                {Object.keys(initialState).map((key, index) => {
                    return (
                        <Input
                            key={index}
                            radius="sm"
                            color="primary"
                            variant="bordered"
                            labelPlacement="outside"
                            classNames={{
                                inputWrapper:
                                    "h-10 data-[hover=true]:border-primary border border-slate-400",
                                label: "text-dark font-medium",
                            }}
                            type={getState(key).type}
                            label={getState(key).label}
                            placeholder={`${getState(key).label}`}
                            value={getValue(key)}
                            onValueChange={(value) => handleValueChange(key, value)}
                            endContent={renderEndContent(key, getState(key).type as string)}
                            errorMessage={getState(key).errorMessage}
                            isInvalid={!!getState(key).errorMessage}
                            onKeyDown={(event) => event.key === "Enter" && onSubmit()}
                        />
                    );
                })}
            </div>

            <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
                <Button
                    variant="solid"
                    color="danger"
                    className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                    onPress={() => dispatch(resetModal())}
                >
                    Hủy
                </Button>
                <Button
                    variant="solid"
                    className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                    isLoading={isSubmitting}
                    onPress={onSubmit}
                >
                    Xác nhận
                </Button>
            </ModalFooter>
        </div>
    )
}

export default FormResetPw;