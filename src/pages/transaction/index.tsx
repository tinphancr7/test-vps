import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/stores";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import {
  Button,
  DateRangePicker,
  Select,
  SelectItem,
  SelectSection,
  Snippet,
  Tooltip,
} from "@heroui/react";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import {
  getListProvider,
  getListTransaction,
  setQueryTransaction,
} from "@/stores/slices/transaction.slice";
import { IoIosClose } from "react-icons/io";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import moment from "moment";
import ExportExcelTransaction from "./components/ExportExcelTransaction";

function TransactionHistory() {
  const dispatch = useDispatch<AppDispatch>();
  // Update search input and reset pagination on change
  const { listTransaction, total } = useAppSelector((state) => state.transaction);
  const transactionHistoryTable = useAppSelector((state) => state.table["transactionHistory"]);
  const { teams } = useAppSelector((state) => state.teams);
  const { listProvider } = useAppSelector((state) => state.transaction);

  const [teamSelected, setTeamSelected] = useState<any>(new Set([]));
  const [searchByContent, setSearchByContent] = useState<string>("");
  const [providerSelected, setProviderSelected] = useState<any>(new Set([]));
  const [typeTransaction, setTypeTransaction] = useState<any>(new Set([]));
  const [dateRange, setDateRange] = useState<any>(null);

  const typeTransactionList = [
    { _id: "add_credit", name: "Nạp tiền" },
    { _id: "renew_vps", name: "Gia hạn VPS" },
    { _id: "buy_vps", name: "Mua mới VPS" },
  ];
  const searchMatch = useDebounce(searchByContent, 500);
  const columns = [
    { _id: "dateTransaction", name: "Thời gian", className: "w-[10%] " },
    {
      _id: "provider",
      name: "Nhà cung cấp",
      className: "w-[10%]",
    },
    { _id: "team", name: "Team", className: "w-[10%] " },
    { _id: "amoutTransactionIn", name: "Số tiền vào", className: "w-[10%] " },
    { _id: "amoutTransactionOut", name: "Số tiền thanh toán", className: "w-[10%] " },
    { _id: "typeTransaction", name: "Loại giao dịch", className: "w-[10%] " },

    // {
    //   _id: "contentTransaction",
    //   name: "Nội dung chuyển khoản",
    //   className: "w-[30%] ",
    // },
    { _id: "runningBalance", name: "Số dư", className: "w-[10%] " },
  ];
  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }

    if (teamSelected) {
      query["team"] = [...teamSelected];
    }

    if (dateRange) {
      query["dateRange"] = dateRange;
    }
    if (providerSelected) {
      query["providerSelected"] = [...providerSelected];
    }
    if (typeTransaction) {
      query["typeTransaction"] = [...typeTransaction];
    }
    if (transactionHistoryTable) {
      const cPageSize = transactionHistoryTable?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...transactionHistoryTable?.pageSize][0]
        : 10;

      query["pageIndex"] = transactionHistoryTable?.pageIndex || 1;
      query["pageSize"] = cPageSize;
    }
    dispatch(getListTransaction(query));
    dispatch(setQueryTransaction(query));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    transactionHistoryTable,
    teamSelected,
    searchMatch,
    providerSelected,
    dateRange,
    typeTransaction,
  ]);

  useEffect(() => {
    if (!teams?.length) {
      dispatch(asyncThunkGetAllYourTeam());
    }
    if (!listProvider?.length) {
      dispatch(getListProvider());
    }
    return () => {};
  }, []);

  // const onClear = () => {
  //   setSearchByContent("");
  //   dispatch(
  //     setTablePageIndex({
  //       tableId: "transactionHistory",
  //       pageIndex: 1,
  //     })
  //   );
  // };

  // Fetch logs based on filters, pagination, and search
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "provider": {
        return <p>{item.providerId.name}</p>;
      }
      case "team": {
        return <p>{item.teamId.name}</p>;
      }
      case "amoutTransactionIn": {
        if (item.typeTransaction === "add_credit") {
          return <p>{convertVnToUsd(item.amountTransaction)} $</p>;
        }
        if (item.typeTransaction === "add_credit_USDT") {
          return <p>{item.amountTransaction} USDT</p>;
        }
        break;
      }
      case "amoutTransactionOut": {
        if (item.typeTransaction === "renew_vps" || item.typeTransaction === "buy_vps") {
          return <p>{convertVnToUsd(item.amountTransaction)} $</p>;
        }
        break;
      }
      case "runningBalance": {
        return <p>{convertVnToUsd(item.runningBalance)} $</p>;
      }
      case "typeTransaction": {
        if (item.typeTransaction === "renew_vps") {
          return (
            <>
              <p>Gia hạn VPS</p>
              {item?.productInfo && (
                <p>
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
                    <strong>{item?.productInfo?.ip}</strong>
                  </Snippet>
                </p>
              )}
            </>
          );
        }
        if (item.typeTransaction === "buy_vps") {
          return <p>Mua mới VPS</p>;
        }
        return <p>Nạp tiền</p>;
      }
      case "dateTransaction": {
        return <p>{moment(item.dateTransaction).format("DD-MM-YYYY HH:mm:ss")} </p>;
      }
      case "contentTransaction": {
        return (
          <Tooltip
            content={<div className="w-[320px] h-full">{item.contentTransaction}</div>}
            className={`capitaliz`}
          >
            <div className="w-full line-clamp-2  ">{item.contentTransaction}</div>
          </Tooltip>
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

    if (key === "team") {
      setTeamSelected([...value]);
    }
    if (key === "providerSelected") {
      setProviderSelected([...value]);
    }
    if (key === "dateRange") {
      setDateRange(value);
    }
    if (key === "typeTransaction") {
      setTypeTransaction([...value]);
    }
    resetPageIndex();
  };
  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "transactionHistory",
        pageIndex: 1,
      }),
    );
  };
  return (
    <Access subject={SubjectEnum.TRANSACTION} action={ActionEnum.READ}>
      <div className="mt-2">
        <Container className="flex gap-2 my-2">
          <div className="flex gap-4 justify-between w-full">
            {/* <Input
              isClearable
              variant="bordered"
              radius="sm"
              className="max-w-xs"
              classNames={{
                inputWrapper:
                  "bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
                input: "font-medium",
              }}
              placeholder="Tìm kiếm nội dung chuyển khoản"
              startContent={<BiSearch className="text-black" />}
              value={searchByContent}
              onClear={onClear}
              onValueChange={(value) => handleValueChange(value, "search")}
            /> */}
            <div className="flex gap-4">
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
                  base: "min-w-72 w-72",
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
              <Select
                aria-label={"Loại giao dịch"}
                placeholder="Loại giao dịch"
                variant="bordered"
                radius="sm"
                classNames={{ base: "min-w-72 w-72" }}
                onSelectionChange={(value) => {
                  handleValueChange(value, "typeTransaction");
                }}
                selectedKeys={typeTransaction}
                selectionMode="multiple"
              >
                <SelectSection>
                  {typeTransactionList.map((item: any) => {
                    return <SelectItem key={item._id}>{item?.name}</SelectItem>;
                  })}
                </SelectSection>
              </Select>

              <div className="w-full">
                <Select
                  aria-label={"Nhà cung cấp"}
                  placeholder="Nhà cung cấp"
                  variant="bordered"
                  radius="sm"
                  classNames={{ base: "min-w-64 w-64" }}
                  selectedKeys={providerSelected}
                  selectionMode="multiple"
                  onSelectionChange={(value) => handleValueChange(value, "providerSelected")}
                >
                  <SelectSection>
                    {listProvider.map((item: any) => {
                      return <SelectItem key={item._id}>{item?.name}</SelectItem>;
                    })}
                  </SelectSection>
                </Select>
              </div>

              <Select
                aria-label={"Team"}
                placeholder="Team"
                variant="bordered"
                radius="sm"
                classNames={{ base: "min-w-72 w-72" }}
                selectedKeys={teamSelected}
                selectionMode="multiple"
                onSelectionChange={(value) => handleValueChange(value, "team")}
              >
                <SelectSection>
                  {teams.map((item: any) => {
                    return <SelectItem key={item._id}>{item?.name}</SelectItem>;
                  })}
                </SelectSection>
              </Select>

              <ExportExcelTransaction />
            </div>
          </div>
        </Container>

        {/* Table Component with Pagination */}
        <Container>
          <h2 className="text-xl font-bold text-black capitalize my-4">Quản lý giao dịch</h2>
          <TableControl
            tableId={"transactionHistory"}
            columns={columns}
            data={listTransaction}
            total={total}
            renderCell={renderCell}
          />
        </Container>
      </div>
    </Access>
  );
}

export default TransactionHistory;
