import usePushQueryString from "@/hooks/usePushQueryString";
import useQueryString from "@/hooks/useQueryString";
import { cleanObjectByQuery, getSearchKeyword } from "@/utils/handle-param-pagination";
import { Button, Input } from "@heroui/react";
import { memo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";

interface IFormValues {
  search: string;
}

const FilterDomain = () => {
  const { register, handleSubmit, setValue, reset } = useForm<IFormValues>();
  const { pageSize, pageIndex, search } = useQueryString();
  const pushQueryString = usePushQueryString();

  const onSubmit: SubmitHandler<IFormValues> = (data: IFormValues) => {
    pushQueryString(cleanObjectByQuery({ pageIndex, pageSize, search: data.search }));
  };

  const handleClearInput = () => {
    pushQueryString(cleanObjectByQuery({ pageIndex, pageSize, search: "" }));
    reset();
  };

  setValue("search", getSearchKeyword(search) || "");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="searchAccount" className="text-base">
          <span>Tìm kiếm</span>
        </label>
        <div className="flex items-center gap-3">
          <Input
            startContent={<CiSearch className="text-xl" />}
            className="max-w-[350px] group"
            classNames={{
              inputWrapper:
                "bg-white rounded-none hover:bg-white shadow-none border hover:!bg-transparent",
            }}
            id="searchAccount"
            {...register("search")}
            endContent={
              <MdClear
                className="group-hover:opacity-100 opacity-0 text-2xl !text-gray-500"
                onClick={handleClearInput}
              />
            }
          />
          <Button type="submit" className="rounded-none w bg-primary text-white !scale-100">
            Tìm kiếm
          </Button>
        </div>
      </form>
    </>
  );
};

export default memo(FilterDomain);
