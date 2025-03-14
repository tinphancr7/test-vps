import orderApis from "@/apis/order.api";
import vpsApis from "@/apis/vps-apis";
import TableControl from "@/components/table-control";
import { ProviderIDEnum, VpsTypeEnum } from "@/constants/enum";
import CreateOrderRenew from "@/pages/order/component/CreateOrderRenew";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setIsOpenModalRewew } from "@/stores/slices/order.slice";
import { formatPriceUsd } from "@/utils/format-price-usd";
import showToast from "@/utils/toast";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ConfirmExtendVPS({ isOpen, onOpenChange }: any) {
  const dispatch = useAppDispatch();
  // const { vpsList } = useAppSelector((state) => state.vpsVietServer);
  const { orderDomainLinkList, paymentSelected } = useAppSelector(
    (state) => state.order
  );
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState([]);

  const [invoiceId, setInvoiceId] = useState("");
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const tableVpsVietServer: any = useAppSelector(
    (state) => state.table["vps_vietserver"]
  );
  const [list, setList] = useState<any[]>([]);
  // const list = useMemo(() => {
  //   const listSelect = [...(tableVpsVietServer?.selectedKeys || "")];
  //   return vpsList.filter((vps) => listSelect.includes(vps._id));
  // }, [tableVpsVietServer]);
  const getInfoListVPSRenew = async () => {
    const result = await vpsApis.getInfoListVPSRenew({
      item: [...(tableVpsVietServer?.selectedKeys || "")],
    });
    setList(result.data);
  };
  useEffect(() => {
    if (isOpen) {
      // Gọi API info khi modal mở
      getInfoListVPSRenew();
    }
  }, [isOpen]);

  const convertVnToUsd = (price: number) => {
    const calculator = price / 26000;

    return calculator;
  };
  const convertMoneyVAT = (value: any) => {
    const total: any = convertVnToUsd(value);
    const VAT: any = convertVnToUsd(value * 0.1);
    const another: any = convertVnToUsd(value * 1.1);
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
      VAT_n: formatPriceUsd(VAT_n),
      total_n: formatPriceUsd(total_n),
    };
  };
  const totalAmount = useMemo(() => {
    return list.reduce((curr, item) => {
      const totalReturn = convertMoneyVAT(item?.vps_id?.total).totalReturn;
      curr += Math.floor(totalReturn * 100) / 100;
      return curr;
    }, 0);
  }, [list]);

  const navigate = useNavigate();
  const handleInvoice = async () => {
    navigate("/invoices/vng/detail", { state: { id: invoiceId } });
  };

  const handleRenewVPS = async () => {
    setIsLoading(true);
    const dataRenew = list.map((item: any) => {
      return {
        vpsType: VpsTypeEnum.VIETSERVER_VPS,
        teamId: item?.team?._id,
        vps_id: item?.vps_id,
      };
    });

    const result = await vpsApis.renewVps(dataRenew);
    if (!result?.data?.status) {
      setIsLoading(false);
      switch (result?.data?.message) {
        case "account_not_enogh_money": {
          showToast("Tài khoản không đủ tiền để thanh toán", "error");
          break;
        }
        default: {
          showToast("Dịch vụ gia hạn không thành công", "error");
          break;
        }
      }
      return;
    }
    setResultData(result?.data?.data);
    setInvoiceId(result?.data?.invoice_id);
    setIsLoading(false);
  };

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
            <p className="text-success-500">Thành công</p>
            <p>Gia hạn dịch vụ thành công</p>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <p className="text-red-500">Lỗi</p>
            <p>Dịch vụ gia hạn không thành công</p>
          </div>
        );
    }
  };

  const hanldeCloseModal = () => {
    setResultData([]);
  };
  const columns = [
    { _id: "name", name: "Tên dịch vụ" },
    {
      _id: "invoicePrice",
      name: "Giá",
    },

    { _id: "vatPrice", name: "VAT(10%)" },
    { _id: "sumPrice", name: "Tổng" },
  ];

  const columnsRenew = [
    { _id: "name", name: "Tên dịch vụ" },
    {
      _id: "status",
      name: "Tình trạng",
    },

    // { _id: "invoiceLink", name: "Hóa đơn" },
  ];
  const handleCreateOrder = async () => {
    setIsLoadingOrder(true);
    const newlist = list
      .filter((listVPS) =>
        orderDomainLinkList.some(
          (itemDomainList) => listVPS.team._id === itemDomainList._idTeam
        )
      )
      .map((listVPS) => {
        const matchingDomain = orderDomainLinkList.find(
          (itemDomainList) => listVPS.team._id === itemDomainList._idTeam
        );
        return matchingDomain
          ? { ...listVPS, orderDomainLink: matchingDomain.value }
          : listVPS;
      });
    const payload = {
      vpsType: VpsTypeEnum.VIETSERVER_VPS,
      orderService: "renew_vps",
      data: newlist,
      totalAmount,
      paymentSelected,
    };
    const result: any = await orderApis.createOrderRenew(payload);
    if (!result?.status) {
      if (result?.message === "client_id_not_found") {
        showToast("Vui lòng tạo tài khoản", "info");
      }
      if (result?.message === "create_order_fail") {
        showToast("Tạo đơn hàng thất bại", "info");
      }
      return;
    }
    showToast("Tạo đơn hàng thành công", "success");
    onOpenChange(false);
    setIsLoadingOrder(false);
    dispatch(setIsOpenModalRewew(false));
  };
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div className="font-bold text-blue-500 text-left">
            <p>{item?.vps_id?.product_name}</p>
            <p>IP: {item?.vps_id?.ip}</p>
          </div>
        );
      case "vatPrice":
        return (
          <p className="font-bold">
            {convertMoneyVAT(item?.vps_id?.total).VAT_n}
          </p>
        );
      case "invoicePrice":
        return (
          <p className="font-bold">
            {convertMoneyVAT(item?.vps_id?.total).total_n}
          </p>
        );
      case "sumPrice":
        return (
          <p className="font-bold">
            {convertMoneyVAT(item?.vps_id?.total).totalReturn_n}
          </p>
        );
      default:
        return cellValue;
    }
  };

  const renderCellRenew = useCallback(
    (item: any, columnKey: string) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="font-bold text-blue-500 text-left">
              <p>{item?.itemData?.vps_id?.product_name}</p>
              <p>IP: {item?.itemData?.vps_id?.ip}</p>
            </div>
          );
        case "status":
          return status(item?.message);
        case "invoiceLink":
          if (item?.itemData?.status) {
            return <Link to={``}>Chi tiết hóa đơn</Link>;
          }
          return <></>;
        default:
          return <></>;
      }
    },
    [resultData]
  );
  const checkPrintInvoice = useMemo(() => {
    if (resultData?.length > 0) {
      const hasSuccessfulRenewal = resultData.some(
        (item: any) => item.message === "renewal_cloud_successfully"
      );
      if (!hasSuccessfulRenewal) {
        return false;
      }

      return true;
    }
    return false;
  }, [resultData]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      onClose={() => hanldeCloseModal()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Gia hạn dịch vụ
            </ModalHeader>
            <ModalBody>
              <div className="my-2">
                <TableControl
                  tableId={"vps_vietstack"}
                  columns={columns}
                  data={list}
                  total={0}
                  renderCell={renderCell}
                />

                <div className="font-bold flex flex-col gap-2 my-2">
                  <Chip
                    variant="solid"
                    color="primary"
                    radius="sm"
                    classNames={{
                      content: "tracking-wide font-medium",
                    }}
                  >
                    Tổng: {list.length}
                  </Chip>
                  <Chip
                    variant="solid"
                    color="danger"
                    radius="sm"
                    classNames={{
                      content: "tracking-wide font-medium",
                    }}
                  >
                    Tổng tiền: {formatPriceUsd(totalAmount.toFixed(2))}
                  </Chip>
                </div>
              </div>
              {isLoading ? (
                <div className="my-2 text-center">
                  <Spinner /> <p>Đang xử lý các dịch vụ</p>
                </div>
              ) : resultData.length > 0 ? (
                <TableControl
                  tableId={"vps_vietstack_renew"}
                  columns={columnsRenew}
                  data={resultData}
                  total={0}
                  isLoading={isLoading}
                  renderCell={renderCellRenew}
                />
              ) : (
                <></>
              )}
            </ModalBody>
            <ModalFooter className="justify-between">
              <div>
                <Button
                  color="primary"
                  onPress={() => {
                    handleInvoice();
                  }}
                  className={`${checkPrintInvoice ? "block" : "hidden"}`}
                >
                  Xem hóa đơn
                </Button>
              </div>
              <div className="flex justify-center gap-2">
                <div>
                  {/* <Button
                    color="primary"
                    onPress={() => {
                      handleCreateOrder();
                    }}
                    isLoading={isLoading}
                  >
                    Tạo đơn hàng
                  </Button> */}
                  <CreateOrderRenew
                    listVps={list}
                    handleCreateOrder={handleCreateOrder}
                    providerId={ProviderIDEnum.VietServer}
                    isLoadingOrder={isLoadingOrder}
                  />
                </div>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleRenewVPS();
                  }}
                  isLoading={isLoading}
                >
                  Đồng ý
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
export default ConfirmExtendVPS;
