import MyDateRangePicker from "@/components/form-data/my-date-range-picker";

import { actions, subjects } from "@/constants";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
} from "@heroui/react";
import { BiFilter } from "react-icons/bi";
import { IoIosRefresh } from "react-icons/io";

interface IProps {
  topFilter: any;
  onChangeTopFilter: (key: any, value: any) => void;
  onClearTopFilter?: () => void;
  onClickTopFilter: () => void;
}
const TopFilter = ({
  topFilter,
  onChangeTopFilter,
  onClearTopFilter,
  onClickTopFilter,
}: IProps) => {
  return (
    <>
      <div className="flex items-center w-full gap-12">
        <div className="w-1/3">
          <label htmlFor="" className="inline-block pb-1">
            Thời gian thực hiện :
          </label>
          <MyDateRangePicker
            value={topFilter?.time}
            name="time"
            onChangeSelect={onChangeTopFilter}
          />
        </div>
        <div className="w-1/3">
          <label htmlFor="" className="inline-block pb-1">
            Module :
          </label>
          <Autocomplete
            defaultItems={subjects}
            placeholder="Subject"
            radius="sm"
            variant="bordered"
            value={topFilter?.subject}
            selectedKey={topFilter?.subject}
            onSelectionChange={(keys) => {
              onChangeTopFilter("subject", keys);
            }}
          >
            {(item: any) => (
              <AutocompleteItem key={item?.key}>{item?.value}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>

        <div className="w-1/3">
          <label htmlFor="" className="inline-block pb-1">
            Action :
          </label>
          <Autocomplete
            defaultItems={actions}
            placeholder="Action"
            radius="sm"
            variant="bordered"
            value={topFilter?.action}
            selectedKey={topFilter?.action}
            onSelectionChange={(keys) => {
              onChangeTopFilter("action", keys);
            }}
          >
            {(item: any) => (
              <AutocompleteItem key={item?.key}>{item?.value}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>

        <div className="flex items-center gap-4 mt-7 cursor-pointer">
          <Button
            startContent={<BiFilter size={20} />}
            className="bg-primary text-white"
            onClick={onClickTopFilter}
          >
            Lọc
          </Button>
          <div className="cursor-pointer" onClick={onClearTopFilter}>
            <IoIosRefresh size={20} />
          </div>
        </div>
      </div>
      <Divider className="my-3" />
    </>
  );
};

export default TopFilter;
