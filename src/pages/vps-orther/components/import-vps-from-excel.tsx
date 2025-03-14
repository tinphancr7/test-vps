import { Button } from "@heroui/react";
import { RiFileExcel2Line } from "react-icons/ri";

import { useRef } from "react";

import vpsOrtherApis from "@/apis/vps-orther.api";
import { toast } from "react-toastify";
import { asyncThunkPaginationVpsOrther } from "@/stores/async-thunks/vps-orther-thunk";
import { useAppDispatch, useAppSelector } from "@/stores";
export default function ImporVpsFromExcel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const tableVpsOrther = useAppSelector((state) => state.table["vps_orther"]);
  const { status, teamSelected, searchByIp } = useAppSelector(
    (state) => state.vpsOrther
  );
  const fetchData = () => {
    const query: any = {};

    if (searchByIp !== undefined) {
      query.search = searchByIp;
    }

    if (status) {
      const [statusValue] = [...status];

      query.status = statusValue;
    }

    if (teamSelected) {
      query.team = teamSelected;
    }

    if (tableVpsOrther) {
      const cPageSize = tableVpsOrther?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsOrther?.pageSize][0]
        : 10;

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsOrther?.pageIndex) || 1;

      dispatch(asyncThunkPaginationVpsOrther(query));
    }
  };
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await vpsOrtherApis.uploadExcelFile(file);
        toast.success("Thêm mới VPS từ excel thành công!");
        fetchData();
      } catch (error: any) {
        if (error?.status === 415) toast.error("Chỉ chấp nhận file excel!");
        else if (error?.status === 400)
          toast.error("Dữ liệu VPS không hợp lệ vui lòng kiểm tra lại!");
        else toast.error("Có lỗi xảy ra vui lòng thử lại sau!");
      }
      event.target.value = "";
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current?.click();
  };
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        style={{ display: "none" }}
        id="upload-file"
        onChange={handleFileUpload}
      />
      <Button
        onPress={handleButtonClick}
        variant="solid"
        color={"success"}
        className="bg-success-600 rounded-md min-w-32 text-white font-bold text-sm items-center"
        startContent={
          <RiFileExcel2Line className="text-white min-w-max min-h-max text-lg" />
        }
      >
        Thêm Vps Từ Excel
      </Button>
    </div>
  );
}
