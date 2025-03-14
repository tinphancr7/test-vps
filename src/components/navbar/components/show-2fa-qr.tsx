// import twoFAApis from "@/apis/2fa-api";
import authApis from "@/apis/auth-apis";
import { useAppDispatch } from "@/stores";
import { setSecret2FA } from "@/stores/slices/auth-slice";
import showToast from "@/utils/toast";
import { Button, InputOtp } from "@heroui/react";
import { useState } from "react";

const TOKEN_SIZE = 6;

function Show2FAQR() {
    const dispatch = useAppDispatch();
    const [token, setToken] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    /*
        const [qrCode, setQrCode] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const { data } = await twoFAApis.getQrCode();

                if (data?.status === 1) {
                    setQrCode(data?.qrCode);
                }
            } catch (error: any) {
                console.log('error: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
        }, []);
    */

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const { data } = await authApis.disable2FA(token);

            if (data?.status === 1) {
                if (data?.isValid) {
                    showToast("Tắt xác thực 2 bước thành công", "success");
                    dispatch(setSecret2FA(""));
                }

                setIsValid(data?.isValid);
            }
        } catch (error) {
            console.log("error: ", error);
            showToast("Tắt xác thực 2 bước không thành công", "success");
        } finally {
            setIsLoading(false);
        }
    };

    const onKeyDown = (event: any) => {
        if (event.key === "Enter" && token?.length === TOKEN_SIZE) {
            onSubmit();
        }
    };

    return (
        <div>
            <div className="flex-1 flex flex-col gap-2">
                <p className="text-base text-center">
                    Nhập mã MFA từ ứng dụng của bạn để tắt xác thực 2 lớp.
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
                        token?.length === TOKEN_SIZE ? "bg-primary" : "bg-default-400"
                    } max-md:text-sm`}
                    isDisabled={token?.length !== TOKEN_SIZE}
                    isLoading={isLoading}
                    onPress={onSubmit}
                >
                    Xác nhận
                </Button>
            </div>
        </div>
    );

    /*
    return (  
        <div className="p-0">
            <div className="flex-1 flex flex-col gap-2">
                <p className="text-base">
                    Cài đặt ứng dụng tương thích Google Authenticator trên thiết bị di động hoặc máy tính của bạn.                        
                </p>

                <div className="flex flex-col gap-1 text-base">
                    <a 
                        href="https://apps.apple.com/us/app/google-authenticator/id388497605" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 underline underline-offset-4"
                    >
                        IOS: Google Authenticator
                    </a>

                    <a 
                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=vi" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 underline underline-offset-4"
                    >
                        Android: Google Authenticator
                    </a>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-44">
                    <CircularProgress size="lg" color="primary" />
                </div>
            ) : (
                <div className="flex-1 flex justify-center gap-2 mt-5">
                    <img
                        alt="QR-Code"
                        src={qrCode}
                        className="min-w-max min-h-max w-max h-max"
                    />
                </div>
            )}
        </div>
    );
    */
}

export default Show2FAQR;
