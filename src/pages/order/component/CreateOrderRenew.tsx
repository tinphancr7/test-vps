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
  setDomainLinkOrderList,
  setIsOpenModalRewew,
  setPaymentMethod,
} from "@/stores/slices/order.slice";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import paths from "@/routes/paths";

function CreateOrderRenew({
  listVps,
  handleCreateOrder,
  providerId,
  isLoadingOrder,
}: any) {
  const dispatch = useAppDispatch();
  //????? tuan tran
  const location = useLocation()
  const {
    orderDomainLinkList,
    isOpenModalRenew,
    listPayment,
    isLoadingPaymentMethod,
    paymentSelected,
  } = useAppSelector((state) => state.order);
  const convertData = useMemo(() => {
    if(location.pathname.includes(paths.vps_management_vietserver)) {
      return listPayment.filter((item:any) => {
        return item.type !== 'tron'
      })
    }
    return listPayment
  },[listPayment])
  
  // const team = [...teamId][0];
  // const domain = [...orderDomainLink][0];
  // const find: any = listDomainForSync.filter((item: any) => {
  //   return item.teamId === team;
  // });

  // const btnCreate = find.length > 0 ? false : true;
  // const btnSubmit = domain ? false : true;
  const teamIds = Array.from(
    new Set(listVps.map((item: any) => String(item.team._id)))
  );
  const filteredTeamsOrder = listDomainForSync.filter((team) =>
    teamIds.includes(team.teamId)
  );
  console.log(filteredTeamsOrder);
  const btnCreate = filteredTeamsOrder.length > 0 ? false : true;
  const btnConfirm =
    filteredTeamsOrder.length === orderDomainLinkList.length ? false : true;

  const handleChangeDomain = (value: any, item: any) => {
    if (!value) {
      const itemIds = orderDomainLinkList.filter((itemOrder) => {
        return itemOrder._idTeam !== item.teamId;
      });
      dispatch(setDomainLinkOrderList(itemIds));
    } else {
      dispatch(
        setDomainLinkOrderList([
          ...orderDomainLinkList,
          { _idTeam: item.teamId, value },
        ])
      );
    }
  };
  useEffect(() => {
    if (isOpenModalRenew) {
      dispatch(
        getPaymentMethod({ team: filteredTeamsOrder[0].teamId, providerId })
      );
    }
    dispatch(setPaymentMethod(new Set([""])));
  }, [isOpenModalRenew]);
  return (
    <>
      <Button
        color="primary"
        isDisabled={btnCreate}
        onPress={() => {
          // handleCreateOrder();
          dispatch(setIsOpenModalRewew(true));
          dispatch(setDomainLinkOrderList([]));
        }}
      >
        Tạo đơn hàng
      </Button>
      <Modal
        isOpen={isOpenModalRenew}
        onOpenChange={(value) => dispatch(setIsOpenModalRewew(value))}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận tạo đơn hàng
              </ModalHeader>
              <ModalBody>
                {filteredTeamsOrder.map((item: any) => {
                  return (
                    <div key={item?.teamId}>
                      <p>
                        Chọn Domain: <strong>{item.teamName}</strong>
                      </p>
                      <Autocomplete
                        defaultItems={item.listDomain}
                        placeholder="Domain"
                        radius="sm"
                        variant="bordered"
                        inputProps={initPropsAutoComplete}
                        classNames={classNamesAutoComplete}
                        allowsEmptyCollection={false}
                        // selectedKey={orderDomainLink}
                        onSelectionChange={(value) => {
                          handleChangeDomain(value, item);
                        }}
                      >
                        {(item: any) => (
                          <AutocompleteItem key={item?.value}>
                            {item?.value}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                  );
                })}
                <>
                  <p>Chọn hình thức thanh toán:</p>
                  {isLoadingPaymentMethod && !listPayment ? (
                    <Spinner />
                  ) : (
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
                  )}
                </>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  isDisabled={btnConfirm}
                  onPress={handleCreateOrder}
                  isLoading={isLoadingOrder}
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

export default CreateOrderRenew;
