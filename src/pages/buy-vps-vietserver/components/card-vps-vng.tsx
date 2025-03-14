import Container from "@/components/container";
import paths from "@/routes/paths";
import { formatPrice } from "@/utils/format-price";
import { parseDesVpsVng } from "@/utils/parse-desc-vps-vng";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { Button } from "@heroui/react";
import { useMemo } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CardVpsVng({ vps }: any) {
  const navigate = useNavigate();

  const handleInitVps = () => {
    navigate(`${paths.vps_vietserver}/${vps?._id}`);
  };

  const prodInfo = useMemo(() => {
    return parseDesVpsVng(vps?.description);
  }, [vps]);
  const priceVAT: any = (vps?.m * 0.1).toFixed(2);
  const price: any = vps?.m;

  return (
    <Container className="col-span-3 rounded-xl !p-0">
      <div className="flex flex-col gap-2">
        <div className="pt-t pb-2 px-2 flex flex-col gap-2 rounded-tl-xl rounded-tr-xl">
          <h2 className="text-2xl font-extrabold tracking-wide uppercase text-left text-primary">
            {vps?.name}
          </h2>

          <div className="mt-1 before:block before:absolute before:-inset-1 before:-skew-y-6 before:bg-primary relative inline-block float-right">
            <div className="text-2xl font-bold tracking-wide text-right text-white -rotate-6">
              <b className="relative">
                {formatPrice(
                  convertVnToUsd(priceVAT, "VietServer") +
                    convertVnToUsd(price, "VietServer")
                )}
                <span className="absolute top-0 -right-3 text-base">$</span>
              </b>

              <span className="ml-4 font-normal">/</span>

              <span className="text-sm text-white">tháng</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-1 p-2">
          {/* CPU */}
          <div className="col-span-6 font-semibold text-lg text-gray-600 text-right tracking-wide">
            CPU:
          </div>
          <div className="col-span-6 font-bold text-gray-500 tracking-wide">
            {prodInfo?.CPU}
          </div>

          {/* RAM */}
          <div className="col-span-6 font-semibold text-lg text-gray-600 text-right tracking-wide">
            Ram:
          </div>
          <div className="col-span-6 font-bold text-gray-500 tracking-wide">
            {prodInfo?.Ram}
          </div>

          {/* STORAGE */}
          <div className="col-span-6 font-semibold text-lg text-gray-600 text-right tracking-wide">
            Storage:
          </div>
          <div className="col-span-6 font-bold text-gray-500 tracking-wide">
            {prodInfo?.Storage}
          </div>

          {/* IPV4 */}
          <div className="col-span-6 font-semibold text-lg text-gray-600 text-right tracking-wide">
            IPV4:
          </div>
          <div className="col-span-6 font-bold text-gray-500 tracking-wide">
            1
          </div>

          {/* TRANSFER */}
          <div className="col-span-6 font-semibold text-lg text-gray-600 text-right tracking-wide">
            Transfer:
          </div>
          <div className="col-span-6 font-bold text-gray-500 tracking-wide">
            {prodInfo["Data Transfer"]}
          </div>
        </div>

        <Button
          fullWidth
          color="primary"
          className="border-t border-primary pr-2 rounded-none rounded-bl-xl rounded-br-xl uppercase font-bold bg-[#ff990026] flex gap-2 text-primary"
          onPress={handleInitVps}
        >
          <AiOutlineShoppingCart className="w-6 h-6" />
          Thiết lập ngay
        </Button>
      </div>
    </Container>
  );
}

export default CardVpsVng;
