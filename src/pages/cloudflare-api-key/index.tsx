import { useCallback, useEffect, useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import moment from "moment";
import FilterTable from "@/components/table/FilterTable";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "@/hooks/useDebounce";
import CustomTable from "@/components/table/CustomTable";
import ModalDeleteTeam from "./components/ModalDeleteCloudflareApiKey";
import ModalTeam from "./components/ModalCloudflareApiKey";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { AppDispatch, useAppSelector } from "@/stores";
import TopFilter from "./components/TopFilter";
import NotifyMessage from "@/utils/notify";

import { LiaEditSolid } from "react-icons/lia";
import { FaRegTrashCan } from "react-icons/fa6";
import { fetchCloudflareApiKey } from "@/stores/slices/cloudflare-api-key.slice";

const columns = [
  {
    key: "team",
    label: "Team",
  },
  {
    key: "email",
    label: "Địa chỉ email",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
  },
  {
    key: "actions",
    label: "Hành động",
  },
];

export default function CloudflareApiKeyPage() {
  // Redux dispatch hook
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const [topFilter, setTopFilter] = useState({
    team: "",
    from: "",
    to: "",
  });

  // States for managing selection, filter, pagination, and modal visibility
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [dataInit, setDataInit] = useState(null); // Data for editing
  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  // Debounce the search input for performance optimization
  const searchMatch = useDebounce(filterValue, 500);

  // Fetching accounts from the Redux store
  const { result, meta, isLoading } = useSelector(
    (state: any) => state?.cloudflareApiKey || []
  );

  // Consolidate modal state into a single object
  const [modalState, setModalState] = useState({
    isAddEditOpen: false,
    isDeleteOpen: false,
  });

  // Fetch accounts with pagination, filtering, and search

  const handleFetchAccount = useCallback(
    ({ page, limit, search, topFilter }: any) => {
      const { team, from, to } = topFilter || {};

      // Check if start price is greater than end price
      if (from && to) {
        if (Number(from) > Number(to)) {
          NotifyMessage("Giá bắt đầu không được lớn hơn giá kết thúc", "error");
          return;
        }
      }

      // Dispatch action to fetch invoices
      dispatch(
        fetchCloudflareApiKey({
          page,
          limit,
          search,
          team:
            user?.role?.name.toLowerCase() === "leader" && !team
              ? user?.team?.join(",")
              : team,
          from,
          to,
        })
      );
    },
    [dispatch]
  );
  const handleChangePage = (page: number) => {
    handleFetchAccount({
      page,
      limit: rowsPerPage,
      search: searchMatch,
      topFilter,
    });
    setPage(page);
  };

  // Automatically fetch accounts when page, rows per page, or search changes
  useEffect(() => {
    handleFetchAccount({
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
    setTopFilter({
      team: "",
      from: "",
      to: "",
    });
  };

  const handleClickTopFilter = () => {
    handleFetchAccount({
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
      // case "apikey":
      // 	return (
      // 		<div className="text-bold text-black line-clamp-1 w-[400px] ">
      // 			{cellValue} ...
      // 		</div>
      // 	);

      case "provider":
        return (
          <div className="flex items-center justify-center">
            {cellValue?.name}
          </div>
        );
      case "team":
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

      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-4">
            {/* Edit Action */}
            <Access
              subject={SubjectEnum.CLOUDFLARE_API_KEY}
              action={ActionEnum.UPDATE}
              hideChildren
            >
              <Tooltip
                content={"Chỉnh sửa"}
                className={`capitalize bg-primaryDf text-light`}
              >
                <Button
                  variant="solid"
                  radius="full"
                  className={`bg-primaryDf min-w-0 w-max p-[6px] h-max min-h-max`}
                  onPress={() => {
                    setDataInit(item);
                    setModalState((prev) => ({
                      ...prev,
                      isAddEditOpen: true,
                    }));
                  }}
                >
                  <LiaEditSolid className="min-w-max text-base w-4 h-4 text-light" />
                </Button>
              </Tooltip>
            </Access>
            {/* Delete Action */}
            <Access
              subject={SubjectEnum.CLOUDFLARE_API_KEY}
              action={ActionEnum.DELETE}
              hideChildren
            >
              <Tooltip
                color="danger"
                content={"Xóa"}
                className={`capitalize text-light`}
              >
                <Button
                  color="danger"
                  variant="solid"
                  radius="full"
                  className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                  onPress={() => {
                    setSelectedKeys(new Set([item._id]));
                    setModalState((prev) => ({
                      ...prev,
                      isDeleteOpen: true,
                    }));
                  }}
                >
                  <FaRegTrashCan className="min-w-max text-base w-4 h-4 text-light" />
                </Button>
              </Tooltip>
            </Access>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <Access subject={SubjectEnum.CLOUDFLARE_API_KEY} action={ActionEnum.READ}>
      <div>
        {/* FilterTable handles filtering and search */}
        <FilterTable
          filterValue={filterValue}
          onSearchChange={onSearchChange}
          onClear={onClear}
          onOpenAddEdit={() =>
            setModalState((prev) => ({
              ...prev,
              isAddEditOpen: true,
            }))
          }
          onOpenDelete={() =>
            setModalState((prev) => ({
              ...prev,
              isDeleteOpen: true,
            }))
          }
          selectedKeys={selectedKeys}
          subject={SubjectEnum.CLOUDFLARE_API_KEY}
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
          title="Danh sách tài khoản"
        />

        {/* Add/Edit Modal */}
        {modalState.isAddEditOpen && (
          <ModalTeam
            dataInit={dataInit}
            isOpen={modalState.isAddEditOpen}
            onClose={() =>
              setModalState((prev) => ({
                ...prev,
                isAddEditOpen: false,
              }))
            }
            setDataInit={setDataInit}
            reloadTable={() =>
              handleFetchAccount({
                page: 1,
                limit: rowsPerPage,
                search: "",
                topFilter,
              })
            }
          />
        )}

        {/* Delete Modal */}
        {modalState.isDeleteOpen && (
          <ModalDeleteTeam
            isOpen={modalState.isDeleteOpen}
            onClose={() =>
              setModalState((prev) => ({
                ...prev,
                isDeleteOpen: false,
              }))
            }
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            reloadTable={() => handleFetchAccount({ page, limit: rowsPerPage })}
          />
        )}
      </div>
    </Access>
  );
}
