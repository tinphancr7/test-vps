import Container from "@/components/container";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import {
  dueDateType,
  statuses,
} from "@/constants/statuses-vps-vng-or-vietstack";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllProducts } from "@/stores/async-thunks/prod-vietstack-thunk";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { asyncThunkPaginationVpsVietStack } from "@/stores/async-thunks/vps-vietstack-thunk";
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
  setRangeDate,
} from "@/stores/slices/vps-vietstack-slice";

import { convertVnToUsd } from "@/utils/vn-to-usd";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  DateRangePicker,
  Input,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import ExportOrderExcel from "./export-excel-vps-vietstack";
import ReactSelectAsyncPaginate from "@/components/form-data/react-select-async-paginate/ReactSelectAsyncPaginate";
import siteApi from "@/apis/site.api";

import ConfirmExtendVPS from "./modal-confirm-extend-vps";
import { FaTelegramPlane } from "react-icons/fa";
import { SubjectEnum } from "@/constants/enum";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";
function FilterVpsVietStack() {
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
  const dispatch = useAppDispatch();
  const tableVpsVietStack: any = useAppSelector(
    (state) => state.table["vps_vietstack"]
  );

  const dis = useMemo(() => {
    const listSelectedKey = tableVpsVietStack?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [tableVpsVietStack]);
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
    dateRange,
  } = useAppSelector((state) => state.vpsVietStack);
  const { products: productsVietStack } = useAppSelector(
    (state) => state.prodVietStack
  );

  const searchMatch = useDebounce(searchByIp, 500);

  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }
    if (site) {
      query.idVps = site?.value;
    }
    if (productName) {
      query.product_name = productName;
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
    if (dateRange.endDate && dateRange.startDate) {
      query.startDate = dateRange.startDate;
      query.endDate = dateRange.endDate;
    }

    if (tableVpsVietStack) {
      const cPageSize = tableVpsVietStack?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsVietStack?.pageSize][0]
        : 10;

      if (
        tableVpsVietStack?.sortDescriptor?.direction &&
        tableVpsVietStack?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsVietStack?.sortDescriptor?.direction &&
        tableVpsVietStack?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsVietStack?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsVietStack?.sortDescriptor?.column}`;
      }

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsVietStack?.pageIndex) || 1;
      dispatch(setSearch(query));
      dispatch(asyncThunkPaginationVpsVietStack(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableVpsVietStack,
    status,
    teamSelected,
    searchMatch,
    productName,
    site,
    dueDate,
    os,
    dateRange.endDate,
    dateRange.startDate,
  ]);

  useEffect(() => {
    dispatch(asyncThunkGetAllYourTeam());
    dispatch(asyncThunkGetAllProducts());

    return () => {};
  }, []);

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "vps_vietstack",
        pageIndex: 1,
      })
    );
  };

  const handleValueChange = (value: any, key: string) => {
    if (key === "dateRange") {
      dispatch(setRangeDate(value));
    }
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
      provider: "66dea5f822306cb524671c44",
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
  const [isOpen, onOpenChange] = useState(false);
  const handleExtendVPS = () => {
    onOpenChange(true);
  };
  const osS = [
    { value: "window", label: "Window Server" },
    { value: "ubuntu", label: "Ubuntu Server" },
  ];
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
          Tổng tiền: {totalMoney} $
        </Chip>
        <div className="w-full">
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
        </div>
      </div>

      <div className="grid col-span-10">
        <div className="grid lg:grid-cols-6 grid-cols-2 gap-4">
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
          <Autocomplete
            defaultItems={productsVietStack}
            placeholder="Sản phẩm"
            radius="sm"
            variant="bordered"
            inputProps={initPropsAutoComplete}
            classNames={classNamesAutoComplete}
            selectedKey={productName}
            onSelectionChange={(value) => handleValueChange(value, "product")}
          >
            {(item: any) => (
              <AutocompleteItem key={item?.name}>
                <div className="flex flex-row justify-between gap-1">
                  <span>{item?.name}</span>
                  <b>{convertVnToUsd(item?.m + item?.m * 0.1)}$</b>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
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
          <div className="col-start-5 col-end-8">
            <DateRangePicker
              classNames={{
                base: "h-5 border-none outline-none !border-primary hover:!border-primary",

                inputWrapper:
                  "group-data-[open=true]:!border-primary border focus-within:!border-primary hover:!border-primary  group-data-[hover=true]:!border-primary group-data-[focus=true]:!border-primary",
                input: "font-medium text-foreground-500",
              }}
              variant="bordered"
              allowsNonContiguousRanges={true}
              onChange={(value: any) => {
                const start = new Date(
                  value?.start?.year,
                  value?.start?.month - 1,
                  value?.start?.day
                );
                const end = new Date(
                  value?.end?.year,
                  value?.end?.month - 1,
                  value?.end?.day
                );

                if (end >= start)
                  handleValueChange(
                    { startDate: start, endDate: end },
                    "dateRange"
                  );
                else
                  handleValueChange(
                    { startDate: "", endDate: "" },
                    "dateRange"
                  );
              }}
            />
          </div>
          <div className="col-start-8 col-end-10">
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
          <div className="col-start-10 col-end-12">
            {/* Filter Due date */}
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
          <div className="col-start-12  col-span-2">
            <Button
              variant="solid"
              color="primary"
              className="bg-blue-500 rounded-md w-full text-white font-bold text-sm items-center"
              onPress={() => {
                handleExtendVPS();
              }}
              isDisabled={dis}
            >
              Gia hạn
            </Button>
          </div>
        </div>
      </div>
      <ConfirmExtendVPS isOpen={isOpen} onOpenChange={onOpenChange} />
      <ModalAssignedUserToVps
        isOpen={isOpenModalAssignedUser}
        onOpenChange={setIsOpenModalAssignedUser}
      />
    </Container>
  );
}

export default FilterVpsVietStack;
