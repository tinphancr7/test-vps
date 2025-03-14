import { Button, Image, Spinner } from "@heroui/react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineCopy } from "react-icons/ai";
interface QrCodeDepositProps {
  isLoading: boolean;
  qrBase64: string;
  content: any;
}

function QrCodeDeposit({ isLoading, qrBase64, content }: QrCodeDepositProps) {
  const [copied, setCopied] = useState<string | null>(null);
  console.log(content);

  const data = Object.keys(content).map((item: any) => {
    if (item === "bin_bank") {
      if (content[item] === 970422) {
        return {
          key: "bank",
          value: "MB Bank",
        };
      }
      if (content[item] === 970418) {
        return {
          key: "bank",
          value: "BIDV",
        };
      }
      return {
        key: "bank",
        value: "ACB",
      };
    }
    return {
      key: item,
      value: content[item],
    };
  });
  const labelMapping: any = {
    account_number: "Số tài khoản",
    full_name: "Chủ tài khoản",
    bank: "Ngân Hàng",
    transferContent: "Nội dung chuyển khoản",
    amount: "Số tiền",
  };
  const handleCopy = (text: any) => {
    navigator.clipboard.writeText(text);
    setCopied(text);

    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyBankInfo = () => {
    setCopied("all");

    const bankInfoValues = data.map((it) => it?.value);

    navigator.clipboard.writeText(bankInfoValues?.join("\n"));

    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex justify-center mt-4 ">
      {isLoading ? (
        <div className="h-[540px] flex justify-center items-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <div>
          <Image
            radius="sm"
            alt="QR-Code"
            src={qrBase64}
            loading="eager"
            classNames={{
              wrapper: "max-w-xs max-h-[540px]",
              img: "w-full h-full object-cover",
            }}
          />
          <div className="text-center">
            {data.map((item) => {
              const isCopied = copied === item.value;

              return (
                <div className="flex justify-center gap-2">
                  <p>
                    {labelMapping[item.key]}: <b>{item.value}</b>
                  </p>
                  {isCopied ? (
                    <FaCheck className=" text-green-500 my-auto" />
                  ) : (
                    <AiOutlineCopy
                      className="opacity-60 hover:cursor-pointer my-auto"
                      onClick={() => handleCopy(item.value)}
                    />
                  )}
                </div>
              );
            })}

            <div className="flex justify-center items-center mt-2">
              <Button
                variant="solid"
                className={`bg-primaryDf text-light rounded-md text-base font-medium h-8 max-md:text-sm`}
                onPress={handleCopyBankInfo}
                startContent={
                  copied === "all" ? (
                    <FaCheck className=" text-green-500 my-auto" />
                  ) : (
                    <AiOutlineCopy className="hover:cursor-pointer my-auto" />
                  )
                }
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QrCodeDeposit;
