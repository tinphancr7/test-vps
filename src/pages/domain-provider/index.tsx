import Access from "@/components/Access/access";
import CustomTable from "@/components/table/CustomTable";
import FilterTable from "@/components/table/FilterTable";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { useDebounce } from "@/hooks/useDebounce";
import { AppDispatch, useAppSelector } from "@/stores";

import { addCommas } from "@/utils";
import { Button, Chip, Tooltip } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { LiaEditSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";

import domainProviderApi from "@/apis/domain-provider";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { fetchAllDomainProvider } from "@/stores/slices/domain-provider.slice";
import NotifyMessage from "@/utils/notify";
import { toast } from "react-toastify";
import ModalAddEditDomainProvider from "./components/ModalAddEditDomainProvider";
import TopFilter from "./components/TopFilter";

const columns = [
  {
    key: "title",
    label: "Tên kết nối",
  },
  {
    key: "name",
    label: "Nhà cung cấp",
  },
  // {
  //   key: "apiKey",
  //   label: "API Key",
  // },
  // {
  //   key: "secret",
  //   label: "Secret",
  // },
  {
    key: "username",
    label: "username",
  },
  {
    key: "clientIp",
    label: "client Ip",
  },
  {
    key: "teams",
    label: "team",
  },
  {
    key: "exchangeRate",
    label: "Tỷ giá",
  },
  {
    key: "balance",
    label: "Số dư",
  },
  {
    key: "currency",
    label: "Loại tiền",
  },
  {
    key: "isOpen",
    label: "Trạng thái",
  },

  {
    key: "actions",
    label: "Hành động",
  },
];

export default function DomainProviderPage() {
  // Redux dispatch hook
  const dispatch = useDispatch<AppDispatch>();
  const { result, meta, isLoading } = useAppSelector((state) => state.domainProvider);
  const [topFilter, setTopFilter] = useState({
    team: "",
    provider: "",
  });

  // States for managing selection, filter, pagination, and modal visibility
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  // Debounce the search input for performance optimization
  const searchMatch = useDebounce(filterValue, 500);

  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: "",
  });

  const [openDeleteDomainProvider, setOpenDeleteDomainProvider] = useState({
    open: false,
    id: "",
  });
  // Fetch accounts with pagination, filtering, and search

  const handleFetchDomainProvider = useCallback(
    ({ page, limit, search, topFilter }: any) => {
      const { team, provider } = topFilter || {};

      // Dispatch action to fetch invoices
      dispatch(
        fetchAllDomainProvider({
          page,
          limit,
          search,
          team,
          provider,
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

  const handleCloseConfirmDeleteCoupon = () => {
    setOpenDeleteDomainProvider({
      open: false,
      id: "",
    });
  };

  const handleDeleteCoupon = async () => {
    try {
      const res = await domainProviderApi.callDeleteDomainProvider(openDeleteDomainProvider.id);
      if (res?.data) {
        toast.success("Xóa nhà cung cấp thành công");
        handleCloseConfirmDeleteCoupon();
        handleFetchDomainProvider({
          page: 1,
          limit: rowsPerPage,
          search: searchMatch,
          topFilter,
        });
      } else {
        NotifyMessage("Xóa nhà cung cấp không thành công", "error");
      }
    } catch (error: any) {
      console.log("error", error);
      NotifyMessage(error?.response?.data?.message || "Xóa nhà cung cấp không thành công", "error");
    }
  };
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
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: "",
    });
  };
  // Render the appropriate cell content based on the column key
  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "title":
        return <div className="flex items-center justify-center">{cellValue}</div>;
      case "name":
        return <div className="flex items-center justify-center">{cellValue}</div>;
      case "apiKey":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">{cellValue}</p>
          </div>
        );

      case "teams":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">
              {cellValue?.map((team: any) => team?.name).join(", ")}
            </p>
          </div>
        );

      case "secret":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">{cellValue}</p>
          </div>
        );

      case "exchangeRate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">{cellValue}</p>
          </div>
        );

      case "balance":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-black">{addCommas(cellValue) || 0}$</p>
          </div>
        );

      case "isOpen":
        return (
          <Chip
            radius="sm"
            color={cellValue ? "success" : "danger"}
            variant="dot"
            classNames={{
              base: "h-auto border-none",
              content: "font-semibold tracking-wider py-1 items-center gap-2 flex",
              dot: "w-3 h-3",
            }}
          >
            {cellValue ? "Hoạt động" : "Đóng"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-4">
            {/* Edit Action */}
            <Access subject={SubjectEnum.ACCOUNTVPS} action={ActionEnum.UPDATE} hideChildren>
              <Tooltip content={"Chỉnh sửa"} className={`capitalize bg-primaryDf text-light`}>
                <Button
                  variant="solid"
                  radius="full"
                  className={`bg-primaryDf min-w-0 w-max p-[6px] h-max min-h-max`}
                  onPress={() => setOpenCreateEdit({ open: true, id: item?._id })}
                >
                  <LiaEditSolid className="min-w-max text-base w-4 h-4 text-light" />
                </Button>
              </Tooltip>
            </Access>
            {/* Delete Action */}
            <Access subject={SubjectEnum.ACCOUNTVPS} action={ActionEnum.DELETE} hideChildren>
              <Tooltip color="danger" content={"Xóa"} className={`capitalize text-light`}>
                <Button
                  color="danger"
                  variant="solid"
                  radius="full"
                  className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                  onPress={() => {
                    setOpenDeleteDomainProvider({
                      open: true,
                      id: item?._id,
                    });
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
          onOpenAddEdit={() => setOpenCreateEdit(() => ({ open: true, id: "" }))}
          // onOpenDelete={() =>
          // 	setModalState((prev) => ({
          // 		...prev,
          // 		isDeleteOpen: true,
          // 	}))
          // }
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
          title="Danh sách đối tác"
        />

        {/* Add/Edit Modal */}
        {openCreateEdit.open && (
          <ModalAddEditDomainProvider
            isOpen={openCreateEdit.open}
            onOpenChange={handleCloseCreateEdit}
            idDomainProvider={openCreateEdit.id}
            reloadTable={() =>
              handleFetchDomainProvider({
                page: 1,
                limit: rowsPerPage,
                search: "",
                topFilter,
              })
            }
          />
        )}
        {openDeleteDomainProvider.open && (
          <ConfirmationDialog
            isOpen={openDeleteDomainProvider.open}
            onCancel={handleCloseConfirmDeleteCoupon}
            onConfirm={handleDeleteCoupon}
            title="Xoá nhà cung cấp"
          />
        )}
      </div>
    </Access>
  );
}
