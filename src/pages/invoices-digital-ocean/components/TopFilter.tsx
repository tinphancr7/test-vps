import accountApi from "@/apis/account.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setSearchBilling } from "@/stores/slices/digital-ocean-slice/digital-ocean-billing.slice";
import { convertPriceToUSD2 } from "@/utils/digital-ocean";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DateRangePicker,
  Divider,
  Input,
} from "@heroui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiFilter, BiSearch } from "react-icons/bi";
import { IoIosClose, IoIosRefresh } from "react-icons/io";
import { setTablePageIndex } from "@/stores/slices/table-slice";

const TopFilter = () => {
  const dispatch = useAppDispatch();
  const { totalAmountPayment } = useAppSelector(
    (state) => state.digitalOceanBillingHistory
  );
  const [teamOwnerApiKey, setTeamOwnerApiKey] = useState([]);
  const [selectedTeamOwner, setSelectedTeamOwner] = useState<any>(new Set([]));
  const [valueDate, setValueDate] = useState<any>(null);
  const [valueInputSearch, setValueInputSearch] = useState<any>("");
  const [disableWithDateError, setDisableWithDateError] = useState(false);

  useEffect(() => {
    // Fetch providers
    const fetchProvider = async () => {
      const response = await accountApi.getAllAccountDigitalOcean();
      if (response?.data?.status) {
        setTeamOwnerApiKey(response?.data?.data);
      }
    };
    fetchProvider();
  }, []);
  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "invoice-digital-ocean",
        pageIndex: 1,
      })
    );
  };
  const onClickFilter = () => {
    let startDate;
    let endDate;
    if (valueDate) {
      startDate = moment(valueDate.start?.toDate())
        .startOf("day")
        .toISOString();
      endDate = moment(valueDate.end?.toDate()).endOf("day").toISOString();
    }
    resetPageIndex();
    dispatch(
      setSearchBilling({
        searchData: {
          valueDate: valueDate && { startDate, endDate },
          selectedTeamOwner: [...selectedTeamOwner][0],
          valueInputSearch,
        },
      })
    );
  };
  const onClearFilter = () => {
    setSelectedTeamOwner([]);
    setValueDate(null);
    setValueInputSearch("");
    dispatch(
      setSearchBilling({
        searchData: {},
        pageSize: 10,
        pageIndex: 1,
      })
    );
  };
  return (
    <>
      {/* <h1 className="font-bold text-2xl mb-4">
                {" "}
                Danh sách hóa đơn Digital Ocean
            </h1> */}
      <p className="font-bold text-[24px] mb-4">
        Tổng tiền đã thanh toán: {convertPriceToUSD2(totalAmountPayment)}
      </p>
      <div className="flex items-center w-full gap-10">
        <div className="w-1/3">
          <label htmlFor="" className="inline-block pb-1">
            Thời gian :
          </label>
          <DateRangePicker
            aria-label="date"
            calendarProps={{
              className: "!w-full !max-w-full",
              content: "!w-full !max-w-full",
            }}
            id="nextui-date-range-picker"
            radius="sm"
            variant={"bordered"}
            classNames={{
              inputWrapper: "border p-2 rounded-lg",
            }}
            errorMessage={(value) => {
              setDisableWithDateError(false);
              if (value.isInvalid) {
                setDisableWithDateError(true);
                return "Ngày bắt đầu không thể lớn hơn ngày kết thúc";
              }
            }}
            startContent={
              valueDate && (
                <Button
                  className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
                  variant="solid"
                  color="danger"
                  onPress={() => setValueDate(null)}
                >
                  <IoIosClose className="text-xl min-w-max" />
                </Button>
              )
            }
            value={valueDate}
            onChange={(value) => setValueDate(value)}
          />
        </div>
        <div className="w-1/3">
          <label htmlFor="" className="inline-block pb-1">
            Team - Account VPS Digital Ocean :
          </label>
          <Autocomplete
            defaultItems={teamOwnerApiKey}
            placeholder="Team"
            radius="sm"
            variant="bordered"
            value={selectedTeamOwner}
            selectedKey={selectedTeamOwner}
            onSelectionChange={(keys) => {
              setSelectedTeamOwner(keys);
            }}
          >
            {(item: any) => (
              <AutocompleteItem key={item?._id}>
                {item?.team?.name}
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <div className=" w-[30%]">
          <label htmlFor="" className="inline-block pb-1">
            Tìm kiếm sản phẩm:
          </label>
          <Input
            isClearable
            className=" w-full "
            classNames={{
              inputWrapper:
                "bg-white border border-gray-300 rounded-xl text-black",
            }}
            placeholder="Tìm kiếm"
            startContent={<BiSearch className="text-black" />}
            value={valueInputSearch}
            onClear={() => setValueInputSearch("")}
            onValueChange={setValueInputSearch}
          />
        </div>
        <div className="flex items-center gap-4 mt-7 cursor-pointer">
          <Button
            startContent={<BiFilter size={20} />}
            className="bg-primary text-white"
            onPress={onClickFilter}
            isDisabled={disableWithDateError}
          >
            Lọc
          </Button>
          <div className="cursor-pointer" onClick={onClearFilter}>
            <IoIosRefresh size={20} />
          </div>
        </div>
      </div>
      <Divider className="my-4" />
    </>
  );
};

export default TopFilter;
