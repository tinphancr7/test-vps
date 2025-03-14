import usePushQueryString from "@/hooks/usePushQueryString";
import useQueryString from "@/hooks/useQueryString";
import {
  cleanObjectByQuery,
  getSearchKeyword,
} from "@/utils/handle-param-pagination";
import { Button, Input } from "@heroui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";

interface IFormValues {
  search: string;
}

const FilterCloudflareAccount = () => {
  const { register, handleSubmit, setValue, reset } = useForm<IFormValues>();

  const { pageIndex, pageSize, search } = useQueryString();
  const pushQueryString = usePushQueryString();

  const onSubmit: SubmitHandler<IFormValues> = (data: IFormValues) => {
    pushQueryString(
      cleanObjectByQuery({ pageIndex, pageSize, search: data.search })
    );
  };

  const handleReset = () => {
    pushQueryString({});
    reset();
  };

  setValue("search", getSearchKeyword(search) || "");

  return (
    <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="searchAccount">Tìm kiếm tài khoản</label>
      <div className="flex items-center gap-3">
        <Input
          startContent={<CiSearch className="text-xl" />}
          className="max-w-[350px]"
          classNames={{
            inputWrapper:
              "bg-white rounded-none hover:bg-white shadow-none border hover:!bg-transparent",
          }}
          id="searchAccount"
          {...register("search")}
        />
        <Button
          type="submit"
          className="rounded-none bg-primary text-white !scale-100"
        >
          Tìm kiếm
        </Button>
        <Button
          type="submit"
          className="rounded-none !scale-100"
          onPress={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export default FilterCloudflareAccount;
