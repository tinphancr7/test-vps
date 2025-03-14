import Container from "@/components/container";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { buCloudProviders } from "@/constants/bu-cloud-providers";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkPaginationInvoiceBuCloud } from "@/stores/async-thunks/invoice-bu-cloud";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setQuery } from "@/stores/slices/invoice-bu-cloud-slice";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DateRangePicker,
  Input,
} from "@heroui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoIosClose, IoIosRefresh } from "react-icons/io";
import ExportExcelInvoiceBuCloud from "./ExportExcelInvoiceBuCloud";

function FilterTable() {
  const dispatch = useAppDispatch();
  const tableInvoiceBucloud = useAppSelector(
    (state) => state.table["invoices_bu_cloud"]
  );
  const { teams } = useAppSelector((state) => state.teams);
  const [teamSelected, setTeamSelected] = useState<any>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [time, setTime] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const query: any = {};

    // if (searchMatch !== undefined) {
    //   query.search = searchMatch;
    // }

    if (teamSelected) {
      query.team = teamSelected;
    }

    if (provider) {
      query.provider = provider;
    }

    if (time) {
      query.startDate = moment(time.start?.toDate())
        .startOf("day")
        .toISOString();
      query.endDate = moment(time.end?.toDate()).endOf("day").toISOString();
    }

    if (tableInvoiceBucloud) {
      const cPageSize = tableInvoiceBucloud?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableInvoiceBucloud?.pageSize][0]
        : 10;

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableInvoiceBucloud?.pageIndex) || 1;

      dispatch(asyncThunkPaginationInvoiceBuCloud(query));
      dispatch(setQuery(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableInvoiceBucloud, teamSelected, time, provider]);

  useEffect(() => {
    dispatch(asyncThunkGetAllYourTeam());

    return () => {};
  }, []);

  const handleRemoveDate = () => {
    setTime(null);
  };

  const onClearSearchValue = () => {
    setSearchValue("");
  };

  const handleClearFilter = async () => {
    setTime(null);
    setTeamSelected(null);
    setProvider(null);
    setSearchValue("");
  };

  return (
    <Container className="p-4 flex gap-3 items-center justify-between">
      <div className="flex-1 flex items-center gap-3">
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
          value={searchValue}
          onClear={onClearSearchValue}
          onValueChange={setSearchValue}
        />

        <DateRangePicker
          calendarProps={{
            className: "!w-full !max-w-full",
            content: "!w-full !max-w-full",
          }}
          classNames={{
            inputWrapper: "border p-2 rounded-lg",
          }}
          radius="sm"
          variant={"bordered"}
          // label="Thời gian thực hiện"
          // labelPlacement="outside"
          className="max-w-xs"
          startContent={
            time && (
              <Button
                className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
                variant="solid"
                color="danger"
                onPress={handleRemoveDate}
              >
                <IoIosClose className="text-xl min-w-max" />
              </Button>
            )
          }
          value={time}
          onChange={setTime}
        />

        {/* Filter By Team */}
        <Autocomplete
          fullWidth
          defaultItems={teams}
          placeholder="Team"
          radius="sm"
          variant="bordered"
          // label="Team"
          // labelPlacement="outside"
          inputProps={initPropsAutoComplete}
          classNames={classNamesAutoComplete}
          selectedKey={teamSelected}
          onSelectionChange={setTeamSelected}
        >
          {(item: any) => (
            <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
          fullWidth
          defaultItems={buCloudProviders}
          placeholder="Nhà cung cấp"
          radius="sm"
          variant="bordered"
          // label="Team"
          // labelPlacement="outside"
          inputProps={initPropsAutoComplete}
          classNames={classNamesAutoComplete}
          selectedKey={provider}
          onSelectionChange={setProvider}
        >
          {(item: any) => (
            <AutocompleteItem key={item?.name}>{item?.name}</AutocompleteItem>
          )}
        </Autocomplete>
        <ExportExcelInvoiceBuCloud />
      </div>

      <div className="flex items-center gap-3 cursor-pointer">
        <Button
          className="bg-transparent w-max min-w-max"
          onPress={handleClearFilter}
        >
          <IoIosRefresh size={20} />
        </Button>
      </div>
    </Container>
  );
}

export default FilterTable;
