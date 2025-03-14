import { Button, Input } from "@heroui/react";

import { BiPlus, BiSearch } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import Access from "../Access/access";
interface IProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onOpenAddEdit?: () => void;
  onOpenDelete?: () => void;
  selectedKeys: Set<string>;
  extra?: React.ReactNode;
  subject?: string;
  actionCreate?: string;
  actionDelete?: string;
  isShow?: boolean;
  btnInvoice?: any;
  isShowDelete?: boolean;
}
const FilterTable = ({
  filterValue,
  onSearchChange,
  onClear,
  onOpenAddEdit,
  onOpenDelete,
  selectedKeys,
  extra,
  subject = "",
  actionCreate = "",
  actionDelete = "",
  isShow = true,
  btnInvoice,
  isShowDelete = true,
}: IProps) => {
  return (
    <div className="table__filter bg-white shadow rounded-xl border my-2 py-2 px-3">
      {extra}
      <div className="flex gap-4 items-center justify-between ">
        <div className=" w-[30%]">
          <Input
            isClearable
            className=" w-full "
            classNames={{
              inputWrapper: "bg-white border border-gray-300 rounded-xl text-black",
            }}
            placeholder="Tìm kiếm"
            startContent={<BiSearch className="text-black" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        {btnInvoice}
        {isShow && (
          <div className="flex items-center gap-4">
            <Access subject={subject} action={actionCreate} hideChildren>
              <Button
                startContent={<BiPlus />}
                className="bg-primary text-white"
                onClick={onOpenAddEdit}
              >
                Thêm mới
              </Button>
            </Access>
            <Access subject={subject} action={actionDelete} hideChildren>
              {isShowDelete ? (
                <Button
                  startContent={<BsTrash />}
                  className={`${
                    [...selectedKeys].length === 0 ? "bg-gray-300" : "bg-red-600"
                  } text-white`}
                  onClick={onOpenDelete}
                  disabled={[...selectedKeys].length === 0}
                >
                  Xóa
                </Button>
              ) : (
                <></>
              )}
            </Access>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterTable;
