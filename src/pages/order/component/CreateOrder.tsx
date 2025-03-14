import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { listDomainForSync } from "../constant";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
  getPaymentMethod,
  setDomainLinkOrder,
  setIsOpenModal,
  setPaymentMethod,
} from "@/stores/slices/order.slice";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import paths from "@/routes/paths";

function CreateOrder({ teamId, handleCreateOrder, providerId, loadingSubmit }: any) {
  const dispatch = useAppDispatch();
  const { orderDomainLink, isOpenModal, listPayment, isLoadingPaymentMethod, paymentSelected } =
    useAppSelector((state) => state.order);
  const team = [...teamId][0];
  const domain = orderDomainLink && [...orderDomainLink][0];
  const payment = paymentSelected && [...paymentSelected][0];
  const find: any = listDomainForSync.filter((item: any) => {
    return item.teamId === team;
  });
  //????? tuan tran
  const location = useLocation();

  const convertData = useMemo(() => {
    if (location.pathname.includes(paths.vps_vietserver)) {
      return listPayment.filter((item: any) => {
        return item.type !== "tron";
      });
    }
    return listPayment;
  }, [listPayment]);

  useEffect(() => {
    if (isOpenModal) {
      dispatch(getPaymentMethod({ team, providerId }));
    }
    dispatch(setPaymentMethod(new Set([""])));
  }, [isOpenModal]);

  const btnCreate = find.length > 0 ? false : true;
  const btnSubmit = domain && payment ? false : true;
  return (
    <>
      <Button
        fullWidth
        color="primary"
        className="pr-2 rounded-md uppercase font-bold bg-[#ff990026] text-primary"
        onPress={() => dispatch(setIsOpenModal(true))}
        isDisabled={btnCreate}
      >
        Tạo đơn hàng
      </Button>
      <Modal
        isOpen={isOpenModal}
        onOpenChange={(value) => dispatch(setIsOpenModal(value))}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xác nhận tạo đơn hàng</ModalHeader>
              <ModalBody>
                <>
                  <p>
                    Chọn Domain: <strong>{find[0]?.teamName}</strong>
                  </p>
                  <Autocomplete
                    defaultItems={find[0]?.listDomain}
                    placeholder="Domain"
                    radius="sm"
                    variant="bordered"
                    inputProps={initPropsAutoComplete}
                    classNames={classNamesAutoComplete}
                    selectedKey={orderDomainLink}
                    onSelectionChange={(value) => {
                      dispatch(setDomainLinkOrder(value));
                    }}
                  >
                    {(item: any) => (
                      <AutocompleteItem key={item?.value}>{item?.value}</AutocompleteItem>
                    )}
                  </Autocomplete>
                </>
                <>
                  <p>Chọn hình thức thanh toán:</p>
                  {isLoadingPaymentMethod && !listPayment ? (
                    <Spinner />
                  ) : (
                    <>
                      <Autocomplete
                        defaultItems={convertData}
                        placeholder="Thanh toán"
                        radius="sm"
                        variant="bordered"
                        inputProps={initPropsAutoComplete}
                        classNames={classNamesAutoComplete}
                        selectedKey={paymentSelected}
                        onSelectionChange={(value) => {
                          dispatch(setPaymentMethod(value));
                        }}
                      >
                        {(item: any) => (
                          <AutocompleteItem key={item?.type}>
                            {item?.type === "bank"
                              ? `${item?.bankName} - ${item?.accountNumber} - ${item?.accountName}`
                              : `${item?.bankName} - ${item?.accountNumber}`}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                      {convertData.length === 0 && (
                        <p className="text-red-500">
                          {" "}
                          Tài khoản của bạn chưa được tạo ở nhà cung cấp này.!
                        </p>
                      )}
                    </>
                  )}
                </>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  isDisabled={btnSubmit}
                  onPress={handleCreateOrder}
                  isLoading={loadingSubmit}
                >
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateOrder;
