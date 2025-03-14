/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@heroui/react";
import { IoMdAdd } from "react-icons/io";
import {
  IAccountCloudflare,
  IResCloudflareWebsite,
} from "@/interfaces/cloudflare";
import cloudflareApis from "@/apis/cloudflare-api";
import TableDomain from "./components/TableDomain";
import { useEffect, useState } from "react";
import AddDomain from "./components/AddDomain";

import useQueryString from "@/hooks/useQueryString";
import { getPageIndex, getPageSize } from "@/utils/handle-param-pagination";
import FilterDomain from "./components/FilterDomain";
import { useAppDispatch } from "@/stores";

import { setModal } from "@/stores/slices/modal-slice";
import { TbExchange } from "react-icons/tb";
import ChangeDnsTypeA from "./components/ChangeDnsTypeA";

const CloudflareAccountDetail = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IAccountCloudflare[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { pageSize, pageIndex, search } = useQueryString();

  const getListCloudflareWebsite = async () => {
    try {
      setIsLoading(true);

      const { data }: { data: IResCloudflareWebsite } =
        await cloudflareApis.getPagingCloudflareWebSite({
          // accountId: id ?? "",
          pageIndex: parseInt(getPageIndex(pageIndex)),
          pageSize: parseInt(getPageSize(pageSize)),
          name: search?.toString(),
        });

      setData(data?.accounts);
      setTotalPages(data?.totalPages);
    } catch (error: any) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getListCloudflareWebsite();
  }, [pageIndex, pageSize, search]);

  const handleOpenModal = () => {
    dispatch(
      setModal({
        isOpen: true,
        title: "",
        body: <AddDomain fetch={getListCloudflareWebsite} />,
      })
    );
  };
  const handleOpenModalIp = () => {
    dispatch(
      setModal({
        isOpen: true,
        title: "",
        body: <ChangeDnsTypeA />,
      })
    );
  };
  return (
    <>
      <div className="mt-10 max-w-[80%] mx-auto">
        <div className="mb-4">
          <p className="font-medium">Trang chủ tài khoản</p>
          <h1 className="text-3xl font-medium text-[#313131]">Websites</h1>
          <p>
            Chọn tên miền để cấu hình và theo dõi cách Cloudflare xử lý lưu
            lượng truy cập web.
          </p>
        </div>

        <div className="mb-5 flex items-end justify-between ">
          <FilterDomain />
          <div className="flex gap-2 justify-center items-center">
            <Button
              startContent={<TbExchange />}
              className="rounded-none bg-primary text-white !scale-100 font-medium tracking-wide"
              onPress={handleOpenModalIp}
            >
              Đổi IP hàng loạt
            </Button>
            <Button
              startContent={<IoMdAdd />}
              className="rounded-none bg-primary text-white !scale-100 font-medium tracking-wide"
              onPress={handleOpenModal}
            >
              Thêm một miền
            </Button>
          </div>
        </div>

        <TableDomain
          data={data}
          total={totalPages}
          isLoading={isLoading}
          fetch={getListCloudflareWebsite}
        />
      </div>
    </>
  );
};

export default CloudflareAccountDetail;
