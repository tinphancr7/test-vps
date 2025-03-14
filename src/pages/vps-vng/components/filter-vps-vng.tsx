import Container from "@/components/container";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import {
  dueDateType,
  statuses,
} from "@/constants/statuses-vps-vng-or-vietstack";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { asyncThunkPaginationVpsVng } from "@/stores/async-thunks/vps-vng-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
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
import {
  setStatus,
  setTeamSelected,
  setSearchByIp,
  setProductName,
  setSite,
  setDueDate,
  setSearch,
  setOs,
  setRangeDate,
} from "@/stores/slices/vps-vng-slice";
import { asyncThunkGetAllProducts } from "@/stores/async-thunks/prod-vng-thunk";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import ExportOrderExcel from "./export-excel-vps-vng";
import siteApi from "@/apis/site.api";
import ReactSelectAsyncPaginate from "@/components/form-data/react-select-async-paginate/ReactSelectAsyncPaginate";
import ConfirmExtendVPS from "./modal-confirm-extend-vps";
import { FaTelegramPlane } from "react-icons/fa";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";
import { SubjectEnum } from "@/constants/enum";

function FilterVpsVng() {
  const dispatch = useAppDispatch();
  const tableVpsVng = useAppSelector((state) => state.table["vps_vng"]);
  const dis = useMemo(() => {
    const listSelectedKey = tableVpsVng?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [tableVpsVng]);

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
  } = useAppSelector((state) => state.vpsVng);

  const { products: productsVng } = useAppSelector((state) => state.prodVng);

  const searchMatch = useDebounce(searchByIp, 500);

  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }

    if (productName) {
      query.product_name = productName;
    }
    if (site) {
      query.idVps = site?.value;
    }

    if (status) {
      query.status = status;
    }

    if (teamSelected) {
      query.team = teamSelected;
    }
    if (os) {
      query.os = os;
    }
    if (dueDate) {
      query.dueDate = dueDate || "all";
    }
    if (tableVpsVng) {
      const cPageSize = tableVpsVng?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsVng?.pageSize][0]
        : 10;

      if (
        tableVpsVng?.sortDescriptor?.direction &&
        tableVpsVng?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsVng?.sortDescriptor?.direction &&
        tableVpsVng?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsVng?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsVng?.sortDescriptor?.column}`;
      }
      if (dateRange.endDate && dateRange.startDate) {
        query.startDate = dateRange.startDate;
        query.endDate = dateRange.endDate;
      }

      /*
				if (
					tableVpsVng?.sortFields && 
					Object.keys(tableVpsVng?.sortFields)?.length
				) {
					Object.keys(tableVpsVng?.sortFields)?.forEach(
						(field: string) => {
							query[`sort__${field}`] = tableVpsVng?.sortFields[field];
						}
					)
				}
			*/

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsVng?.pageIndex) || 1;
      dispatch(setSearch(query));
      dispatch(asyncThunkPaginationVpsVng(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableVpsVng,
    status,
    site,
    teamSelected,
    searchMatch,
    productName,
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

  const loadOptionsData = async (
    searchQuery: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    const res = await siteApi.callFetchSite({
      search: searchQuery,
      pageIndex: page,
      pageSize: 10,
      provider: "66dea61b22306cb524671c45",
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

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "vps_vng",
        pageIndex: 1,
      })
    );
  };

  const handleValueChange = (value: any, key: string) => {
    if (key === "product") {
      dispatch(setProductName(value));
    }
    if (key === "dateRange") {
      dispatch(setRangeDate(value));
    }
    if (key === "os") {
      dispatch(setOs(value));
    }

    if (key === "search") {
      dispatch(setSearchByIp(value));
    }

    if (key === "status") {
      console.log(value);
      dispatch(setStatus(value));
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

  const onClearSearchIp = () => {
    dispatch(setSearchByIp(""));
    resetPageIndex();
  };
  const [isOpen, onOpenChange] = useState(false);
  const handleExtendVPS = () => {
    onOpenChange(true);
  };
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
          Tổng tiền: {totalMoney}$
        </Chip>
        <div className="w-full">
          <div className="w-full">
            <a
              href="https://t.me/kyvi_viky_VNG"
              target="_blank"
              className="flex !item-center py-1 gap-2 !justify-center bg-blue-500 text-white rounded"
            >
              <FaTelegramPlane color="white" className="self-center" />
              <p className="text-[15px] font-medium text-white">
                Telegram - @kyvi_viky_VNG
              </p>
            </a>
          </div>
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
            className="max-w-xs"
            classNames={{
              inputWrapper:
                "bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
              input: "font-medium",
            }}
            placeholder="Tìm kiếm"
            startContent={<BiSearch className="text-black" />}
            value={searchByIp}
            onClear={onClearSearchIp}
            onValueChange={(value) => handleValueChange(value, "search")}
          />

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
          <div className="max-w-52">
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
                <AutocompleteItem key={item?._id}>
                  {item?.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          {/* Filter By site */}

          <div className="max-w-52 w-full">
            <ReactSelectAsyncPaginate
              value={site}
              onChange={(value: any) => handleValueChange(value, "site")}
              loadOptions={loadOptionsData}
              placeholder="site"
            />
          </div>

          <div className="max-w-52">
            <Autocomplete
              defaultItems={productsVng}
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
                    <b>{convertVnToUsd(item?.m + item?.m * 0.1, "VNG")}$</b>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
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

export default FilterVpsVng;
