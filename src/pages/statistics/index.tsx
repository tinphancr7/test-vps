import { useCallback, useEffect, useState } from "react";

import moment from "moment";

import FilterTable from "@/components/table/FilterTable";

import { useDispatch, useSelector } from "react-redux";

import { useDebounce } from "@/hooks/useDebounce";
import CustomTable from "@/components/table/CustomTable";

import TopFilter from "./components/TopFilter";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import Access from "@/components/Access/access";
import { AppDispatch, useAppSelector } from "@/stores";

import { addCommas } from "@/utils";
import { fetchStatistic } from "@/stores/slices/statistic.slice";

const columns = [
  {
    key: "team",
    label: "Team",
  },

  {
    key: "digital_ocean",
    label: "Digital Ocean",
  },
  {
    key: "vietstack",
    label: "Cloud 01",
  },
  {
    key: "vng",
    label: "Cloud 02",
  },
  {
    key: "vietserver",
    label: "Cloud 03",
  },
  {
    key: "bucloud",
    label: "Cloud 05",
  },
  // {
  //   key: "bucloud",
  //   label: "BuCloud",
  // },
  {
    key: "totalAmount",
    label: "Tổng tiền",
  },
];

export default function StatisticPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  // States for table selection and filters
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const [topFilter, setTopFilter] = useState({
    time: null,
    team: null,
  });

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  // Debounce search input to optimize performance
  const searchMatch = useDebounce(filterValue, 500);
  const { result, meta, isLoading } = useSelector(
    (state: any) => state?.statistics || []
  );

  // Fetch logs based on filters, pagination, and search
  const handleFetchStatistic = useCallback(
    ({ page, limit, search, topFilter }: any) => {
      const { time, team } = topFilter || {};
      let startDate = null;
      let endDate = null;

      // Parse start and end date if time filter is applied
      if (time) {
        startDate = moment(time.start?.toDate()).startOf("day").toISOString();
        endDate = moment(time.end?.toDate()).endOf("day").toISOString();
      }

      // Dispatch action to fetch invoices
      dispatch(
        fetchStatistic({
          pageIndex: page,
          pageSize: limit,
          search,
          startDate,
          endDate,
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
    handleFetchStatistic({
      page,
      limit: rowsPerPage,
      search: searchMatch,
    });
  }, [page, rowsPerPage, searchMatch, handleFetchStatistic]);

  const handleClickTopFilter = () => {
    handleFetchStatistic({
      page: 1,
      limit: rowsPerPage,
      search: searchMatch,
      topFilter,
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
    handleFetchStatistic({
      page,
      limit: rowsPerPage,
      search: searchMatch,
      topFilter,
    });
    setPage(page);
  };
  // Function to render table cell content based on columnKey
  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "team":
        return <p className="text-bold text-black">{cellValue}</p>;
      case "digital_ocean":
        return (
          <p className="text-bold text-black">
            {addCommas(Number(cellValue?.toFixed(2)) || "0") || 0} $
          </p>
        );
      case "vng":
        return (
          <p className="text-bold text-black">
            {addCommas(Number(cellValue?.toFixed(2)) || "0") || 0}
            {""} $
          </p>
        );

      case "vietstack":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">
              {addCommas(Number(cellValue?.toFixed(2)) || "0") || 0} $
            </p>
          </div>
        );
      case "vietserver":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">
              {addCommas(Number(cellValue?.toFixed(2)) || "0") || 0} $
            </p>
          </div>
        );
      case "bucloud":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">
              {addCommas(Number(cellValue?.toFixed(2)) || "0") || 0} $
            </p>
          </div>
        );
      case "totalAmount":
        return (
          <p className="text-bold text-black">
            {addCommas(Number(cellValue.toFixed(2)) || "0") || 0} $
          </p>
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
      team: null,
    });
  };
  return (
    <Access subject={SubjectEnum.STATISTICS} action={ActionEnum.READ}>
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
          isShow={false}
        />

        {/* Table Component with Pagination */}
        <CustomTable
          data={result || []}
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
          title="Danh sách thống kê"
        />
      </div>
    </Access>
  );
}
