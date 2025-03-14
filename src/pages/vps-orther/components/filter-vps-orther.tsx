/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/container";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import {
  dueDateType,
  statuses,
} from "@/constants/statuses-vps-vng-or-vietstack";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import {
  setProductName,
  setSearchByIp,
  setStatus,
  setTeamSelected,
  setSite,
  setDueDate,
  setOs,
  setSearch,
  setProvider,
} from "@/stores/slices/vps-orther-slice";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import ReactSelectAsyncPaginate from "@/components/form-data/react-select-async-paginate/ReactSelectAsyncPaginate";
import siteApi from "@/apis/site.api";
import { IoIosAdd } from "react-icons/io";
import ModalAddVps from "./modal-add-vps";
import { asyncThunkPaginationVpsOrther } from "@/stores/async-thunks/vps-orther-thunk";
import ExportOrderExcel from "./export-excel-vps-orther";
import ImporVpsFromExcel from "./import-vps-from-excel";
import ExampleExcel from "./example-excel";
import { addCommas } from "@/utils";
import { asyncThunkPaginationProviders } from "@/stores/async-thunks/provider-thunk";
import { SubjectEnum } from "@/constants/enum";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";

function FilterVpsOrther() {
  const dispatch = useAppDispatch();
  const tableVpsOrther: any = useAppSelector(
    (state) => state.table["vps_orther"]
  );
  const dis = useMemo(() => {
    const listSelectedKey = tableVpsOrther?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [tableVpsOrther]);
  const { providersList } = useAppSelector((state) => state.provider);
  const { teams } = useAppSelector((state) => state.teams);
  const {
    status,
    teamSelected,
    searchByIp,
    productName,
    total,
    totalMoney,
    site,
    dueDate,
    os,
    provider,
  } = useAppSelector((state) => state.vpsOrther);

  const searchMatch = useDebounce(searchByIp, 500);
  const [dataInit, setDataInit] = useState(null);
  const [modalState, setModalState] = useState({
    isAddEditOpen: false,
  });

  useEffect(() => {
    dispatch(asyncThunkPaginationProviders({ pageSize: 100, pageIndex: 1 }));
  }, []);

  const handleChange = () => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }
    if (site) {
      query.idVps = site?.value;
    }

    if (status) {
      query.status = status;
    }
    if (os) {
      query.os = os;
    }
    if (teamSelected) {
      query.team = teamSelected;
    }
    if (dueDate) {
      query.dueDate = dueDate || "all";
    }
    if (provider) {
      query.provider = provider;
    }

    if (tableVpsOrther) {
      const cPageSize = tableVpsOrther?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsOrther?.pageSize][0]
        : 10;

      if (
        tableVpsOrther?.sortDescriptor?.direction &&
        tableVpsOrther?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsOrther?.sortDescriptor?.direction &&
        tableVpsOrther?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsOrther?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsOrther?.sortDescriptor?.column}`;
      }

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsOrther?.pageIndex) || 1;
      dispatch(setSearch(query));
      dispatch(asyncThunkPaginationVpsOrther(query));
    }
  };
  useEffect(() => {
    handleChange();
  }, [
    tableVpsOrther,
    status,
    teamSelected,
    searchMatch,
    productName,
    site,
    dueDate,
    os,
    provider,
  ]);

  useEffect(() => {
    dispatch(asyncThunkGetAllYourTeam());
  }, []);

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "vps_orther",
        pageIndex: 1,
      })
    );
  };

  const handleValueChange = (value: any, key: string) => {
    if (key === "product") {
      dispatch(setProductName(value));
    }

    if (key === "search") {
      dispatch(setSearchByIp(value));
    }

    if (key === "status") {
      dispatch(setStatus(value));
    }
    if (key === "os") {
      dispatch(setOs(value));
    }
    if (key === "team") {
      dispatch(setTeamSelected(value));
    }
    if (key === "site") {
      dispatch(setSite(value));
    }
    if (key === "dueDate") {
      dispatch(setDueDate(value));
    }
    if (key === "provider") {
      dispatch(setProvider(value));
    }
    resetPageIndex();
  };

  const onClear = () => {
    dispatch(setSearchByIp(""));
    resetPageIndex();
  };
  const loadOptionsData = async (
    searchQuery: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    const res = await siteApi.callFetchSite({
      search: searchQuery,
      pageIndex: page,
      pageSize: 10,
      provider: "676e2b1fc413153668cf227c",
    });

    const items = res?.data?.users?.map((item: any) => ({
      label: item?.name,
      value: item?.vps_id,
    }));

    return {
      options: items,
      hasMore: res?.data?.totalPages > page,
      additional: {
        page: searchQuery ? 1 : page + 1,
      },
    };
  };

  const osS = [
    { value: "window", label: "Window Server" },
    { value: "ubuntu", label: "Ubuntu Server" },
  ];
  const { permissions, user } = useAppSelector((state) => state.auth);
  const isAdmin = useMemo(() => {
    if (!permissions?.length) return false;

    const hasPermission = permissions.some(
      (item: any) => item.subject === SubjectEnum.ALL
    );

    return hasPermission;
  }, [permissions]);
  const [isOpenModalAssignedUser, setIsOpenModalAssignedUser] = useState(false);
  const handleAssingedUser = () => {
    setIsOpenModalAssignedUser(true);
  };
  const isLeader = useMemo(() => {
    if (user?.role?.name?.toLowerCase() === "leader") {
      return true;
    }

    return false;
  }, [user]);
  return (
    <Container className="grid lg:grid-cols-12 grid-cols-2 gap-2">
      <div className="col-span-2 flex flex-col gap-1">
        <Chip
          variant="solid"
          color="primary"
          radius="sm"
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
          classNames={{
            content: "tracking-wide font-medium",
          }}
        >
          Tổng tiền: {addCommas(totalMoney) || 0} $
        </Chip>
        {/* <div className="w-full">
          <a
            href="https://t.me/sp_vietstack"
            target="_blank"
            className="flex !item-center py-1 gap-2 !justify-center bg-blue-500 text-white rounded"
          >
            <FaTelegramPlane color="white" className="self-center" />
            <p className="text-[15px] font-medium text-white">
              Telegram - @sp_vietstack
            </p>
          </a>
        </div> */}
      </div>

      <div className="grid col-span-10">
        <div className="grid lg:grid-cols-7 grid-cols-2 gap-4">
          <ExampleExcel />
          <ImporVpsFromExcel />
          {/* Btn Export Excel */}
          <ExportOrderExcel />
          {/* Filter By Ip */}
          <Input
            isClearable
            variant="bordered"
            radius="sm"
            classNames={{
              inputWrapper:
                "bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
              input: "font-medium",
            }}
            placeholder="Tìm kiếm"
            startContent={<BiSearch className="text-black" />}
            value={searchByIp}
            onClear={onClear}
            onValueChange={(value) => handleValueChange(value, "search")}
          />

          {/* Filter By Status */}
          <Autocomplete
            defaultItems={statuses}
            placeholder="Trạng thái"
            radius="sm"
            variant="bordered"
            inputProps={initPropsAutoComplete}
            classNames={classNamesAutoComplete}
            selectedKey={status}
            onSelectionChange={(value) => handleValueChange(value, "status")}
          >
            {(item: any) => (
              <AutocompleteItem key={item?.value}>
                {item?.label}
              </AutocompleteItem>
            )}
          </Autocomplete>

          {/* Filter By Team */}
          <Autocomplete
            defaultItems={teams}
            placeholder="Team"
            radius="sm"
            variant="bordered"
            inputProps={initPropsAutoComplete}
            classNames={classNamesAutoComplete}
            selectedKey={teamSelected}
            onSelectionChange={(value) => handleValueChange(value, "team")}
          >
            {(item: any) => (
              <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
            )}
          </Autocomplete>
          {/* Filter By site */}

          <div className="w-full">
            <ReactSelectAsyncPaginate
              value={site}
              onChange={(value: any) => handleValueChange(value, "site")}
              loadOptions={loadOptionsData}
              placeholder="site"
            />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-12 gap-2">
          {(isAdmin || isLeader) && (
            <div className="col-start-3 col-end-5">
              <Button
                variant="solid"
                color="primary"
                className="bg-blue-500 rounded-md w-full text-white font-bold text-sm items-center"
                onPress={() => {
                  handleAssingedUser();
                }}
                isDisabled={dis}
              >
                Phân quyền người quản lý
              </Button>
            </div>
          )}
          <div className="col-start-5 col-end-7">
            <Button
              onClick={() =>
                setModalState((prev) => ({ ...prev, isAddEditOpen: true }))
              }
              color="primary"
              className="w-full !rounded text-sm flex justify-center items-center gap-1"
            >
              <IoIosAdd size={18} />
              <p>Thêm mới</p>
            </Button>
          </div>
          <div className="col-start-7 col-end-9">
            <Autocomplete
              defaultItems={providersList}
              placeholder="Nhà cung cấp"
              radius="sm"
              variant="bordered"
              inputProps={initPropsAutoComplete}
              classNames={classNamesAutoComplete}
              selectedKey={provider}
              onSelectionChange={(value) =>
                handleValueChange(value, "provider")
              }
            >
              {(item: any) => (
                <AutocompleteItem key={item?._id}>
                  {item?.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          <div className="col-start-9 col-end-11">
            {/* Filter Due date */}
            <Autocomplete
              defaultItems={osS}
              placeholder="Hệ điều hành"
              radius="sm"
              variant="bordered"
              inputProps={initPropsAutoComplete}
              classNames={classNamesAutoComplete}
              selectedKey={os}
              onSelectionChange={(value) => handleValueChange(value, "os")}
            >
              {(item: any) => (
                <AutocompleteItem key={item?.value}>
                  {item?.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          {/* Filter Due date */}
          <div className="col-start-11 col-end-13">
            <Autocomplete
              defaultItems={dueDateType}
              placeholder="Ngày hết hạn"
              radius="sm"
              variant="bordered"
              inputProps={initPropsAutoComplete}
              classNames={classNamesAutoComplete}
              selectedKey={dueDate}
              onSelectionChange={(value) => handleValueChange(value, "dueDate")}
            >
              {(item: any) => (
                <AutocompleteItem key={item?.value}>
                  {item?.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>
      </div>
      <ModalAddVps
        dataInit={dataInit}
        isOpen={modalState.isAddEditOpen}
        onClose={() =>
          setModalState((prev) => ({ ...prev, isAddEditOpen: false }))
        }
        setDataInit={setDataInit}
        reloadTable={handleChange}
      />
      <ModalAssignedUserToVps
        isOpen={isOpenModalAssignedUser}
        onOpenChange={setIsOpenModalAssignedUser}
      />
    </Container>
  );
}

export default FilterVpsOrther;
