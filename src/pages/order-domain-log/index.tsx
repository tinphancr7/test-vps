import Access from "@/components/Access/access";
import CustomTable from "@/components/table/CustomTable";
import FilterTable from "@/components/table/FilterTable";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { useDebounce } from "@/hooks/useDebounce";
import { AppDispatch, useAppSelector } from "@/stores";

import { Chip } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import domainProviderApi from "@/apis/domain-provider";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { fetchAllOrderDomainLog } from "@/stores/slices/order-domain-log.slice";
import NotifyMessage from "@/utils/notify";
import moment from "moment";
import { toast } from "react-toastify";
import ModalAddEditDomainProvider from "./components/ModalAddEditDomainProvider";
import TopFilter from "./components/TopFilter";

const columns = [
  {
    key: "name",
    label: "Nội dung Log",
  },
  {
    key: "orderCode",
    label: "Mã đơn hàng",
  },

  {
    key: "status",
    label: "Trạng thái",
  },
  {
    key: "createdBy",
    label: "Tài khoản thao tác",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
  },
];

const orderCodeStatus = (code) => {
  switch (code) {
    case "SEO_CREATE_ORDER":
      return "secondary";
    case "ASYNC_ORDER":
      return "warning";
    case "DONE_ORDER":
      return "success";
    case "CREATE_ORDER":
      return "primary";
    case "CANCEL_ORDER":
      return "danger";
    default:
      return "default";
  }
};

export default function OrderDomainLogPage() {
  // Redux dispatch hook
  const dispatch = useDispatch<AppDispatch>();
  const { result, meta, isLoading } = useAppSelector((state) => state.orderDomainLog);

  const [topFilter, setTopFilter] = useState({
    order: "",
    status: "",
    users: [],
  });

  // States for managing selection, filter, pagination, and modal visibility
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  // Debounce the search input for performance optimization
  const searchMatch = useDebounce(filterValue, 500);

  // Fetch accounts with pagination, filtering, and search

  const handleFetchDomainProvider = useCallback(
    ({ page, limit, search, topFilter }: any) => {
      const { order, status, users } = topFilter || {};

      const user = users?.length > 0 ? users?.map((item: any) => item.value).join(",") : "";

      // Dispatch action to fetch invoices
      dispatch(
        fetchAllOrderDomainLog({
          page,
          limit,
          search,
          order,
          status,
          user,
        }),
      );
    },
    [dispatch],
  );
  const handleChangePage = (page: number) => {
    handleFetchDomainProvider({
      page,
      limit: rowsPerPage,
      search: searchMatch,
      topFilter,
    });
    setPage(page);
  };

  // Automatically fetch accounts when page, rows per page, or search changes
  useEffect(() => {
    handleFetchDomainProvider({
      page: 1,
      limit: rowsPerPage,
      search: searchMatch,
    });
  }, [rowsPerPage, searchMatch]);

  // Handle search input change
  const onSearchChange = useCallback((value: any) => {
    setFilterValue(value || "");
    setPage(1); // Reset to the first page when search changes
  }, []);

  // Clear search input
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1); // Reset to the first page after clearing
  }, []);

  // Update top filters and reset pagination
  const handleChangeTopFilter = (key: string, value: any) => {
    setTopFilter((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all top filters
  const handleClearTopFilter = () => {
    console.log("clear");
    setTopFilter({
      order: "",
      status: "",
      users: [],
    });
  };

  const handleClickTopFilter = () => {
    handleFetchDomainProvider({
      page: 1,
      limit: rowsPerPage,
      search: searchMatch,
      topFilter,
    });
    setPage(1);
  };

  // Render the appropriate cell content based on the column key
  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return <div className="flex items-center justify-center">{cellValue}</div>;
      case "orderCode":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">{cellValue}</p>
          </div>
        );

      case "status":
        return (
          <Chip
            radius="sm"
            color={orderCodeStatus(cellValue?.code)}
            variant="dot"
            classNames={{
              base: "h-auto border-none",
              content: "font-semibold tracking-wider py-1 items-center gap-2 flex",
              dot: "w-3 h-3",
            }}
          >
            {cellValue?.name}
          </Chip>
        );

      case "createdBy":
        return <div className="flex items-center justify-center">{cellValue?.name}</div>;

      case "createdAt":
        return (
          <div className="flex items-center justify-center">
            {moment(cellValue).format("DD/MM/YYYY HH:mm:ss")}
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <Access subject={SubjectEnum.ACCOUNTVPS} action={ActionEnum.READ}>
      <div>
        {/* FilterTable handles filtering and search */}
        <FilterTable
          filterValue={filterValue}
          onSearchChange={onSearchChange}
          onClear={onClear}
          onOpenAddEdit={() => {}}
          selectedKeys={selectedKeys}
          subject={SubjectEnum.ACCOUNTVPS}
          actionCreate={ActionEnum.CREATE}
          actionDelete={ActionEnum.DELETE}
          extra={
            <TopFilter
              topFilter={topFilter}
              onChangeTopFilter={handleChangeTopFilter}
              onClearTopFilter={handleClearTopFilter}
              onClickTopFilter={handleClickTopFilter}
            />
          }
          isShow={false}
        />
        {/* CustomTable renders paginated team data */}
        <CustomTable
          data={result}
          columns={columns}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          renderCell={renderCell}
          page={page}
          setPage={setPage}
          onChangePage={handleChangePage}
          meta={meta}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          isLoading={isLoading}
          title="Danh sách log đơn hàng"
        />
      </div>
    </Access>
  );
}
