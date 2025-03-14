import Container from "@/components/container";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import {
  dueDateType,
  statuses,
} from "@/constants/statuses-vps-vng-or-vietstack";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { asyncThunkPaginationVpsGeneral } from "@/stores/async-thunks/vps-general-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import {
  Autocomplete,
  AutocompleteItem,
  Chip,
  DateRangePicker,
  Input,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import {
  setStatus,
  setTeamSelected,
  setSearchByIp,
  setProvider,
  setProductName,
  setSite,
  setDueDate,
  setSearch,
  setOs,
  setRangeDate,
} from "@/stores/slices/vps-general-slice";
import { asyncThunkGetAllProducts } from "@/stores/async-thunks/prod-general-thunk";
import ExportOrderExcel from "./export-excel-vps-genenal";
import siteApi from "@/apis/site.api";
import ReactSelectAsyncPaginate from "@/components/form-data/react-select-async-paginate/ReactSelectAsyncPaginate";
import ProviderApis from "@/apis/provider.api";

function FilterVpsGeneral() {
  const dispatch = useAppDispatch();
  const tableVpsGeneral = useAppSelector((state) => state.table["vps_general"]);

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
    provider,
    os,
    dateRange,
  } = useAppSelector((state) => state.vpsGeneral);

  const { products: productsGeneral } = useAppSelector(
    (state) => state.prodGeneral
  );

  const searchMatch = useDebounce(searchByIp, 500);
  const [providers, setProviders] = useState<any[]>([]);
  const handleGetProvider = async () => {
    try {
      const response = await ProviderApis.getListProviderOnOwn();
      const listProvider = response?.data?.data;
      if (listProvider && Array.isArray(listProvider))
        setProviders(listProvider);
    } catch (error: any) {
      console.log(error);
      setProviders([]);
    }
  };
  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }

    if (productName) {
      query.product_name = productName;
    }
    if (provider) {
      query.provider = provider;
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
    if (tableVpsGeneral) {
      const cPageSize = tableVpsGeneral?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsGeneral?.pageSize][0]
        : 10;

      if (
        tableVpsGeneral?.sortDescriptor?.direction &&
        tableVpsGeneral?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsGeneral?.sortDescriptor?.direction &&
        tableVpsGeneral?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsGeneral?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsGeneral?.sortDescriptor?.column}`;
      }
      if (dateRange.endDate && dateRange.startDate) {
        query.startDate = dateRange.startDate;
        query.endDate = dateRange.endDate;
      }

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsGeneral?.pageIndex) || 1;
      dispatch(setSearch(query));
      dispatch(asyncThunkPaginationVpsGeneral(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableVpsGeneral,
    status,
    site,
    teamSelected,
    provider,
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
    handleGetProvider();
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
        tableId: "vps_general",
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
    if (key === "provider") {
      dispatch(setProvider(value));
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

  const osS = [
    { value: "window", label: "Window Server" },
    { value: "ubuntu", label: "Ubuntu Server" },
  ];
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
              defaultItems={productsGeneral}
              placeholder="Sản phẩm"
              radius="sm"
              variant="bordered"
              inputProps={initPropsAutoComplete}
              classNames={classNamesAutoComplete}
              onSelectionChange={(value) => handleValueChange(value, "product")}
            >
              {(item: any) => (
                <AutocompleteItem key={item?.name} textValue={item?.name}>
                  <div className="flex flex-row justify-between gap-1">
                    <span>{item?.name}</span>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-12 gap-2">
          <div className="col-start-3 col-end-6">
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
          <div className="col-start-6 col-end-8">
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
          <div className="col-start-8 col-end-11">
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
          <div className=" col-start-11 col-end-13">
            <Autocomplete
              defaultItems={providers}
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
                <AutocompleteItem key={item?._id} textValue={item?.name}>
                  <div className="flex flex-row justify-between gap-1">
                    <span>{item?.name}</span>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default FilterVpsGeneral;
