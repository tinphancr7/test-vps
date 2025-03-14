import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Suspense, useState } from "react";
import { Button, Input } from "@heroui/react";
import authApis from "@/apis/auth-apis";
import { useNavigate } from "react-router-dom";
import LazyLoadingPage from "@/components/lazy-loading-page";
import showToast from "@/utils/toast";
import useForm from "@/hooks/use-form";
import { login } from "@/stores/slices/auth-slice";
import paths from "@/routes/paths";
import { useAppDispatch } from "@/stores";
import Turnstile, { useTurnstile } from "react-turnstile";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import Verify2FA from "./verify-2fa";

const initialFormState = {
  username: {
    label: "Tên đăng nhập",
    type: "text",
    isRequire: true,
    errorMessage: "",
    value: "",
  },
  password: {
    label: "Mật khẩu",
    type: "password",
    isRequire: true,
    errorMessage: "",
    value: "",
  },
};

function SignIn() {
  const { getData } = useVisitorData({
    extendedResult: true,
    ignoreCache: false,
  });

  const turnstile = useTurnstile();
  const [tokenCloudFlare, setTokenCloudFlare] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isEmptyValues, getValues, getState, setType, setValue } =
    useForm(initialFormState);

  const [secret2FA, setSecret2FA] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleValueChange = (key: string, value: any) => {
    setValue(key, value);
    // setErrorMessage(key, value && "");
  };

  const handleTypeInputChange = (key: string, type: string) => {
    setType(key, type === "text" ? "password" : "text");
  };

  const renderEndContent = (key: string, type: string) => {
    if (key === "password") {
      return (
        <span
          className="cursor-pointer"
          onClick={() => handleTypeInputChange(key, type)}>
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
    if (!tokenCloudFlare) {
      showToast("Vui lòng xác thực CAPCHA!", "error");
      return;
    }

    const userData = { ...getValues() };

    getData({ linkedId: userData.username.value || "" })
      .then(async (fingerPrint) => {
        try {
          setIsLoading(true);

          const payload: any = {
            ...getValues(),
            "cf-turnstile-response": tokenCloudFlare,
            fingerPrintBrowser: {
              visitorId: fingerPrint?.visitorId,
              requestId: fingerPrint?.requestId,
            },
          };

          const { data } = await authApis.signIn(payload);

          if (data?.status === 1) {
            if (data?.secret) {
              setSecret2FA(data?.secret);
            } else {
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
        } catch (error: any) {
          turnstile.reset();
          setTokenCloudFlare("");
          console.log("error: ", error);

          if (error?.response?.data?.status === 9) {
            return showToast(
              "Tên Đăng Nhập Hoặc Mật Khẩu Không Đúng!",
              "error"
            );
          } else if (error?.response?.data?.status === 36) {
            return showToast("Bạn Không thể đăng nhập lúc này!", "error");
          } else if (error?.response?.data?.status === 38) {
            showToast("Vui lòng xác thực CAPCHA!", "error");
          } else if (error?.response?.data?.status === 39) {
            showToast(
              "CAPCHA không hợp lệ hoặc đã hết hạn vui lòng tải lại trang và thử lại!",
              "error"
            );
          } else if (error?.response?.data?.status === 40) {
            showToast(
              "Địa chỉ IP của bạn không được phép, vui lòng liên hệ admin!",
              "error"
            );
          } else {
            return showToast(`Đăng nhập thất bại!`, "error");
          }
        } finally {
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        console.log("error: ", error);
        setTokenCloudFlare("");
        turnstile.reset();
        showToast("Vui lòng tắt trình chặn quảng cáo!", "error");
      });
  };

  return (
    <Suspense fallback={<LazyLoadingPage />}>
      <div className="px-[20%] py-[20%] max-md:px-[10%] max-md:py-[10%] h-full flex flex-col justify-center">
        <h1 className="max-md:text-2xl pl-6 font-medium text-5xl leading-tight relative after:absolute after:left-0 after:top-0 after:bottom-0 after:w-2 after:bg-primary after:rounded-full">
          Đăng nhập
        </h1>

        {!secret2FA ? (
          <>
            <div className="flex flex-col gap-2 mt-6">
              {Object.keys(initialFormState).map((key, index) => (
                <Input
                  key={index}
                  radius="sm"
                  color="primary"
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper:
                      "h-12 data-[hover=true]:border-primary border border-slate-400",
                    label: "text-dark font-medium",
                  }}
                  type={getState(key).type}
                  label={getState(key).label}
                  value={getState(key).value}
                  onValueChange={(value) => handleValueChange(key, value)}
                  endContent={renderEndContent(key, getState(key).type as string)}
                  errorMessage={getState(key).errorMessage}
                  isInvalid={!!getState(key).errorMessage}
                  onKeyDown={(event) => event.key === "Enter" && onSubmit()}
                />
              ))}
            </div>

            <Turnstile
              sitekey={import.meta.env.VITE_SITE_KEY_CLOUD_FLARE_TURNSTILE || ""}
              onVerify={(token) => {
                setTokenCloudFlare(token);
              }}
              className="pt-3"
              retry="auto"
              refreshExpired="never"
              appearance="always"
              size="normal"
              language={"vi"}
            />

            <Button
              variant="solid"
              radius="sm"
              className={`text-light mt-6 text-lg font-medium ${
                isEmptyValues ? "bg-default-400" : "bg-primary"
              } max-md:text-sm`}
              isDisabled={isEmptyValues}
              isLoading={isLoading}
              onPress={onSubmit}>
              Đăng nhập
            </Button>
          </>
        ) : (
          <Verify2FA secret={secret2FA} tokenCloudFlare={tokenCloudFlare} />
        )}
      </div>
    </Suspense>
  );
}

export default SignIn;
