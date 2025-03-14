import twoFAApis from "@/apis/2fa-api";
import { useAppDispatch } from "@/stores";
import { setSecret2FA } from "@/stores/slices/auth-slice";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, InputOtp, ModalFooter } from "@heroui/react";
import { useEffect, useState } from "react";

const TOKEN_SIZE = 6;

function Register2FA({ setTab }: any) {
    const dispatch = useAppDispatch();
    const [qrCode, setQrCode] = useState('');
    const [token, setToken] = useState('');
    const [secret, setSecret] = useState('');
    const [isValid, setIsValid] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateQrCode = async () => {
        try {
            const { data } = await twoFAApis.generate();

            if (data?.status === 1) {
                setQrCode(data?.qrCode);
                setSecret(data?.secret);
            }
        } catch (error: any) {
            console.log('error: ', error);
        }
    };

    useEffect(() => {
        generateQrCode();
    }, []);

    const onSubmit = async () => {
        if (token?.length !== TOKEN_SIZE) return;

        try {
            setIsLoading(true);

            const { data } = await twoFAApis.create({ token, secret });

            if (data?.status === 1) {
                setIsValid(data?.isValid);

                if (data?.isValid) {
                    setTab("qr-2fa");

                    showToast('Xác thực thiết bị nhận mã MFA thành công!', 'success');
                    
                    dispatch(
                        setSecret2FA(data?.secret)
                    );
                }
            }
        } catch (error) {
            showToast('Xác thực thiết bị nhận mã MFA thất bại!', 'error');

            console.log('error: ', error);
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
        <div className="">
            <h3 className="tracking-wide font-medium">
                Thiết lập thiết bị
            </h3>

            <p className="text-base mt-2">
                Thiết bị MFA ảo là ứng dụng chạy trên thiết bị của bạn mà bạn có thể cấu hình bằng cách quét mã QR.
            </p>

            <div className="flex flex-col gap-4 mt-5">
                <div className="flex gap-3 flex-wrap">
                    <div className="mt-1 flex items-center justify-center w-8 h-8 bg-slate-400 text-white rounded-full text-2xl font-bold">
                        1
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <p className="text-base">
                            Cài đặt ứng dụng tương thích Google Authenticator trên thiết bị di động hoặc máy tính của bạn.                        
                        </p>

                        <div className="flex flex-col gap-1 text-base">
                            <a 
                                href="https://apps.apple.com/us/app/google-authenticator/id388497605" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-4 text-blue-500 underline underline-offset-4"
                            >
                                IOS: Google Authenticator
                            </a>

                            <a 
                                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=vi" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-4 text-blue-500 underline underline-offset-4"
                            >
                                Android: Google Authenticator
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <div className="mt-1 flex items-center justify-center w-8 h-8 bg-slate-400 text-white rounded-full text-2xl font-bold">
                        2
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <p className="text-base">
                            Mở ứng dụng xác thực của bạn, chọn Hiển thị mã QR trên trang này, sau đó sử dụng ứng dụng để quét mã.
                        </p>

                        <img
                            alt="QR-Code"
                            src={qrCode}
                            className="min-w-max min-h-max w-max h-max"
                        />
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <div className="mt-1 flex items-center justify-center w-8 h-8 bg-slate-400 text-white rounded-full text-2xl font-bold">
                        3
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <p className="text-base">
                            Nhập mã MFA từ ứng dụng của bạn bên dưới
                        </p>

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
                </div>
            </div>

            <ModalFooter className="px-2 sticky bottom-0 border-t gap-4 bg-white mt-5">
                <Button
                    variant="solid"
                    color="danger"
                    className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                    onPress={() => dispatch(resetModal())}>
                    Hủy
                </Button>
                <Button
                    variant="solid"
                    className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                    isLoading={isLoading}
                    onPress={onSubmit}>
                    Xác nhận
                </Button>
            </ModalFooter>
        </div>
    );
}

export default Register2FA;