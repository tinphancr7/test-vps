import ordersDomainApis from "@/apis/order-domain-api";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Input,
  ModalFooter,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { STATUS_DOMAIN_IN_CART, StatusOrderDomainEnum } from "./enums";
import showToast from "@/utils/toast";
import { asyncThunkGetPaginationOrdersDomain } from "@/stores/slices/orders-domain-slice";
import { SiGodaddy } from "react-icons/si";
import { DomainProviderNameEnum } from "@/stores/slices/cart-slice";
import { IoClose } from "react-icons/io5";

function FormOrderDomain({ orderId, isEdit = true }: { orderId: string; isEdit: boolean }) {
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<any>({});
  const { brands } = useAppSelector((state) => state.brand);
  const { teams } = useAppSelector((state) => state.teams);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const tableOrderDomain = useAppSelector((state) => state.table["ordersDomain"]);
  const { teamSelected, brandSelected, searchByCode } = useAppSelector(
    (state) => state.ordersDomain,
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const { data } = await ordersDomainApis.getById(orderId);

      if (data?.status === 1) {
        setOrder(data?.order);
      }
    } catch (error: any) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  const columns = [
    { _id: "domain", name: "Domain", classes: "col-span-3" },
    { _id: "expiration", name: "Thời gian", classes: "col-span-2 text-center" },
    { _id: "price", name: "Thành tiền", classes: "col-span-2 text-center" },
    { _id: "renewal", name: "Gia hạn", classes: "col-span-2 text-center" },
    { _id: "message", name: "Trạng thái", classes: "col-span-2 text-center" },
    { _id: "actions", name: "", classes: "col-span-1 text-center" },
  ];

  const dynadotDomains = useMemo(() => {
    return order?.cartInfo?.filter(
      (it: any) => it?.domainProvider === DomainProviderNameEnum.DYNADOT,
    );
  }, [order]);

  const godaddyDomains = useMemo(() => {
    return order?.cartInfo?.filter(
      (it: any) => it?.domainProvider === DomainProviderNameEnum.GODADDY,
    );
  }, [order]);

  const gnameDomains = useMemo(() => {
    return order?.cartInfo?.filter(
      (it: any) => it?.domainProvider === DomainProviderNameEnum.GNAME,
    );
  }, [order]);

  const nameDomains = useMemo(() => {
    return order?.cartInfo?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.NAME);
  }, [order]);

  const epikDomains = useMemo(() => {
    return order?.cartInfo?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.EPIK);
  }, [order]);

  const nameCheapDomains = useMemo(() => {
    return order?.cartInfo?.filter(
      (it: any) => it?.domainProvider === DomainProviderNameEnum.NAME_CHEAP,
    );
  }, [order]);

  const totalPrice = useMemo(() => {
    const calculator =
      order?.cartInfo?.reduce(
        (total: number, item: any) => (total += parseFloat(item?.price)),
        0,
      ) || 0;

    if (calculator) {
      return calculator?.toFixed(2);
    }

    return "0.00";
  }, [order]);

  const handleRemoveItem = async (domain: any) => {
    const newItems = order?.cartInfo?.filter(
      (it: any) => it?.domain !== domain?.domain || it?.domainProvider !== domain?.domainProvider,
    );

    setOrder((prev: any) => ({ ...prev, cartInfo: newItems }));

    try {
      const { data } = await ordersDomainApis.update(orderId, {
        cartInfo: newItems,
      });

      if (data?.status === 1) {
        showToast("Cập nhật đơn hàng thành công!", "success");
        fetchData();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const colorStatus = (status: STATUS_DOMAIN_IN_CART) => {
    switch (status) {
      case STATUS_DOMAIN_IN_CART.NEW_DOMAIN_ORDER:
        return "warning";

      case STATUS_DOMAIN_IN_CART.SUBMIT_REGISTRATION:
      case STATUS_DOMAIN_IN_CART.BUY_SUCCESS:
        return "success";

      default:
        return "danger";
    }
  };

  const isDisabledActions = useMemo(() => {
    if (isEdit && STATUS_DOMAIN_IN_CART.NEW_DOMAIN_ORDER) {
      return false;
    }

    return true;
  }, [isEdit]);

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "domain":
        return <span className="pl-8">{cellValue}</span>;

      case "expiration":
        return "1 năm";

      case "price":
        return `${cellValue} $`;

      case "message":
        return (
          <Chip
            radius="sm"
            color={colorStatus(cellValue)}
            variant="flat"
            classNames={{
              base: "h-auto",
              content: "font-semibold tracking-wider py-1 break-words text-wrap",
            }}
          >
            {cellValue}
          </Chip>
        );

      case "actions":
        if (isDisabledActions) {
          return <></>;
        }

        return (
          <Button
            color="danger"
            variant="solid"
            className={`rounded-full w-5 min-w-0 h-5 p-2`}
            onPress={() => handleRemoveItem(item)}
            isDisabled={isDisabledActions}
          >
            <IoClose className="min-w-max w-4 h-4" />
          </Button>
        );

      default:
        return cellValue;
    }
  };

  const handleApproveOrder = async () => {
    try {
      setIsSubmitting(true);

      const { data } = await ordersDomainApis.cancel(orderId);

      if (data?.status === 1) {
        showToast("Duyệt đơn hàng thành công!", "success");
        // fetchData();

        const query: any = {};

        if (searchByCode !== undefined) {
          query.search = searchByCode;
        }

        if (teamSelected) {
          query.team = teamSelected;
        }

        if (brandSelected) {
          query.brand = brandSelected;
        }

        if (tableOrderDomain) {
          const cPageSize = tableOrderDomain?.pageSize
            ? // eslint-disable-next-line no-unsafe-optional-chaining
              [...tableOrderDomain?.pageSize][0]
            : 10;

          query.pageIndex = tableOrderDomain?.pageIndex || 1;
          query.pageSize = cPageSize;

          dispatch(asyncThunkGetPaginationOrdersDomain(query));
        }

        dispatch(resetModal());
      }
    } catch (error) {
      console.log("error: ", error);
      showToast("Duyệt đơn hàng thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsSubmitting(true);

      const { data } = await ordersDomainApis.cancel(orderId);

      if (data?.status === 1) {
        showToast("Hủy đơn hàng thành công!", "success");
        fetchData();
        const query: any = {};

        if (searchByCode !== undefined) {
          query.search = searchByCode;
        }

        if (teamSelected) {
          query.team = teamSelected;
        }

        if (brandSelected) {
          query.brand = brandSelected;
        }

        if (tableOrderDomain) {
          const cPageSize = tableOrderDomain?.pageSize
            ? // eslint-disable-next-line no-unsafe-optional-chaining
              [...tableOrderDomain?.pageSize][0]
            : 10;

          query.pageIndex = tableOrderDomain?.pageIndex || 1;
          query.pageSize = cPageSize;

          dispatch(asyncThunkGetPaginationOrdersDomain(query));
        }

        dispatch(resetModal());
      }
    } catch (error) {
      console.log("error: ", error);
      showToast("Hủy đơn hàng thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyDomain = async () => {
    try {
      setIsSubmitting(true);

      const { data } = await ordersDomainApis.buyDomain(orderId);

      const isSucceed = data?.order?.cartInfo?.some((item: any) => item?.isBuy);
      if (isSucceed) {
        showToast("Mua tên miền thành công!", "success");
      } else {
        showToast("Mua tên miền thất bại!", "error");
      }

      fetchData();
      const query: any = {};

      if (searchByCode !== undefined) {
        query.search = searchByCode;
      }

      if (teamSelected) {
        query.team = teamSelected;
      }

      if (brandSelected) {
        query.brand = brandSelected;
      }

      if (tableOrderDomain) {
        const cPageSize = tableOrderDomain?.pageSize
          ? // eslint-disable-next-line no-unsafe-optional-chaining
            [...tableOrderDomain?.pageSize][0]
          : 10;

        query.pageIndex = tableOrderDomain?.pageIndex || 1;
        query.pageSize = cPageSize;

        dispatch(asyncThunkGetPaginationOrdersDomain(query));
      }

      dispatch(resetModal());
    } catch (error) {
      console.log("error: ", error);
      showToast("Mua tên miền thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    <div className="h-64 flex items-center justify-center">
      <CircularProgress size="lg" color="primary" />
    </div>;
  }

  return (
    <div className="h-full flex flex-col items-stretch">
      <div className="grow overflow-auto scroll-main">
        {/* Filter */}
        <div className="flex flex-col gap-4">
          <Input
            label="Mã đơn hàng"
            radius="none"
            color="primary"
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              inputWrapper: "h-10 data-[hover=true]:border-primary border border-slate-400",
              label: "text-dark",
            }}
            type={"text"}
            placeholder={"Mã đơn hàng..."}
            value={order?.code}
            isDisabled={true}
          />

          <Input
            label="Tên đơn hàng"
            radius="none"
            color="primary"
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              inputWrapper: "h-10 data-[hover=true]:border-primary border border-slate-400",
              label: "text-dark",
            }}
            type={"text"}
            placeholder={"Tên đơn hàng..."}
            value={order?.name}
            isDisabled={true}
          />

          <Input
            label="Trạng thái"
            radius="none"
            color="primary"
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              inputWrapper: "h-10 data-[hover=true]:border-primary border border-slate-400",
              label: "text-dark",
            }}
            type={"text"}
            placeholder={"Trạng thái..."}
            value={order?.status?.name}
            isDisabled={true}
          />

          <Autocomplete
            label="Team"
            defaultItems={teams}
            placeholder="Team"
            labelPlacement="outside"
            radius="none"
            variant="bordered"
            inputProps={initPropsAutoComplete}
            classNames={classNamesAutoComplete}
            selectedKey={order?.team?._id}
            isDisabled={true}
          >
            {(item: any) => <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>}
          </Autocomplete>

          <Autocomplete
            label="Thương hiệu"
            placeholder="Thương hiệu..."
            labelPlacement="outside"
            defaultItems={brands}
            radius="none"
            variant="bordered"
            inputProps={initPropsAutoComplete}
            classNames={classNamesAutoComplete}
            selectedKey={order?.brand?._id}
            isDisabled={true}
          >
            {(item: any) => <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>}
          </Autocomplete>
        </div>

        {/* Cart Info */}
        <div className="grow mt-4">
          {/* Columns */}
          <div className="grid grid-cols-12 bg-primary">
            {columns?.map((col) => (
              <div
                key={col?._id}
                className={`${col?.classes} p-2 text-base uppercase text-light font-semibold tracking-wider`}
              >
                {col?.name}
              </div>
            ))}
          </div>

          {/* Godaddy */}
          {!!godaddyDomains?.length && (
            <>
              <div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
                <SiGodaddy className="text-[#54CBD2] text-[20px]" />

                <span>Godaddy</span>
              </div>

              {godaddyDomains?.map((domain: any, index: number) => (
                <div key={index} className="grid grid-cols-12 items-center">
                  {columns?.map((col) => (
                    <div
                      key={col?._id}
                      className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
                    >
                      {renderCell(domain, col?._id)}
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* Dynadot */}
          {!!dynadotDomains?.length && (
            <>
              <div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
                <img
                  src="/imgs/dynadot.png"
                  alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
                  className="w-5 rounded-md"
                />
                <span>Dynadot</span>
              </div>

              <div className="divide-y-1">
                {dynadotDomains?.map((domain: any, index: number) => (
                  <div key={index} className="grid grid-cols-12 items-center">
                    {columns?.map((col) => (
                      <div
                        key={col?._id}
                        className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
                      >
                        {renderCell(domain, col?._id)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gname */}
          {!!gnameDomains?.length && (
            <>
              <div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
                <img
                  src="/imgs/gname.jpg"
                  alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
                  className="w-5 rounded-md"
                />
                <span>Gname</span>
              </div>

              <div className="divide-y-1">
                {gnameDomains?.map((domain: any, index: number) => (
                  <div key={index} className="grid grid-cols-12 items-center">
                    {columns?.map((col) => (
                      <div
                        key={col?._id}
                        className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
                      >
                        {renderCell(domain, col?._id)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Name */}
          {!!nameDomains?.length && (
            <>
              <div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
                <img
                  src="/imgs/name.png"
                  alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
                  className="w-5 rounded-md"
                />
                <span>Name</span>
              </div>

              <div className="divide-y-1">
                {nameDomains?.map((domain: any, index: number) => (
                  <div key={index} className="grid grid-cols-12 items-center">
                    {columns?.map((col) => (
                      <div
                        key={col?._id}
                        className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
                      >
                        {renderCell(domain, col?._id)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Epik */}
          {!!epikDomains?.length && (
            <>
              <div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
                <img
                  src="/imgs/epik.png"
                  alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
                  className="w-5 rounded-md"
                />
                <span>Epik</span>
              </div>

              <div className="divide-y-1">
                {epikDomains?.map((domain: any, index: number) => (
                  <div key={index} className="grid grid-cols-12 items-center">
                    {columns?.map((col) => (
                      <div
                        key={col?._id}
                        className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
                      >
                        {renderCell(domain, col?._id)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Epik */}
          {!!nameCheapDomains?.length && (
            <>
              <div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
                <img
                  src="/imgs/namecheap.png"
                  alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
                  className="w-5 rounded-md"
                />
                <span>Epik</span>
              </div>

              <div className="divide-y-1">
                {nameCheapDomains?.map((domain: any, index: number) => (
                  <div key={index} className="grid grid-cols-12 items-center">
                    {columns?.map((col) => (
                      <div
                        key={col?._id}
                        className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
                      >
                        {renderCell(domain, col?._id)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          <Divider className="my-5" />

          <div className="flex items-center justify-start gap-4">
            <p className="tracking-wider font-medium text-base">Tổng số tiền:</p>
            <b className="tracking-wider text-base">{totalPrice} $</b>
          </div>
        </div>
      </div>

      {/* Action */}
      <ModalFooter className="px-2 sticky bottom-0 border-t gap-4 bg-white mt-5">
        {isEdit &&
          !!order?.cartInfo?.length &&
          order?.status?.code === StatusOrderDomainEnum.ORDER_STATUS_SEO_CREATE && (
            <Button
              variant="solid"
              className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
              isLoading={isSubmitting}
              onPress={handleApproveOrder}
            >
              Duyệt đơn hàng
            </Button>
          )}

        {isEdit &&
          !!order?.cartInfo?.length &&
          [StatusOrderDomainEnum.ORDER_STATUS_CREATE, StatusOrderDomainEnum.UN_SUCCESS].includes(
            order?.status?.code,
          ) && (
            <Button
              variant="solid"
              className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
              isLoading={isSubmitting}
              onPress={handleBuyDomain}
            >
              Mua ngay
            </Button>
          )}

        {isEdit &&
          ![
            StatusOrderDomainEnum.ORDER_STATUS_CANCEL,
            StatusOrderDomainEnum.ORDER_STATUS_DONE,
          ].includes(order?.status?.code) && (
            <Button
              variant="solid"
              color="danger"
              className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
              isLoading={isSubmitting}
              onPress={handleCancelOrder}
            >
              Hủy đơn hàng
            </Button>
          )}

        <Button
          variant="solid"
          color="default"
          className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
          onPress={() => dispatch(resetModal())}
        >
          Đóng
        </Button>
      </ModalFooter>
    </div>
  );
}

export default FormOrderDomain;
