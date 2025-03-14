import transactionApis from "@/apis/transaction.api";
import { useAppDispatch } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, ModalFooter, Spinner } from "@heroui/react";
import moment from "moment";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { GiMoneyStack } from "react-icons/gi";
import { IoWarningOutline } from "react-icons/io5";

function DepositUSDT({ account }: any) {
  const dispatch = useAppDispatch();
  const [walletAddress, setWalletAddress] = useState("");
  const [infoOrder, setInfoOrder] = useState<any>(null);

  console.log(infoOrder);

  const createWalletCrypto = async () => {
    const { data } = await transactionApis.createWalletCrypto({
      ...account,
      type: "tron",
    });
    if (!data.status) {
      showToast("Lỗi khi tạo ví", "error");
      return;
    }
    setWalletAddress(data.data.address);
  };
  const getOrderAddFund = async () => {
    const { data } = await transactionApis.getOrderAddFund(account);
    if (!data.status) {
      showToast("Lỗi khi tạo order", "error");
      return;
    }
    setInfoOrder(data.data.data);
  };
  useEffect(() => {
    createWalletCrypto();
    getOrderAddFund();
  }, []);

  // const dataWallet = useMemo(() => {
  //   if (account.provider._id === ProviderIDEnum.BuCloud) {
  //     return {
  //       img: "/imgs/wallet-binance-trc-bucloud.jpg",
  //       address: "TB9CvHXXBRhMLvZAHmuaqY9UX4QKMbDDxj",
  //     };
  //   }
  //   if (account.provider._id === ProviderIDEnum.VNG) {
  //     return {
  //       img: "/imgs/wallet-binance-trc-vng.jpg",
  //       address: "TNV7nD3TXY2oEAi7zCnfZfPsk67Go67ZCo",
  //     };
  //   }
  //   if (account.provider._id === ProviderIDEnum.VIET_STACK) {
  //     return {
  //       img: "/imgs/wallet-binance-trc-vst.jpg",
  //       address: "TYdhvSzEipm3PLsSWXmGqvL9yJh24bQrvz",
  //     };
  //   }
  // }, [account]);

  // const disableBtn = transactionHash === "" ? true : false;
  // const handleCheckTransaction = async () => {
  //   setIsLoading(true);
  //   const { data: result } = await transactionApis.addFundUSDT({
  //     transactionHash,
  //     ...account,
  //   });
  //   setIsLoading(false);

  //   if (!result?.status) {
  //     if (result.message === "transaction_not_found") {
  //       showToast("Không tìm thấy giao dịch", "error");
  //       return;
  //     }
  //     if (result.message === "transaction_existed") {
  //       showToast("Giao dịch đã được thực hiện", "error");
  //       return;
  //     }
  //     showToast("Lỗi khi yêu cầu dịch vụ", "error");
  //     return;
  //   }
  //   showToast("Kiểm tra giao dịch thành công", "success");
  //   setTransactionHash("");
  //   resetModal();
  // };

  return (
    <div>
      <p className="flex gap-4">
        <GiMoneyStack className="my-auto text-green-500 text-[40px] " />
        Quý khách sẽ được khuyến mãi thêm 10% giá trị nạp khi thực hiện thanh
        toán bằng USDT.
      </p>
      <p className="mb-2 text-xl font-semibold"></p>
      <div className="rounded-lg border p-6 shadow-md lg:p-10">
        <div className="flex w-full flex-col items-center justify-center gap-6 overflow-y-auto ">
          {/* QR Code Image */}
          {/* <Image src={dataWallet?.img} /> */}
          {walletAddress === "" ? (
            <Spinner />
          ) : (
            <>
              <QRCodeSVG
                id="qrcode"
                value={walletAddress}
                size={290}
                level={"H"}
              />
              <div className="text-center">
                <p>
                  <strong> Tron (TRC20)</strong>
                </p>
                <p>{walletAddress}</p>
              </div>
            </>
          )}
          <div className="flex w-full justify-start border-t pt-2">
            <div className="flex w-full flex-col items-center justify-center gap-1 text-base sm:items-start">
              <div className="mb-5 flex flex-col items-center gap-2 sm:items-start">
                <div>
                  <p>
                    Vui lòng chọn mạng lưới <strong> Tron (TRC20)</strong>
                  </p>
                  <p>
                    Địa chỉ ví: <strong> {walletAddress}</strong>
                  </p>
                  <p>
                    ID Payment: <strong>{account?.client_id}</strong>
                  </p>
                  <p>Mã hóa đơn: {infoOrder?.orderId}</p>
                  <p>
                    Thời gian hết hạn:{" "}
                    {moment(infoOrder?.timeExpiredOrder).format(
                      "DD-MM-YYYY HH:mm:ss"
                    )}
                  </p>
                </div>
                <div>
                  <div className="mb-6">
                    <p className="flex gap-2 font-bold text-red-500">
                      <IoWarningOutline className="my-auto" />
                      Lưu ý:
                    </p>
                    <p>
                      - Hãy đảm bảo chọn mạng lưới <strong>Tron (TRC20)</strong>
                      . Bạn có khả năng mất các tài sản của mình nếu sai mạng
                      lưới.
                    </p>
                  </div>
                  {/* <div>
                    <Input
                      className="mb-4 h-8 text-base disabled:cursor-text disabled:bg-white disabled:text-gray-700"
                      placeholder="Nhập mã giao dịch"
                      variant="bordered"
                      value={transactionHash}
                      onValueChange={setTransactionHash}
                    />
                    <Button
                      isLoading={isLoading}
                      variant="solid"
                      isDisabled={disableBtn}
                      className="bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm"
                      onPress={() => {
                        handleCheckTransaction();
                      }}
                    >
                      Xác nhận
                    </Button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter className="px-0">
          <Button
            variant="solid"
            color="danger"
            className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
            onPress={() => dispatch(resetModal())}
          >
            Đóng
          </Button>
        </ModalFooter>
      </div>
    </div>
  );
}

export default DepositUSDT;
