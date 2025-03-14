import MyDateRangePicker from "@/components/form-data/my-date-range-picker";
import MySelectNoValidate from "@/components/form-data/my-select-no-validate";
import { actions, subjects } from "@/constants";
import { Button, Divider, SelectItem } from "@heroui/react";
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
            Thời gian giao dịch :
          </label>
          <MyDateRangePicker
            value={topFilter?.time}
            name="time"
            onChangeSelect={onChangeTopFilter}
          />
        </div>
        <div className="w-1/3">
          <label htmlFor="" className="inline-block pb-1">
            Nhà cung cấp :
          </label>
          <MySelectNoValidate
            value={topFilter?.subject}
            name="subject"
            onChangeSelect={onChangeTopFilter}
          >
            {subjects.map((item) => (
              <SelectItem key={item.key}>{item.value}</SelectItem>
            ))}
          </MySelectNoValidate>
        </div>

        <div className="w-1/3">
          <label htmlFor="" className="inline-block pb-1">
            Team :
          </label>
          <MySelectNoValidate
            value={topFilter?.action}
            name="action"
            onChangeSelect={onChangeTopFilter}
          >
            {actions.map((item) => (
              <SelectItem key={item.key}>{item.value}</SelectItem>
            ))}
          </MySelectNoValidate>
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
