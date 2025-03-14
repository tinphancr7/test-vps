/* eslint-disable no-case-declarations */
import { useCallback, useEffect, useState } from "react";
import { Button, Snippet, Tooltip } from "@heroui/react";
import { FaTrash } from "react-icons/fa";
import moment from "moment";
import FilterTable from "@/components/table/FilterTable";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "@/hooks/useDebounce";
import CustomTable from "@/components/table/CustomTable";
import ModalDeleteKey from "./components/ModalDeleteKey";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { AppDispatch } from "@/stores";
import { fetchManage2FaKey } from "@/stores/async-thunks/manage_2_fa_key.thunk";
import ModalKey from "./components/ModalKey";
import socket from "@/helpers/web-socket.helper";
import { MdModeEditOutline } from "react-icons/md";

const columns = [
  { key: "name", label: "Tên khóa bảo mật" },
  { key: "token", label: "Mã OTP" },
  { key: "timeRemaining", label: "Thời gian hết hạn" },
  { key: "createdAt", label: "Ngày tạo" },
  { key: "actions", label: "Hành động" },
];

export default function Manage2FaKey() {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const searchMatch = useDebounce(filterValue, 500);

  const { result, meta, isLoading } = useSelector((state: any) => state?.manage2FaKey || []);
  const [records, setRecords] = useState<any[]>([]);
  useEffect(() => {
    setRecords(result);
  }, [result]);
  const [modalState, setModalState] = useState({ isAddEditOpen: false, isDeleteOpen: false });

  const handleFetchKey = useCallback(
    ({ page, limit, search }: any) => {
      dispatch(fetchManage2FaKey({ page, limit, search }));
    },
    [dispatch],
  );

  useEffect(() => {
    handleFetchKey({ page: 1, limit: rowsPerPage, search: searchMatch });
  }, [rowsPerPage, searchMatch]);

  const handleChangePage = (page: number) => {
    handleFetchKey({
      page,
      limit: rowsPerPage,
      search: searchMatch,
    });
    setPage(page);
  };

  const onSearchChange = useCallback((value: any) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  useEffect(() => {
    if (result && result?.length > 0) {
      socket?.emit(
        "get_otp_and_timeout_key",
        result
          ?.filter((re: any) => re?.type === "TOTP")
          ?.map((re: any) => re?.key)
          ?.join(","),
      );
      socket?.emit(
        "get_hotp",
        result
          ?.filter((re: any) => re?.type === "HOTP")
          ?.map((re: any) => re?.key)
          ?.join(","),
      );
    }
  }, [result, meta]);
  const handleRefreshKey = (key: string) => {
    socket?.emit("get_hotp", key);
  };
  useEffect(() => {
    // socket?.on("otp_response", (data) => {
    //   const udRecords: any[] = [];
    //   if (typeof data === "object") {
    //     const keys: any = Object.keys(data);
    //     for (const key of keys) {
    //       const newRecord: any = result.find((re: any) => {
    //         return re?.key == key;
    //       });
    //       if (newRecord) {
    //         const _inz = {
    //           ...newRecord,
    //           token: data[key]?.token,
    //           timeRemaining: data[key]?.timeRemaining,
    //         };
    //         udRecords.push(_inz);
    //       }
    //     }
    //   }
    //   if (udRecords && udRecords?.length > 0)
    //     setRecords((prev) => {
    //       const hotp =
    //         prev.filter((re: any) => {
    //           return re?.type == "HOTP";
    //         }) || [];
    //       return [...hotp, ...udRecords];
    //     });
    // });
    // socket?.on("hotp_response", (data) => {
    //   const udRecords: any[] = [];
    //   if (typeof data === "object") {
    //     const keys: any = Object.keys(data);
    //     for (const key of keys) {
    //       const newRecord: any = result.find((re: any) => {
    //         return re?.key == key;
    //       });
    //       if (newRecord) {
    //         const _inz = {
    //           ...newRecord,
    //           token: data[key]?.token,
    //         };
    //         udRecords.push(_inz);
    //       }
    //     }
    //   }
    //   if (udRecords && udRecords?.length > 0)
    //     setRecords((prev) => {
    //       const totp =
    //         prev.filter((re: any) => {
    //           return re?.type == "TOTP";
    //         }) || [];
    //       return [...totp, ...udRecords];
    //     });
    // });
    socket?.on("otp_response", (data) => {
      if (typeof data === "object") {
        setRecords((prev) => {
          return prev.map((record: any) => {
            if (data[record.key]) {
              return {
                ...record,
                token: data[record.key]?.token,
                timeRemaining: data[record.key]?.timeRemaining,
              };
            }
            return record;
          });
        });
      }
    });

    socket?.on("hotp_response", (data) => {
      if (typeof data === "object") {
        setRecords((prev) => {
          return prev.map((record: any) => {
            if (data[record.key]) {
              return {
                ...record,
                token: data[record.key]?.token,
              };
            }
            return record;
          });
        });
      }
    });

    return () => {
      socket?.off("hotp_response");
      socket?.off("otp_response");
    };
  }, [result]);
  const renderCell = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "name":
        return <p className="text-bold text-black">{cellValue}</p>;
      case "createdAt":
        return (
          <p className="text-bold text-black">{moment(cellValue).format("DD/MM/YYYY HH:mm")}</p>
        );
      case "token":
        return (
          <Snippet
            symbol=""
            tooltipProps={{
              content: "Sao chép mã",
            }}
            className="!py-0"
            variant="bordered"
            color="primary"
          >
            {cellValue ?? "Đang khởi tạo..."}
          </Snippet>
        );
      case "timeRemaining":
        switch (item?.type) {
          case "HOTP":
            return (
              <Tooltip
                closeDelay={0}
                content="Làm mới"
                delay={0}
                motionProps={{
                  variants: {
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: 0.1,
                        ease: "easeIn",
                      },
                    },
                    enter: {
                      opacity: 1,
                      transition: {
                        duration: 0.15,
                        ease: "easeOut",
                      },
                    },
                  },
                }}
              >
                <Button
                  color="primary"
                  variant="solid"
                  size="sm"
                  startContent={<MdModeEditOutline />}
                  onPress={() => handleRefreshKey(item?.key)}
                >
                  Làm mới
                </Button>
              </Tooltip>
            );
          case "TOTP":
            const percentage = (cellValue / 30) * 100; // Chuyển đổi thành %

            return (
              <div className="flex justify-center items-center">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Vòng tròn nền */}
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="3"
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                    />
                    {/* Vòng tròn tiến trình */}
                    <circle
                      className="text-primary stroke-current transition-all duration-1000 ease-linear"
                      strokeWidth="3"
                      strokeLinecap="round"
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      strokeDasharray="100"
                      strokeDashoffset={100 - percentage} // Giảm dần theo thời gian
                    />
                  </svg>
                  {/* Hiển thị số giây còn lại */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {cellValue ? `${cellValue}s` : "..."}
                    </span>
                  </div>
                </div>
              </div>
            );
          default:
            return <></>;
        }
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-4">
            <Access subject={SubjectEnum.MANAGE_2FA_KEY} action={ActionEnum.DELETE} hideChildren>
              <Tooltip className="bg-red-600 text-white" content="Xóa">
                <span
                  className="text-lg text-red-600 cursor-pointer"
                  onClick={() => {
                    setSelectedKeys(new Set([item._id]));
                    setModalState((prev) => ({ ...prev, isDeleteOpen: true }));
                  }}
                >
                  <FaTrash />
                </span>
              </Tooltip>
            </Access>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <Access subject={SubjectEnum.MANAGE_2FA_KEY} action={ActionEnum.READ}>
      <div>
        <FilterTable
          filterValue={filterValue}
          onSearchChange={onSearchChange}
          onClear={onClear}
          onOpenAddEdit={() => setModalState((prev) => ({ ...prev, isAddEditOpen: true }))}
          selectedKeys={selectedKeys}
          subject={SubjectEnum.MANAGE_2FA_KEY}
          actionCreate={ActionEnum.CREATE}
          isShowDelete={false}
        />
        <CustomTable
          data={records}
          columns={columns}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          renderCell={renderCell}
          page={page}
          setPage={setPage}
          onChangePage={handleChangePage}
          meta={meta}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          isLoading={isLoading}
          title="Danh sách khóa bảo mật 2FA (Time-Based One-Time Password)"
        />
        {modalState.isAddEditOpen && (
          <ModalKey
            isOpen={modalState.isAddEditOpen}
            onClose={() => setModalState((prev) => ({ ...prev, isAddEditOpen: false }))}
            reloadTable={() => handleFetchKey({ page: 1, limit: rowsPerPage, search: "" })}
          />
        )}
        {modalState.isDeleteOpen && (
          <ModalDeleteKey
            isOpen={modalState.isDeleteOpen}
            onClose={() => setModalState((prev) => ({ ...prev, isDeleteOpen: false }))}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            reloadTable={() => handleFetchKey({ page, limit: rowsPerPage })}
          />
        )}
      </div>
    </Access>
  );
}
