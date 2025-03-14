import { useCallback, useEffect, useState } from "react";
import { Button, Chip, Tooltip } from "@heroui/react";
import moment from "moment";
import FilterTable from "@/components/table/FilterTable";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "@/hooks/useDebounce";
import CustomTable from "@/components/table/CustomTable";
import ModalDeleteTeam from "./components/ModalDeleteAccount";
import ModalTeam from "./components/ModalAccount";
import Access from "@/components/Access/access";
import { ActionEnum, ProviderIDEnum, SubjectEnum } from "@/constants/enum";
import { AppDispatch, useAppSelector } from "@/stores";
import { fetchAccount } from "@/stores/slices/account.slice";
import TopFilter from "./components/TopFilter";
import NotifyMessage from "@/utils/notify";
import { addCommas } from "@/utils";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { MdAttachMoney } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { FaRegTrashCan } from "react-icons/fa6";
import { setModal } from "@/stores/slices/modal-slice";
import FormDeposit from "./components/form-deposit";

const columns = [
  // {
  // 	key: "apikey",
  // 	label: "Api key",
  // },
  {
    key: "provider",
    label: "Nhà cung cấp",
  },
  {
    key: "team",
    label: "Team",
  },
  {
    key: "balance",
    label: "Số dư",
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

export default function AccountPage() {
  // Redux dispatch hook
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const [topFilter, setTopFilter] = useState({
    team: "",
    provider: "",
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
    (state: any) => state?.accounts || []
  );

  // Consolidate modal state into a single object
  const [modalState, setModalState] = useState({
    isAddEditOpen: false,
    isDeleteOpen: false,
  });

  // Fetch accounts with pagination, filtering, and search

  const handleFetchAccount = useCallback(
    ({ page, limit, search, topFilter }: any) => {
      const { team, provider, from, to } = topFilter || {};

      // Check if start price is greater than end price
      if (from && to) {
        if (Number(from) > Number(to)) {
          NotifyMessage("Giá bắt đầu không được lớn hơn giá kết thúc", "error");
          return;
        }
      }

      // Dispatch action to fetch invoices
      dispatch(
        fetchAccount({
          page,
          limit,
          search,
          team:
            user?.role?.name.toLowerCase() === "leader" && !team
              ? user?.team?.join(",")
              : team,
          provider,
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
      provider: "",
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

  const handleOpenModalDeposit = (account: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: (
          <div className="flex gap-2">
            <p>Nạp tiền:</p>
            <Chip variant="flat" color="primary" radius="sm">
              {account?.team?.name}
            </Chip>
          </div>
        ),
        body: <FormDeposit account={account} />,
      })
    );
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

      case "balance":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">
              {item?.provider?.name === "Digital Ocean"
                ? `${cellValue}`
                : addCommas(convertVnToUsd(cellValue, item?.provider?.name)) ||
                  0}{" "}
              $
            </p>
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
            {/* Deposit */}
            {item?.provider?._id !== ProviderIDEnum.DIGITAL_OCEAN && (
              <Tooltip
                color="warning"
                content={"Nạp tiền"}
                className={`capitalize text-light`}
              >
                <Button
                  color="warning"
                  variant="solid"
                  radius="full"
                  className={`min-w-0 w-max p-1 h-max min-h-max`}
                  onPress={() => handleOpenModalDeposit(item)}
                >
                  <MdAttachMoney className="min-w-max text-base w-5 h-5 text-light" />
                </Button>
              </Tooltip>
            )}

            {/* Edit Action */}
            <Access
              subject={SubjectEnum.ACCOUNTVPS}
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
              subject={SubjectEnum.ACCOUNTVPS}
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
    <Access subject={SubjectEnum.ACCOUNTVPS} action={ActionEnum.READ}>
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
