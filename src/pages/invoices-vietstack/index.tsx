import { useCallback, useEffect, useState } from "react";

import moment from "moment";

import FilterTable from "@/components/table/FilterTable";

import { useDispatch, useSelector } from "react-redux";

import { useDebounce } from "@/hooks/useDebounce";
import CustomTable from "@/components/table/CustomTable";

import { AppDispatch, useAppSelector } from "@/stores";

import NotifyMessage from "@/utils/notify";
import { fetchInvoice } from "@/stores/slices/invoice.slice";
import { addCommas } from "@/utils";

import { convertVnToUsd } from "@/utils/vn-to-usd";
import TopFilter from "./components/TopFilter";
import invoiceApi from "@/apis/invoice.api";
import Access from "@/components/Access/access";
import { ActionEnum, ProviderIDEnum, SubjectEnum } from "@/constants/enum";
import { exchangeRateVST } from "@/constants";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "@heroui/react";

import { FaFileInvoiceDollar } from "react-icons/fa6";
import paths from "@/routes/paths";
import ExportExcelInvoiceVST from "./components/ExportExcelInvoiceVST";

const columns = [
  {
    key: "invoice_id",
    label: "Mã hóa đơn",
  },

  // {
  // 	key: "ip",
  // 	label: "IP",
  // },
  {
    key: "team",
    label: "Team",
  },

  {
    key: "price",
    label: "Giá",
  },
  {
    key: "provider",
    label: "Nhà cung cấp",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
  },
  {
    key: "action",
    label: "Hành động",
  },
];

export default function InvoicesVietStack() {
  const [provider, setProvider] = useState<any>({});

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  // States for table selection and filters
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const [topFilter, setTopFilter] = useState({
    time: null,
    team: "",
    from: "",
    to: "",
  });

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  // Debounce search input to optimize performance
  const searchMatch = useDebounce(filterValue, 500);
  const { result, meta, isLoading } = useSelector(
    (state: any) => state?.invoices || []
  );

  // Fetch logs based on filters, pagination, and search
  const handleFetchInvoice = useCallback(
    ({ page, limit, search, provider, topFilter }: any) => {
      const { time, from, to, team } = topFilter || {};
      let startDate = null;
      let endDate = null;

      // Parse start and end date if time filter is applied
      if (time) {
        startDate = moment(time.start?.toDate()).startOf("day").toISOString();
        endDate = moment(time.end?.toDate()).endOf("day").toISOString();
      }
      // Check if start price is greater than end price
      if (from && to) {
        if (Number(from) > Number(to)) {
          NotifyMessage("Giá bắt đầu không được lớn hơn giá kết thúc", "error");
          return;
        }
      }

      // Dispatch action to fetch invoices
      dispatch(
        fetchInvoice({
          page,
          limit,
          search,
          startDate,
          endDate,
          provider,
          from: from ? Number(from) * exchangeRateVST : from,
          to: to ? Number(to) * exchangeRateVST : to,
          team:
            user?.role?.name?.toLowerCase() === "leader" && !team
              ? user?.team?.join(",")
              : team,
        })
      );
    },
    [dispatch]
  );

  // Trigger fetch logs when page, rowsPerPage, searchMatch, or topFilter changes
  useEffect(() => {
    if (provider?._id) {
      handleFetchInvoice({
        page: 1,
        limit: rowsPerPage,
        search: searchMatch,
        provider: provider?._id,
      });
    }
  }, [
    rowsPerPage,
    searchMatch,
    provider?._id,
    handleFetchInvoice,
    topFilter,
    user,
  ]);

  const handleClickTopFilter = () => {
    handleFetchInvoice({
      page: 1,
      limit: rowsPerPage,
      search: searchMatch,
      topFilter,
      provider: provider?._id,
    });
    setPage(1);
  };

  // Update search input and reset pagination on change
  const onSearchChange = useCallback((value: any) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  // Clear search input and reset pagination
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleChangePage = (page: number) => {
    handleFetchInvoice({
      page,
      limit: rowsPerPage,
      search: searchMatch,
      topFilter,
      provider: provider?._id,
    });
    setPage(page);
  };
  // Function to render table cell content based on columnKey
  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "invoice_id":
        return <p className="text-bold text-black">{cellValue}</p>;
      case "ip":
        return <p className="text-bold text-black">{cellValue}</p>;
      case "team":
        return <p className="text-bold text-black">{cellValue?.name}</p>;
      case "price":
        return (
          <p className="text-bold text-black">
            {addCommas(convertVnToUsd(cellValue) || "") || 0} $
          </p>
        );

      case "provider":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">{cellValue?.name}</p>
          </div>
        );
      case "createdAt":
        return (
          <p className="text-bold text-black">
            {moment(cellValue).format("DD/MM/YYYY HH:mm")}
          </p>
        );
      case "action":
        return (
          <div className="relative flex items-center justify-center gap-4">
            {/* Edit Action */}
            <Tooltip
              content={"Hóa đơn"}
              color="warning"
              className={`capitalize text-white`}
            >
              <Button
                variant="solid"
                radius="full"
                color="warning"
                className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                onClick={() =>
                  navigate(paths.invoices_vietstack_detail, {
                    state: { id: item?.invoice_id },
                    replace: true,
                  })
                }
              >
                <FaFileInvoiceDollar className="text-white" size={16} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  // Update top filters and reset pagination
  const handleChangeTopFilter = (key: string, value: any) => {
    setTopFilter((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all top filters
  const handleClearTopFilter = () => {
    setTopFilter({
      time: null,
      team: "",
      from: "",
      to: "",
    });
  };

  useEffect(() => {
    // Fetch providers
    const fetchProvider = async () => {
      const response = await invoiceApi.callFetchProvider({
        search: "",
        page: 1,
        limit: 100,
      });

      if (response?.data?.data?.data?.length > 0) {
        const objData = response?.data?.data?.data?.find((item: any) => {
          return item._id === ProviderIDEnum.VIET_STACK;
        });
        setProvider(objData);
      }
    };
    fetchProvider();
  }, []);
  // const handlePrintInvoice = () => {
  //   const ids =
  //     //@ts-ignore
  //     selectedKeys === "all"
  //       ? result.map((item: any) => item._id)
  //       : [...selectedKeys];

  //   const invoiceIds = result
  //     .filter((item: any) => ids.includes(item._id))
  //     .map((it: any) => it.invoice_id)
  //     .join("-");
  //   navigate(paths.invoices_vietstack_detail, {
  //     state: { id: invoiceIds },
  //     replace: true,
  //   });
  // };
  return (
    <Access subject={SubjectEnum.INVOICE} action={ActionEnum.READ}>
      <div>
        {/* Search and Filter Table */}
        <FilterTable
          filterValue={filterValue}
          onSearchChange={onSearchChange}
          onClear={onClear}
          selectedKeys={selectedKeys}
          extra={
            <TopFilter
              topFilter={topFilter}
              onChangeTopFilter={handleChangeTopFilter}
              onClearTopFilter={handleClearTopFilter}
              onClickTopFilter={handleClickTopFilter}
            />
          }
          btnInvoice={
            <ExportExcelInvoiceVST
              dataInvoice={{
                search: searchMatch,
                ...topFilter,
                provider: provider?._id,
              }}
            />
            // <Button
            //   className={`${
            //     [...selectedKeys].length === 0 ? "bg-gray-300" : "bg-red-600"
            //   } text-white`}
            //   onClick={handlePrintInvoice}
            // >
            //   In hóa đơn
            // </Button>
          }
          isShow={false}
        />

        {/* Table Component with Pagination */}
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
          title="Danh sách hóa đơn Cloud 01"
        />
      </div>
    </Access>
  );
}
