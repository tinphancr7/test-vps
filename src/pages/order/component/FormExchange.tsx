import orderApis from "@/apis/order.api";
import { useAppDispatch } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, Input, ModalFooter } from "@heroui/react";
import { useEffect, useState } from "react";

const formatPriceVND = (input: string) => {
  console.log(input);
  // Remove any non-numeric characters
  input = input.replace(/\D/g, "");

  // Remove leading zeros
  input = input.replace(/^0+/, "");

  // Add commas every 3 digits for thousands separator
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const removeCommas = (input: string) => {
  return input.replace(/,/g, ""); // Loại bỏ tất cả dấu phẩy
};
function FormExchange() {
  const dispatch = useAppDispatch();
  const [exchange, setExchange] = useState("0");
  const [loading, setLoading] = useState(false);

  const getExchangeRate = async () => {
    const { data: result } = await orderApis.getExchange();
    setExchange(formatPriceVND(String(result?.ex_price)));
  };

  const updateExchangeRate = async () => {
    setLoading(true);
    const { data: result } = await orderApis.updateExchange(removeCommas(exchange));
    setLoading(false);
    if (!result?.status) {
      showToast("Cập nhật tỉ giá không thành công", "error");
      return;
    }
    showToast("Cập nhật tỉ giá thành công", "success");
    dispatch(resetModal());
  };

  useEffect(() => {
    getExchangeRate();
  }, []);

  const handleValueChange = (value: any) => {
    const payload = formatPriceVND(value);
    console.log(payload);
    setExchange(payload);
  };
  return (
    <>
      <Input
        label="Tỉ giá (VND)"
        labelPlacement="outside"
        placeholder=" "
        value={exchange}
        onValueChange={handleValueChange}
      />
      <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
        <Button
          variant="solid"
          color="danger"
          className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
          onPress={() => dispatch(resetModal())}
        >
          Đóng
        </Button>

        <Button
          variant="solid"
          className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
          isLoading={loading}
          onPress={updateExchangeRate}
          isDisabled={exchange === "" ? true : false}
        >
          Xác nhận
        </Button>
      </ModalFooter>
    </>
  );
}

export default FormExchange;
