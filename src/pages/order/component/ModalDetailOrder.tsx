import TableControl from "@/components/table-control";
import { formatPriceUsd } from "@/utils/format-price-usd";
import {
  Button,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  Spinner,
} from "@heroui/react";
import moment from "moment";
import { useCallback, useMemo } from "react";
import { API_URL } from "@/configs/apis";
import { ProviderIDEnum } from "@/constants/enum";
import ExportExcelOrder from "./ExportExcelOrder";
import RenewVPS from "./RenewVPS";
import { useAppDispatch, useAppSelector } from "@/stores";
import { getListOrder, setResponseAction } from "@/stores/slices/order.slice";
import ButtonDeleteVPS from "./ButtonDeleteVPS";
function ModalDetailOrder({
  itemOrder,
  isOpenModalDetail,
  onOpenChangeDetail,
  setOrderDetail,
}: any) {
  const dispatch = useAppDispatch();
  const convertVnToUsd = (price: number, type?: string) => {
    let calculator = price / 26000;
    if (type === "bu_cloud") {
      calculator = price / 25500;
    }
    return calculator;
  };
  const { isLoadingActionOrder, responseAction, querySearch } = useAppSelector(
    (state) => state.order,
  );
  const convertMoneyVAT = (value: any, type?: string) => {
    const total: any = convertVnToUsd(value, type);
    const VAT: any = convertVnToUsd(value * 0.1, type);
    const another: any = convertVnToUsd(value * 1.1, type);
    const totalReturn = total + VAT;
    const VAT_n = Math.floor(VAT * 100) / 100;
    const total_n = Math.floor(total.toFixed(2) * 100) / 100;
    const totalReturn_n = Math.floor(totalReturn * 100) / 100;

    return {
      total: formatPriceUsd(total),
      VAT: formatPriceUsd(VAT),
      totalReturn: totalReturn,
      another,
      totalReturn_n: formatPriceUsd(totalReturn_n),
      totalReturn_n_w: totalReturn_n,
      VAT_n: formatPriceUsd(VAT_n),
      total_n: formatPriceUsd(total_n),
      total_n_w: total_n,
    };
  };

  const totalAmount = useMemo(() => {
    let type = "VNG";
    if (itemOrder?.orderProviderId?._id === ProviderIDEnum.BuCloud) {
      type = "bu_cloud";
    }
    return itemOrder?.orderProduct?.reduce((curr: any, item: any) => {
      const totalReturn = convertMoneyVAT(item?.price, type).totalReturn;
      curr += Math.floor(totalReturn * 100) / 100;
      return curr;
    }, 0);
  }, [itemOrder]);

  const disableDelete = useMemo(() => {
    if (itemOrder?.orderProduct.length === 1) {
      return true;
    }
    return false;
  }, [itemOrder]);
  const columns = [
    { _id: "name", name: "Tên dịch vụ" },
    {
      _id: "invoicePrice",
      name: "Giá",
    },
    { _id: "vatPrice", name: "VAT(10%)" },
    { _id: "sumPrice", name: "Tổng" },
  ];

  if (itemOrder?.orderStatusReview === "new" && itemOrder?.orderService === "renew_vps") {
    console.log(itemOrder?.orderStatusReview);
    columns.push({ _id: "action", name: "Hành động" });
  }
  const addColums = [{ _id: "expires", name: "Ngày hết hạn" }];

  const position = columns.findIndex((col) => col._id === "sumPrice");
  if (itemOrder?.orderService === "renew_vps") {
    columns.splice(position, 0, ...addColums);
  }

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div className="font-bold text-blue-500 text-left">
            <p>{item?.productName}</p>
            {item?.ip === "" || !item?.ip ? (
              <p>
                CPU: {item?.cpu} | Ram: {item?.ram} | Storage: {item?.storage}
              </p>
            ) : (
              <Snippet
                tooltipProps={{
                  content: "Sao chép địa chỉ IP",
                  disableAnimation: true,
                  placement: "bottom",
                  closeDelay: 0,
                }}
                className="!p-0 !bg-transparent"
                symbol=""
              >
                {item.ip}
              </Snippet>
            )}
          </div>
        );
      case "vatPrice": {
        let type = "VNG";
        if (itemOrder?.orderProviderId?._id === ProviderIDEnum.BuCloud) {
          type = "bu_cloud";
        }
        return <p className="font-bold">{convertMoneyVAT(item?.price, type).VAT_n}</p>;
      }

      case "invoicePrice": {
        let type = "VNG";
        if (itemOrder?.orderProviderId?._id === ProviderIDEnum.BuCloud) {
          type = "bu_cloud";
        }
        return <p className="font-bold">{convertMoneyVAT(item?.price, type).total}</p>;
      }

      case "sumPrice": {
        let type = "VNG";
        if (itemOrder?.orderProviderId?._id === ProviderIDEnum.BuCloud) {
          type = "bu_cloud";
        }
        return <p className="font-bold">{convertMoneyVAT(item?.price, type).totalReturn_n}</p>;
      }
      case "action": {
        return (
          <ButtonDeleteVPS
            itemVPS={item}
            _idOrder={itemOrder?._id}
            setOrderDetail={setOrderDetail}
            isDisable={disableDelete}
          />
        );
      }

      case "expires": {
        const now = moment();
        const expiryDate = moment(item?.expires);
        const duration = moment.duration(expiryDate.diff(now));

        // Tính tổng số ngày giữa hai thời điểm
        const totalDays = Math.floor(duration.asDays());

        // Tính số giờ còn lại sau khi đã tính số ngày
        const remainingHours = duration.subtract(totalDays, "days").hours();
        return (
          <div className="flex flex-col items-center gap-1 min-w-48">
            <b className="tracking-wide text-danger">
              {moment(item?.expires).format("DD/MM/YYYY")}
            </b>
            <div className="flex justify-center gap-2">
              <span>Còn lại:</span>
              <b className="text-blue-400">
                {totalDays} ngày {remainingHours} giờ
              </b>
            </div>
          </div>
        );
      }

      default:
        return cellValue;
    }
  };
  const columnsRenew = [
    { _id: "name", name: "Tên dịch vụ" },
    {
      _id: "status",
      name: "Tình trạng",
    },

    // { _id: "invoiceLink", name: "Hóa đơn" },
  ];
  const status = (value: string) => {
    switch (value) {
      case "balance_not_enough":
        return (
          <div className="text-center">
            <p className="text-red-500">Lỗi</p>
            <p>Không đủ tiền để gia hạn dịch vụ</p>
          </div>
        );

      case "renewal_cloud_successfully":
        return (
          <div className="text-center">
            <p className="text-success-500 font-bold">Thành công</p>
            <p>Gia hạn dịch vụ thành công</p>
          </div>
        );
      case "Create Vps Success!":
        return (
          <div className="text-center">
            <p className="text-success-500 font-bold">Thành công</p>
            <p>Mua mới thành công</p>
          </div>
        );
      default: {
        let mess = "Dịch vụ gia hạn không thành công";
        if (itemOrder?.orderService === "buy_vps") {
          mess = "Mua mới không thành công";
        }
        return (
          <div className="text-center">
            <p className="text-red-500">Lỗi</p>
            <p>{mess}</p>
          </div>
        );
      }
    }
  };
  const renderCellRenew = useCallback(
    (item: any, columnKey: string) => {
      switch (columnKey) {
        case "name": {
          if (itemOrder?.orderService === "buy_vps") {
            return (
              <div className="font-bold text-blue-500 text-left">
                <p>{item?.product?.productName}</p>
                <p>
                  CPU: {item?.product?.cpu} | Ram: {item?.product?.ram} | Storage:{" "}
                  {item?.product?.storage}
                </p>
              </div>
            );
          }
          return (
            <div className="font-bold text-blue-500 text-left">
              <p>{item?.itemData?.vps_id?.product_name}</p>
              <p>IP: {item?.itemData?.vps_id?.ip}</p>
            </div>
          );
        }

        case "status": {
          if (itemOrder?.orderService === "buy_vps") {
            return status(item?.message);
          }
          return status(item?.message);
        }
        default:
          return <></>;
      }
    },
    [responseAction?.data],
  );
  const resetOrderDetail = () => {
    dispatch(setResponseAction({}));
    dispatch(getListOrder(querySearch));
  };
  const renderTotalAmount = () => {
    let type = "VNG";
    if (itemOrder?.orderProviderId?._id === ProviderIDEnum.BuCloud) {
      type = "bu_cloud";
    }
    if (itemOrder?.orderService === "buy_vps") {
      if (itemOrder?.orderBankName.includes("USDT")) {
        return formatPriceUsd(
          convertMoneyVAT(itemOrder.orderProduct[0].price, type).total_n_w *
            itemOrder.orderProductQuanlity,
        );
      }
      return formatPriceUsd(
        convertMoneyVAT(itemOrder.orderProduct[0].price, type).totalReturn_n_w *
          itemOrder.orderProductQuanlity,
      );
    }
    if (itemOrder?.orderBankName.includes("USDT")) {
      const priceUsdt: any = Number(totalAmount) * 0.9;
      return formatPriceUsd(priceUsdt.toFixed(2));
    }
    return formatPriceUsd(totalAmount.toFixed(2));
  };
  return (
    <Modal
      isOpen={isOpenModalDetail}
      onOpenChange={onOpenChangeDetail}
      size="4xl"
      classNames={{ base: "max-h-[90%]", body: "max-h-page" }}
      onClose={() => resetOrderDetail()}
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Thông tin chi tiết</ModalHeader>
            <ModalBody className="overflow-y-auto">
              <div className="my-2">
                <TableControl
                  tableId={"order_detail"}
                  columns={columns}
                  data={itemOrder.orderProduct}
                  total={itemOrder.length}
                  renderCell={renderCell}
                />
              </div>
              <div className="font-bold flex flex-col gap-2">
                <Chip
                  variant="solid"
                  color="primary"
                  radius="sm"
                  classNames={{
                    content: "tracking-wide font-medium",
                  }}
                >
                  Tổng:{" "}
                  {itemOrder?.orderService === "buy_vps"
                    ? itemOrder?.orderProductQuanlity
                    : itemOrder.orderProduct.length}
                </Chip>
                <Chip
                  variant="solid"
                  color="danger"
                  radius="sm"
                  classNames={{
                    content: "tracking-wide font-medium",
                  }}
                >
                  Tổng tiền: {renderTotalAmount()}
                </Chip>
                {itemOrder?.orderBankName.includes("USDT") && (
                  <p>Giảm giá 10% khi thanh toán bằng USDT</p>
                )}
              </div>
              {isLoadingActionOrder ? (
                <div className="my-2 text-center">
                  <Spinner /> <p>Đang xử lý các dịch vụ</p>
                </div>
              ) : Object.keys(responseAction).length > 0 ? (
                <TableControl
                  tableId={"vps_vng_renew"}
                  columns={columnsRenew}
                  data={responseAction?.data || []}
                  total={0}
                  isLoading={isLoadingActionOrder}
                  renderCell={renderCellRenew}
                />
              ) : (
                <></>
              )}
              {itemOrder?.urlBill.length > 0 &&
                itemOrder?.urlBill.map((item: any) => {
                  return (
                    <div key={item} className="flex gap-4">
                      <Image src={API_URL + item} height={200} />
                    </div>
                  );
                })}
            </ModalBody>
            <ModalFooter>
              {itemOrder.orderStatusReview === "accept" && (
                <RenewVPS type={itemOrder.orderService} itemOrder={itemOrder} />
              )}
              <ExportExcelOrder itemOrder={itemOrder} />
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClose();
                  resetOrderDetail();
                }}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalDetailOrder;
