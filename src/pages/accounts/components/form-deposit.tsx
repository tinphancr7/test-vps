import { useAppDispatch } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";
import { Button, ModalFooter, Skeleton, Tab, Tabs } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import QrCodeDeposit from "./qr-code-deposit";
import accountApi from "@/apis/account.api";
import showToast from "@/utils/toast";
import { VietQR } from "vietqr";
import {
  ACCOUNT_NUMBER_VIETSTACK,
  ACCOUNT_NUMBER_VNG,
  BIN_BANK_VIETSTACK,
  BIN_BANK_VNG,
  FULL_NAME_VIETSTACK,
  FULL_NAME_VNG,
  ACCOUNT_NUMBER_BUCLOUD,
  FULL_NAME_BUCLOUD,
  BIN_BANK_BUCLOUD,
  ACCOUNT_NUMBER_VIETSERVER,
  FULL_NAME_VIETSERVER,
  BIN_BANK_VIETSERVER,
} from "@/configs/banks";
import { ProviderIDEnum } from "@/constants/enum";
import { TbFaceIdError } from "react-icons/tb";
import DepositUSDT from "./deposit-usdt";

function FormDeposit({ account }: any) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [qrBase64, setQrBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [isError, setIsError] = useState<string>("");
  const createApiVietQr = useCallback(async () => {
    try {
      setIsLoading(true);

      const vietQR = new VietQR({
        clientID: "b7593553-cde2-4b99-9341-05aed3538c24",
        apiKey: "feb83472-e407-429f-a69a-395302f47832",
      });

      let account_number;
      let provider_vps;
      let full_name;
      let bin_bank;

      const n1 = Math.floor(Math.random() * 10);
      const n2 = Math.floor(Math.random() * 10);

      if (account?.provider?._id === ProviderIDEnum.VNG) {
        account_number = ACCOUNT_NUMBER_VNG;
        provider_vps = "VNG";
        full_name = FULL_NAME_VNG;
        bin_bank = BIN_BANK_VNG;
      }

      if (account?.provider?._id === ProviderIDEnum.VIET_STACK) {
        account_number = ACCOUNT_NUMBER_VIETSTACK;
        provider_vps = "VST";
        full_name = FULL_NAME_VIETSTACK;
        bin_bank = BIN_BANK_VIETSTACK;
      }

      if (account?.provider?._id === ProviderIDEnum.BuCloud) {
        account_number = ACCOUNT_NUMBER_BUCLOUD;
        provider_vps = "BC";
        full_name = FULL_NAME_BUCLOUD;
        bin_bank = BIN_BANK_BUCLOUD;
      }

      if (account?.provider?._id === ProviderIDEnum.VietServer) {
        account_number = ACCOUNT_NUMBER_VIETSERVER;
        provider_vps = "VS";
        full_name = FULL_NAME_VIETSERVER;
        bin_bank = BIN_BANK_VIETSERVER;
      }

      const transferContent = `NAP ${provider_vps}${n1}${n2}0${account?.client_id}`;
      console.log(bin_bank, full_name, account_number, transferContent);
      setContent({
        bin_bank,
        account_number,
        full_name,
        transferContent,
      });
      const { data } = await vietQR.genQRCodeBase64({
        bank: bin_bank,
        accountName: full_name,
        accountNumber: account_number,
        memo: transferContent,
        template: "compact", // qr_only
      });

      if (data?.code === "00") {
        setVisible(true);
        setQrBase64(data?.data?.qrDataURL);
      }

      if (data?.code === "24") {
        setIsError(data?.desc);
      }

      if (data?.code === "11") {
        setIsError("Nhà cung cấp này chưa có số tài khoản!");
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const handleConfirmDeposit = async () => {
    try {
      setIsSubmitting(true);

      const { data } = await accountApi.confirmDeposit({
        client_id: account?.client_id,
        amount: 0,
      });

      if (data?.status === 1) {
        showToast("Nạp tiền thành công!", "success");
        dispatch(resetModal());
      }
    } catch (error) {
      console.log("error: ", error);
      showToast("Nạp tiền thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    createApiVietQr();
  }, [account]);

  const listAccountAccept: any = [
    ProviderIDEnum.VNG, //vng
    ProviderIDEnum.VIET_STACK, //vietstack
    ProviderIDEnum.BuCloud, // bucloud
  ];

  const checkShowTabUSDT = (providerId: string) => {
    if (listAccountAccept.includes(providerId)) {
      return true;
    }
    return false;
  };
  return (
    <Tabs aria-label="Options">
      <Tab key="bank" title="Thanh toán bằng QR Code">
        <div className="h-full relative flex flex-col justify-between overflow-y-auto overflow-x-hidden">
          {visible && !isError && (
            <div className="flex flex-col gap-4">
              <QrCodeDeposit
                isLoading={isLoading}
                qrBase64={qrBase64}
                content={content}
              />
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col gap-3 h-full w-full justify-center items-center">
              <Skeleton className="rounded h-[45%]  aspect-square "></Skeleton>
              <Skeleton className="rounded h-6 w-[75%] "></Skeleton>
              <Skeleton className="rounded h-6 w-[72.5%] "></Skeleton>
              <Skeleton className="rounded h-6 w-[70%] "></Skeleton>
            </div>
          )}
          {isError && (
            <div className="w-full h-full flex justify-center items-center gap-2 flex-col">
              <TbFaceIdError size={50} color="orange" />
              <p className="w-full py-4 text-lg font-medium text-center">
                {isError}
              </p>
            </div>
          )}
          <ModalFooter className="px-0">
            <Button
              variant="solid"
              color="danger"
              className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
              onPress={() => dispatch(resetModal())}
            >
              Hủy
            </Button>
            {visible && (
              <Button
                variant="solid"
                className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                isLoading={isSubmitting}
                onPress={handleConfirmDeposit}
              >
                Xác nhận
              </Button>
            )}
          </ModalFooter>
        </div>
      </Tab>
      {checkShowTabUSDT(account.provider._id) && (
        <Tab key="usdt" title="Thanh toán bằng USDT">
          <DepositUSDT account={account} />
        </Tab>
      )}
    </Tabs>
  );
}

export default FormDeposit;
