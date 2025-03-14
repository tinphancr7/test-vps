import Access from "@/components/Access/access";
import { ActionEnum, ProviderIDEnum, SubjectEnum } from "@/constants/enum";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/stores";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { HiOutlineUpload } from "react-icons/hi";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  DateRangePicker,
  Input,
  Tooltip,
} from "@heroui/react";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import { getListProvider } from "@/stores/slices/transaction.slice";
import { IoIosClose, IoIosEye } from "react-icons/io";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import moment from "moment";
import {
  deleteOrder,
  getListOrder,
  setQuerySearch,
  updateReviewOrder,
  uploadBill,
} from "@/stores/slices/order.slice";
import ActionsCell from "@/components/actions-cell";
import { VscPreview } from "react-icons/vsc";
import { IoCloseCircleOutline } from "react-icons/io5";
import showToast from "@/utils/toast";
import ModalDetailOrder from "./component/ModalDetailOrder";
import { BiSearch, BiTrash } from "react-icons/bi";
import { formatPriceUsd } from "@/utils/format-price-usd";
import ModalConfirm from "./component/ModalConfirm";
import { FaRegCopy } from "react-icons/fa6";
import ModalUploadBill from "./component/ModalUploadBill";
import { API_URL } from "@/configs/apis";
import { setModal } from "@/stores/slices/modal-slice";
import FormExchange from "./component/FormExchange";
function Order() {
  const dispatch = useDispatch<AppDispatch>();
  const { permissions, user } = useAppSelector((state) => state.auth);
  // Update search input and reset pagination on change
  const { listOrder, total, isLoadingUpdate, totalPrice } = useAppSelector((state) => state.order);
  const orderTable = useAppSelector((state) => state.table["order"]);
  const { teams } = useAppSelector((state) => state.teams);
  const { listProvider } = useAppSelector((state) => state.transaction);

  const [teamSelected, setTeamSelected] = useState<any>(null);
  const [searchByContent, setSearchByContent] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<any>(null);
  const [providerSelected, setProviderSelected] = useState<any>(null);
  const [orderService, setOrderService] = useState<any>(null);
  const [dateRange, setDateRange] = useState<any>(null);
  const [files, setFiles] = useState<any>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]); // URLs từ server

  const isAdmin = useMemo(() => {
    if (!permissions?.length) return false;

    const hasPermission = permissions.some((item: any) => item.subject === SubjectEnum.ALL);

    return hasPermission;
  }, [permissions]);

  const isTroLy = useMemo(() => {
    if (user?.role?.name === "TRỢ LÝ") {
      return true;
    }

    return false;
  }, [user]);

  const isLeader = useMemo(() => {
    if (user?.role?.name === "LEADER") {
      return true;
    }

    return false;
  }, [user]);

  const orderServiceList = [
    { _id: "buy_vps", name: "Mua mới VPS" },
    { _id: "renew_vps", name: "Gia hạn VPS" },
  ];
  const statusList = [
    { _id: "new", name: "Chờ duyệt" },
    { _id: "accept", name: "Đã duyệt" },
    { _id: "delete", name: "Hủy đơn hàng" },
    { _id: "completed", name: "Đã thanh toán" },
    { _id: "reject", name: "Không duyệt" },
  ];

  function getServiceNameById(id: string, quanlity: number) {
    if (id === "buy_vps") {
      return (
        <p>
          Mua mới <strong>{quanlity}</strong> VPS
        </p>
      );
    }
    return (
      <p>
        Gia hạn <strong>{quanlity}</strong> VPS
      </p>
    );
  }
  const searchMatch = useDebounce(searchByContent, 500);
  const columns = [
    { _id: "orderDate", name: "Thời gian", className: "w-[10%]" },
    { _id: "orderId", name: "Mã đơn", className: "w-[15%]" },
    { _id: "orderTeam", name: "Team", className: "w-[10%]" },
    { _id: "orderService", name: "Dịch vụ", className: "w-[30%]" },
    {
      _id: "orderProvider",
      name: "Nhà cung cấp",
      className: "w-[5%]",
    },
    { _id: "stk", name: "STK" },
    { _id: "bankName", name: "Ngân hàng", className: "w-[5%]" },
    { _id: "bankContent", name: "Nội dung chuyển khoản" },
    { _id: "totalPrice", name: "Tổng tiền" },
    { _id: "orderStatusReview", name: "Tình trạng" },
    { _id: "createdBy", name: "Người tạo" },
    { _id: "reviewBy", name: "Người duyệt" },
    { _id: "orderNote", name: "Ghi chú" },
    { _id: "actions", name: "Hành động" },
  ];
  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }

    if (teamSelected) {
      query["team"] = teamSelected;
    }
    if (statusFilter) {
      query["status"] = statusFilter;
    }

    if (dateRange) {
      query["dateRange"] = dateRange;
    }
    if (providerSelected) {
      query["providerSelected"] = providerSelected;
    }
    if (orderService) {
      query["orderService"] = orderService;
    }
    if (orderTable) {
      const cPageSize = orderTable?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...orderTable?.pageSize][0]
        : 10;

      query["pageIndex"] = orderTable?.pageIndex || 1;
      query["pageSize"] = cPageSize;
    }
    dispatch(getListOrder(query));
    dispatch(setQuerySearch(query));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderTable,
    statusFilter,
    teamSelected,
    searchMatch,
    providerSelected,
    dateRange,
    orderService,
    isLoadingUpdate,
  ]);
  const [orderDetail, setOrderDetail] = useState();
  useEffect(() => {
    if (!teams?.length) {
      dispatch(asyncThunkGetAllYourTeam());
    }
    if (!listProvider?.length) {
      dispatch(getListProvider());
    }
    return () => {};
  }, []);

  const onClear = () => {
    setSearchByContent("");
    dispatch(
      setTablePageIndex({
        tableId: "transactionHistory",
        pageIndex: 1,
      }),
    );
  };
  const handleUploadBill = async () => {
    try {
      const formData = new FormData();

      for (let x = 0; x < files.length; x++) {
        formData.append("files", files[x]);
      }

      const parseExistingFiles =
        existingFiles?.length && existingFiles?.map((it) => it?.replace(API_URL, ""));

      formData.append("existingFiles", JSON.stringify(parseExistingFiles));
      formData.append("domain", itemOrder.orderDomainLink);
      formData.append("orderId", itemOrder.orderId);

      const data = await dispatch(uploadBill({ formData, idOrder: itemOrder._id }));

      if (!data.payload.status) {
        showToast("Upload không thành công", "error");
        return;
      }
      setIsOpenModalUpload(false);
      setFiles([]);
      showToast("Upload thành công", "success");
    } catch (error) {
      console.log(error);
      showToast("Upload không thành công", "error");
    }
  };
  const onUpdateExChange = () => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Cập nhật tỉ giá",
        body: <FormExchange />,
      }),
    );
  };
  const handleSendReviewToBusiness = async () => {
    try {
      // const result = await orderApis.reviewOrder(status, item?._id);
      const data = await dispatch(
        updateReviewOrder({
          status: dataModalConfirm.type,
          _idOrder: dataModalConfirm?._id,
        }),
      );
      if (!data.payload.status) {
        showToast("Phê duyệt không thành công", "error");
        return;
      }
      setIsOpenModalConfirm(false);
    } catch (error) {
      console.log(error);
      showToast("Phê duyệt không thành công", "error");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const data = await dispatch(
        deleteOrder({
          _idOrder: dataModalConfirm?._id,
        }),
      );
      if (!data.payload.status) {
        showToast("Hủy đơn hàng không thành công", "error");
        return;
      }
      setIsOpenModalConfirm(false);
      showToast("Hủy đơn hàng thành công", "success");
    } catch (error) {
      console.log(error);
      showToast("Hủy đơn hàng không thành công", "error");
    }
  };

  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);

  const handelOpenModalDetail = (item: any) => {
    setIsOpenModalDetail(true);
    setOrderDetail(item);
  };

  const renderOrderStatus = (status: string) => {
    if (status === "new") {
      return <Chip color="primary">Chờ duyệt</Chip>;
    } else if (status === "accept") {
      return <Chip color="success">Đã duyệt</Chip>;
    } else if (status === "delete") {
      return <Chip color="danger">Hủy đơn hàng</Chip>;
    } else if (status === "completed") {
      return <Chip classNames={{ base: "bg-blue-500", content: "text-white" }}>Đã thanh toán</Chip>;
    } else return <Chip color="danger">Không duyệt</Chip>;
  };
  const convertMoneyVAT = (value: any, type?: any) => {
    const total: any = convertVnToUsd(value, type);
    const VAT: any = convertVnToUsd(value * 0.1, type);
    const totalReturn = total + VAT;
    return {
      total: formatPriceUsd(total),
      VAT: formatPriceUsd(VAT),
      totalReturn: formatPriceUsd(totalReturn),
      totalReturn_n: totalReturn,
      total_n: total,
    };
  };
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [dataModalConfirm, setDataModalConfirm] = useState<any>({});
  const [itemOrder, setOrder] = useState<any>("");

  const handelOpenModalConfirm = (item: any, type: string) => {
    setIsOpenModalConfirm(true);
    setDataModalConfirm({ ...item, type });
  };
  const funcConfirm = useCallback(() => {
    if (dataModalConfirm.type === "delete") {
      return handleDeleteOrder();
    }
    return handleSendReviewToBusiness();
  }, [dataModalConfirm]);

  const handleCopyOrderID = (text: any) => {
    navigator.clipboard.writeText(text);
  };
  const [isOpenModalUpload, setIsOpenModalUpload] = useState(false);

  const handleOpenModalUpBill = (item: any) => {
    setIsOpenModalUpload(true);
    setOrder(item);

    if (item?.urlBill?.length) {
      const addApiUrl = item?.urlBill?.map((it: string) => API_URL + it);

      setExistingFiles(addApiUrl);
    }
  };
  // Fetch logs based on filters, pagination, and search
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    const addNewActions: any = [
      {
        order: 1,
        label: "Duyệt",
        icon: VscPreview,
        bgColor: "bg-green-600",
        isDisabled: false,
        onPress: () => {
          handelOpenModalConfirm(item, "accept");
        },
      },
      {
        order: 2,
        label: "Không duyệt",
        icon: IoCloseCircleOutline,
        bgColor: "bg-danger",
        // isDisabled: isAdmin ? false : true,
        onPress: () => {
          handelOpenModalConfirm(item, "reject");
        },
      },
    ];
    const subAction: any = [
      {
        order: 0,
        label: "Xem chi tiết",
        icon: IoIosEye,
        bgColor: "bg-warning",
        onPress: () => {
          handelOpenModalDetail(item);
        },
      },
      {
        order: 4,
        label: "Hủy đơn hàng",
        icon: BiTrash,
        bgColor: "bg-danger",
        onPress: () => {
          handelOpenModalConfirm(item, "delete");
        },
      },
    ];

    const upBill: any = [
      {
        order: 5,
        label: "Up bill",
        icon: HiOutlineUpload,
        bgColor: "bg-success",
        onPress: () => {
          handleOpenModalUpBill(item);
        },
      },
    ];
    switch (columnKey) {
      case "orderDate": {
        return <p>{moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>;
      }
      case "orderService": {
        return (
          <div>
            <p>{getServiceNameById(item.orderService, item.orderProductQuanlity)}</p>
            {item.orderService === "buy_vps" ? (
              <p>
                CPU: {item.orderProduct[0].cpu} | Ram: {item.orderProduct[0].ram} | Storage:{" "}
                {item.orderProduct[0].storage}{" "}
              </p>
            ) : (
              <Tooltip
                content={item.orderProduct.map((item: any) => (
                  <p className="py-1" key={item._id}>
                    {item.ip}
                  </p>
                ))}
              >
                <p className="line-clamp-1 min-w-full hover:cursor-pointer">
                  {item.orderProduct.map((item: any) => item.ip).join(", ")}
                </p>
              </Tooltip>
            )}
          </div>
        );
      }
      case "orderProvider": {
        return <p>{item?.orderProviderId?.name}</p>;
      }
      case "orderTeam": {
        return <p>{item?.orderTeamId?.name}</p>;
      }
      case "team": {
        return <p>{item.teamId.name}</p>;
      }
      case "stk": {
        return <p>{item.orderBankAccountNumber}</p>;
      }
      case "bankName": {
        return <p>{item.orderBankName}</p>;
      }
      case "bankContent": {
        return <p>{item.orderBankContent}</p>;
      }
      case "createdBy": {
        return <p>{item?.orderCreatedBy?.name}</p>;
      }
      case "reviewBy": {
        return <p>{item?.orderReviewBy?.name}</p>;
      }
      case "orderNote": {
        return <p>{item?.orderNote}</p>;
      }
      case "orderId": {
        return (
          <Tooltip
            radius="sm"
            content={
              <div className="flex items-center gap-1 text-xs">
                <FaRegCopy />
                Sao chép
              </div>
            }
          >
            <Button
              className="h-8 px-1 rounded-md bg-transparent  "
              onPress={() => handleCopyOrderID(item?.orderId)}
            >
              <p> {item?.orderId}</p>
            </Button>
          </Tooltip>
        );
      }
      case "totalPrice": {
        if (item?.orderService === "buy_vps") {
          // giảm giá đơn hàng khi mua bằng usdt (10%)
          if (item?.orderBankName.includes("USDT")) {
            let totalReturn;
            totalReturn = convertMoneyVAT(item?.orderProduct[0].price).total_n;
            if (item?.orderProviderId._id === ProviderIDEnum.BuCloud) {
              totalReturn = convertMoneyVAT(item?.orderProduct[0].price, "BuCloud").total_n;
            }
            const total = totalReturn * item.orderProductQuanlity;

            return <p>{total.toFixed(2)} $</p>;
          }
          let totalReturn;
          totalReturn = convertMoneyVAT(item?.orderProduct[0].price).totalReturn_n;
          if (item?.orderProviderId._id === ProviderIDEnum.BuCloud) {
            totalReturn = convertMoneyVAT(item?.orderProduct[0].price, "BuCloud").totalReturn_n;
          }
          const total = totalReturn * item.orderProductQuanlity;

          return <p>{total.toFixed(2)} $</p>;
        }
        // if (!item.orderTotalPriceVATUSD) {
        //   return <p>{convertVnToUsd(item.orderTotalPriceVAT)} $</p>;
        // }
        return <p>{item?.orderTotalPriceVATUSD} $</p>;
      }
      case "orderStatusReview": {
        console.log("item.orderStatusReview: ", item.orderStatusReview);
        if (item?.isDelete) {
          return <p>{renderOrderStatus("delete")}</p>;
        }
        return <p>{renderOrderStatus(item.orderStatusReview)}</p>;
      }

      case "actions": {
        let actions = subAction;

        if (item?.orderStatusReview === "new" && !item?.isDelete) {
          actions = isAdmin || isTroLy ? [...addNewActions, ...subAction] : subAction;
        } else if (item?.orderStatusReview === "accept" && !item?.isDelete) {
          actions = isAdmin || isLeader ? [...subAction, ...upBill] : subAction;
        } else if (item?.isDelete) {
          actions = subAction.filter((action: any) => action.order !== 4);
        }

        return (
          <div className="flex justify-center gap-2">
            <ActionsCell disableDelete={true} disableUpdate={true} actionsAdd={actions} />
          </div>
        );
      }

      default:
        return cellValue;
    }
  };

  const handleValueChange = (value: any, key: string) => {
    if (key === "search") {
      setSearchByContent(value);
    }
    if (key === "status") {
      setStatusFilter(value);
    }

    if (key === "team") {
      setTeamSelected(value);
    }
    if (key === "providerSelected") {
      setProviderSelected(value);
    }
    if (key === "dateRange") {
      setDateRange(value);
    }
    if (key === "orderService") {
      setOrderService(value);
    }
    resetPageIndex();
  };

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "order",
        pageIndex: 1,
      }),
    );
  };

  return (
    <Access subject={SubjectEnum.TRANSACTION} action={ActionEnum.READ}>
      <div className="mt-2">
        <Container className="flex gap-2 my-2">
          <div className="flex gap-4 justify-between w-full">
            <div className="flex gap-4">
              <Input
                isClearable
                variant="bordered"
                radius="sm"
                className="max-w-xs"
                classNames={{
                  inputWrapper:
                    "bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
                  input: "font-medium",
                }}
                placeholder="Tìm kiếm mã hóa đơn"
                startContent={<BiSearch className="text-black" />}
                value={searchByContent}
                onClear={onClear}
                onValueChange={(value) => handleValueChange(value, "search")}
              />
              <DateRangePicker
                aria-label={"ngày giao dịch"}
                calendarProps={{
                  className: "!w-full !max-w-full",
                  content: "!w-full !max-w-full",
                }}
                id="nextui-date-range-picker"
                radius="sm"
                variant={"bordered"}
                classNames={{
                  inputWrapper: "border p-2 rounded-lg",
                }}
                // label="Ngày giao dịch"
                // labelPlacement={"inside"}
                startContent={
                  dateRange && (
                    <Button
                      className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
                      variant="solid"
                      color="danger"
                      onPress={() => handleValueChange(null, "dateRange")}
                    >
                      <IoIosClose className="text-xl min-w-max" />
                    </Button>
                  )
                }
                value={dateRange}
                onChange={(value) => handleValueChange(value, "dateRange")}
              />
              <Autocomplete
                aria-label={"Loại giao dịch"}
                defaultItems={orderServiceList}
                placeholder="Loại giao dịch"
                radius="sm"
                variant="bordered"
                inputProps={initPropsAutoComplete}
                classNames={classNamesAutoComplete}
                selectedKey={orderService}
                onSelectionChange={(value) => handleValueChange(value, "orderService")}
              >
                {(item: any) => <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>}
              </Autocomplete>
              <Autocomplete
                aria-label={"Trạng thái đơn"}
                defaultItems={statusList}
                placeholder="Trạng thái đơn"
                radius="sm"
                variant="bordered"
                inputProps={initPropsAutoComplete}
                classNames={classNamesAutoComplete}
                selectedKey={statusFilter}
                onSelectionChange={(value) => handleValueChange(value, "status")}
              >
                {(item: any) => <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>}
              </Autocomplete>

              <Autocomplete
                aria-label={"Nhà cung cấp"}
                defaultItems={listProvider}
                placeholder="Nhà cung cấp"
                radius="sm"
                variant="bordered"
                inputProps={initPropsAutoComplete}
                classNames={classNamesAutoComplete}
                selectedKey={providerSelected}
                onSelectionChange={(value) => handleValueChange(value, "providerSelected")}
              >
                {(item: any) => <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>}
              </Autocomplete>

              {/* Filter By Team */}
              <div className="w-full">
                <Autocomplete
                  aria-label={"Team"}
                  defaultItems={teams}
                  placeholder="Team"
                  radius="sm"
                  variant="bordered"
                  inputProps={initPropsAutoComplete}
                  classNames={classNamesAutoComplete}
                  selectedKey={teamSelected}
                  onSelectionChange={(value) => handleValueChange(value, "team")}
                >
                  {(item) => <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>}
                </Autocomplete>
              </div>
            </div>
          </div>
        </Container>

        {/* Table Component with Pagination */}
        <Container>
          <div className="flex justify-between">
            <div className=" flex gap-4">
              <h2 className="text-xl font-bold text-black capitalize my-4">Quản lý đơn hàng</h2>
              <Chip
                variant="solid"
                color="primary"
                radius="sm"
                className="my-auto"
                classNames={{
                  content: "tracking-wide font-medium",
                }}
              >
                Tổng: {total}
              </Chip>
              <Chip
                variant="solid"
                color="danger"
                radius="sm"
                className="my-auto"
                classNames={{
                  content: "tracking-wide font-medium",
                }}
              >
                Tổng tiền: {totalPrice} $
              </Chip>
            </div>
            {isAdmin || isTroLy ? (
              <Button color="primary" radius="sm" onPress={onUpdateExChange}>
                Cập nhật tỉ giá
              </Button>
            ) : (
              <></>
            )}
          </div>
          <TableControl
            tableId={"order"}
            columns={columns}
            data={listOrder}
            total={total}
            isLoading={isLoadingUpdate}
            renderCell={renderCell}
          />
        </Container>
      </div>
      <ModalDetailOrder
        itemOrder={orderDetail}
        isOpenModalDetail={isOpenModalDetail}
        onOpenChangeDetail={setIsOpenModalDetail}
        setOrderDetail={setOrderDetail}
      />
      {/* isOpenModalConfirm, setIsOpenModalConfirm */}
      <ModalConfirm
        data={dataModalConfirm}
        isOpenModal={isOpenModalConfirm}
        opOpenchange={setIsOpenModalConfirm}
        handleConfirm={funcConfirm}
      />
      <ModalUploadBill
        data={dataModalConfirm}
        isOpenModal={isOpenModalUpload}
        opOpenchange={(value: boolean) => {
          if (!value) {
            setFiles([]);
          }

          setIsOpenModalUpload(value);
        }}
        handleConfirm={handleUploadBill}
        files={files}
        setFiles={setFiles}
        existingFiles={existingFiles}
        setExistingFiles={setExistingFiles}
        urlBill={itemOrder.urlBill}
      />
    </Access>
  );
}

export default Order;
