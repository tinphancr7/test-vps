import ipWhitelistApis from "@/apis/ip-whitelist.api";
import CustomTextField from "@/components/form/text-field";
import CustomTable from "@/components/table/CustomTable";
import { useDebounce } from "@/hooks/useDebounce";
import { Button, Chip } from "@heroui/react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import ModalIpWhitelist from "./modal-white-list-ip";
import ModalDeleteIpWhitelist from "./modal-delete-white-list";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
const columns = [
  {
    key: "ipAddress",
    label: "Địa chỉ IP",
  },
  {
    key: "description",
    label: "Mô tả",
  },
  {
    key: "isActive",
    label: "Trạng thái hoạt động",
  },

  {
    key: "created_at",
    label: "Ngày tạo",
  },

  {
    key: "actions",
    label: "Hành động",
  },
];
export default function ModalAddWhiteListIp() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const searchMatch = useDebounce(searchValue, 500);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ipList, setIpList] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataInit, setDataInit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ipToDelete, setIpToDelete] = useState<string | null>(null);
  useEffect(() => {
    fetchIpList();
  }, [page, searchMatch, rowsPerPage]);
  const handleOpenModal = (ipData = null) => {
    setDataInit(ipData);
    setIsModalOpen(true);
  };
  const fetchIpList = async () => {
    setIsLoading(true);
    try {
      const response = await ipWhitelistApis.getPaging(
        page,
        rowsPerPage,
        searchMatch
      );
      setIpList(response.data.ips);
      setTotalRecords(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching IP list:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "created_at":
        return (
          <p className="text-bold text-black">
            {moment(cellValue).format("DD/MM/YYYY HH:mm")}
          </p>
        );
      case "isActive":
        return (
          <Chip
            startContent={cellValue ? <>✅</> : <>❌</>}
            variant="flat"
            className="rounded-lg"
            color={cellValue ? "success" : "danger"}
          >
            {cellValue ? " Cho phép truy cập" : "Chặn truy cập"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-3">
            <Button
              color="primary"
              variant="solid"
              size="sm"
              startContent={<MdModeEditOutline />}
              onPress={() => handleOpenModal(item)}
            >
              Sửa
            </Button>
            <Button
              size="sm"
              color="danger"
              variant="solid"
              startContent={<MdDelete />}
              onPress={() => {
                setIpToDelete(item.ipAddress);
                setIsDeleteModalOpen(true);
              }}
            >
              Xóa
            </Button>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);
  const handleChangePage = (page: number) => {
    setPage(page);
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[15px] italic">
        <strong>Quản lý địa chỉ IP Whitelist</strong> (danh sách trắng) cho phép
        bạn kiểm soát và quản lý các địa chỉ IP được phép truy cập vào hệ thống
        hoặc dịch vụ của bạn. Khi một <strong>địa chỉ IP</strong> được đưa vào
        danh sách trắng, nó sẽ được cấp quyền truy cập mà không bị chặn. Quá
        trình này giúp <strong>bảo vệ hệ thống</strong> của bạn khỏi các kết nối
        không mong muốn, đồng thời đảm bảo rằng chỉ các{" "}
        <strong>địa chỉ IP đáng tin cậy</strong> mới có thể truy cập vào hệ
        thống.
      </p>
      <div className="flex items-center justify-between">
        <CustomTextField
          isClearable
          placeholder="Nhập địa chỉ IP hoặc mô tả để tìm kiếm..."
          className="h-10 min-w-96"
          size="sm"
          type="search"
          value={searchValue}
          variant="bordered"
          onClear={() => setSearchValue("")}
          onValueChange={setSearchValue}
        />
        <Button
          startContent={<BiPlus />}
          className="bg-primary text-white"
          onClick={() => handleOpenModal()}
        >
          Thêm mới
        </Button>
      </div>
      <CustomTable
        data={ipList}
        columns={columns}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        renderCell={renderCell}
        page={page}
        setPage={setPage}
        onChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        isLoading={isLoading}
        meta={{
          totalPages: totalRecords,
        }}
        title="Danh sách IP Whitelist"
      />
      <ModalIpWhitelist
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpenChange={setIsModalOpen}
        reloadTable={fetchIpList}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />

      <ModalDeleteIpWhitelist
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIpToDelete(null);
        }}
        onOpenChange={setIsDeleteModalOpen}
        reloadTable={fetchIpList}
        ipAddress={ipToDelete || ""}
      />
    </div>
  );
}
