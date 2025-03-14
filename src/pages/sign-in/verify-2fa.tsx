import authApis from "@/apis/auth-apis";
import paths from "@/routes/paths";
import { useAppDispatch } from "@/stores";
import { login } from "@/stores/slices/auth-slice";
import showToast from "@/utils/toast";
import { Button, InputOtp } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
        
const TOKEN_SIZE = 6;

function Verify2FA({ secret, tokenCloudFlare }: { secret: string; tokenCloudFlare: string }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [token, setToken] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async () => {
        if (token?.length !== TOKEN_SIZE) return;

        try {
            setIsLoading(true);

            const { data } = await authApis.verify2FA({
                token,
                secret,
            });

            if (data?.status === 1) {
                setIsValid(data?.isValid);

                if (data?.isValid) {
                    dispatch(
                        login({
                          ...data?.userData,
                          permission: data?.permission,
                          role: data?.role,
                          accessToken: data?.accessToken,
                          refreshToken: data?.refreshToken,
                          "cf-turnstile-response": tokenCloudFlare,
                        })
                      );
          
                    showToast(`Xin chào. ${data?.userData?.name}!`, "success");
        
                    // Navigate to Dashboard
                    navigate(paths.dashboard);
                }
            }
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setIsLoading(false);
        }
    }

    const onKeyDown = (event: any) => {
        if (event.key === "Enter" && token?.length === TOKEN_SIZE) {
            onSubmit();
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-2 mt-8">
            <p className="text-base text-center">
                Nhập mã MFA từ ứng dụng của bạn bên dưới
            </p>

            <div className="flex items-center justify-center">
                <InputOtp
                    variant="bordered"
                    length={6}
                    value={token}
                    onValueChange={setToken}
                    isInvalid={isValid ? false : true}
                    errorMessage={isValid ? "" : "Mã MFA không đúng"}
                    onKeyDown={onKeyDown}
                />
            </div>

            <Button
                variant="solid"
                radius="sm"
                className={`text-light mt-2 text-lg font-medium ${
                        token?.length === 6 ? "bg-primary" : "bg-default-400"
                    } max-md:text-sm`
                }
                isDisabled={token?.length !== 6}
                isLoading={isLoading}
                onPress={onSubmit}
            >
              Xác nhận
            </Button>
        </div>
    );
}

export default Verify2FA;