/* eslint-disable @typescript-eslint/no-unused-vars */
import ActionsCell from "@/components/actions-cell";
import Container from "@/components/container";

import TableControl from "@/components/table-control";
import { API_IMAGE } from "@/configs/apis";
import { osTemplate } from "@/constants/os-templates";
import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setModal } from "@/stores/slices/modal-slice";

import { Avatar, Button, Chip, Spinner, Tooltip, User } from "@heroui/react";

import moment from "moment";
import { FaRegCopy } from "react-icons/fa6";
import { IoIosEye } from "react-icons/io";
import { VscNotebook } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { SubjectEnum } from "@/constants/enum";
// import { IoClose } from "react-icons/io5";
import NoteCellVps from "./note-cell-vps";
import LabelCellVps from "./label-cell-vps";
import ModalAddVps from "./modal-add-vps";
import { asyncThunkPaginationVpsOrther } from "@/stores/async-thunks/vps-orther-thunk";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import ModalDeleteVps from "./ModalDeleteAccount";
import { GoCodeSquare } from "react-icons/go";
import { toast } from "react-toastify";
import vpsOrtherApis from "@/apis/vps-orther.api";
import ModalAapanel from "./ModalAapanel";
import { ROLE_TO_PHO } from "@/constants";
import { TbWorldWww } from "react-icons/tb";
import siteApi from "@/apis/site.api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
function TableVpsOrther() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { permissions, user } = useAppSelector((state) => state.auth);
  const { vpsList, total, isLoading } = useAppSelector(
    (state) => state?.vpsOrther || {}
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const isAdmin = useMemo(() => {
    if (!permissions?.length) return false;

    const hasPermission = permissions.some(
      (item: any) => item.subject === SubjectEnum.ALL
    );

    return hasPermission;
  }, [permissions]);

  const isLeader = useMemo(() => {
    if (user?.role?.name?.toLowerCase() === "leader") {
      return true;
    }

    return false;
  }, [user]);

  const isRoleIt = useMemo(() => {
    if (user?.role?.name?.toLowerCase() === "it") {
      return true;
    }

    return false;
  }, [user]);

  const isTroLy = useMemo(() => {
    if (user?.role?.name === "TRỢ LÝ") {
      return true;
    }

    return false;
  }, [user]);

  const isTP = useMemo(() => {
    if (user?.role?._id === ROLE_TO_PHO) {
      return true;
    }

    return false;
  }, [user]);

  const columns = [
    { _id: "configure", name: "Cấu hình", className: "text-left w-1/5" },
    { _id: "ip", name: "Địa chỉ IP", className: "w-[10%]" },
    { _id: "price", name: "Giá tiền", className: "w-[10%]" },
    { _id: "status", name: "Trạng thái" },
    // {_id: "os", name: "Hệ điều hành"},
    { _id: "team", name: "Team" },
    { _id: "provider", name: "Nhà cung cấp" },
    // { _id: "created_by", name: "Tạo bởi" },
    { _id: "expires", name: "Ngày hết hạn", sortable: true },
    // {_id: "createdAt", name: "Ngày tạo"},
    { _id: "sites", name: "Số lượng site", sortable: true },
    { _id: "uRLAaPanel", name: "URL Aapanel" },
    { _id: "note", name: "Ghi chú" },
    { _id: "actions", name: "Hành động" },
    // { _id: "created_by", name: "Nguời tạo" },
  ];

  const colorStatus = (type: string) => {
    switch (type) {
      case "Pending":
        return "warning";

      case "Active":
        return "success";

      default:
        return "danger";
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleNavigateToDetail = (id: string) => {
    navigate(`${paths.vps_management_orther}/${id}/overview`);
  };

  const handleOpenModalNote = (vps: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "default",
        title: "Ghi chú",
        body: <NoteCellVps vps={vps} />,
      })
    );
  };

  const handleUpdateHostName = (vps: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "default",
        title: "Chỉnh sửa nhãn",
        body: <LabelCellVps vps={vps} />,
      })
    );
  };
  const [aapanel, setAapanel] = useState({});

  const handleGetAapanel = async (_id: string) => {
    try {
      const response = await vpsOrtherApis.getAapanel(_id);
      setAapanel(response?.data?.data);
      setModalState((prev) => ({
        ...prev,
        isOpenAapanel: true,
      }));
    } catch (error: any) {
      toast.error("Bạn không có quyền truy cập!");
    }
  };
  const handleExportListSiteVps = async (vps: any) => {
    try {
      const response = await siteApi.callFetchListSiteFollowVpsId({
        vps_id: vps?._id || "",
      });

      if (response?.status !== 200)
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");

      const siteList = response?.data?.data || [];

      const workbook = new ExcelJS.Workbook();

      const siteSheet = workbook.addWorksheet(
        `Danh sách site của VPS - ${vps?.vps_id?.ip}`
      );
      const title = `Danh sách site của VPS - ${vps?.ip}`;
      siteSheet.mergeCells("A1:J1");
      siteSheet.getCell("A1").value = title;
      siteSheet.getCell("A1").font = { bold: true, size: 16 };
      siteSheet.getCell("A1").alignment = { horizontal: "center" };
      siteSheet.addRow(["STT", "Tên Site", "Ngày Tạo"]);
      siteSheet.getRow(2).font = { bold: true };
      siteSheet.getRow(2).alignment = { horizontal: "center" };

      siteList.forEach((site: any, index: number) => {
        siteSheet.addRow([
          index + 1,
          site.name,
          new Date(site.createdAt).toLocaleDateString(),
        ]);
      });
      siteSheet.columns = [{ width: 10 }, { width: 40 }, { width: 20 }];
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `VPS_Sites_${vps?.ip}.xlsx`;
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        fileName
      );

      toast.success("Xuất danh sách site thành công!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    const urlImage = item?.created_by?.avatar
      ? `${API_IMAGE}/${item?.created_by?.avatar}`
      : "";
    const findOs = osTemplate?.find((os) => os?.name === item?.os);
    const addNewActions = [
      {
        order: 0,
        label: "Ghi chú",
        icon: VscNotebook,
        bgColor: "bg-default-400",
        isDisabled: false,
        onPress: () => {
          handleOpenModalNote(item);
        },
      },
      {
        order: 1,
        label: "Xem",
        icon: IoIosEye,
        bgColor: "bg-warning",
        isDisabled: isAdmin || isLeader ? false : true,
        onPress: () => {
          handleNavigateToDetail(item?._id);
        },
      },
      {
        order: 2,
        label: "Xuất danh sách Site",
        icon: TbWorldWww,
        bgColor: "bg-blue-500",
        isDisabled: !isTP && (isAdmin || isLeader) ? false : true,
        onPress: () => {
          handleExportListSiteVps(item);
        },
      },
    ];

    const now = moment();
    const expiryDate = moment(item?.expires);
    const duration = moment.duration(expiryDate.diff(now));

    // Tính tổng số ngày giữa hai thời điểm
    const totalDays = Math.floor(duration.asDays());

    // Tính số giờ còn lại sau khi đã tính số ngày
    const remainingHours = duration.subtract(totalDays, "days").hours();

    switch (columnKey) {
      case "price": {
        return (
          <p className="tracking-wider">
            {cellValue?.toLocaleString("de-DE", { maximumFractionDigits: 0 })}{" "}
            <b>$</b>
          </p>
        );
      }
      case "provider":
        return (
          <div className="flex items-center justify-center">
            {cellValue?.name}
          </div>
        );
      case "configure":
        return (
          <div className="flex items-end gap-4 !w-[200px]">
            <div>
              <Tooltip
                content={"Chỉnh sửa nhãn"}
                className={`capitalize text-light bg-primary-500`}
              >
                <div
                  className="flex items-start font-bold text-primary-500 cursor-pointer"
                  onClick={() => handleUpdateHostName(item)}
                >
                  {item["domain"] || "Trống"}
                </div>
              </Tooltip>

              <div className="flex items-center flex-nowrap gap-1">
                <div className="flex items-center gap-1">
                  <Avatar
                    src={findOs?.img || "/imgs/os-default.png"}
                    className="w-5 h-5 text-large bg-transparent ring-default ring-1"
                  />
                </div>
                <div className="flex items-center justify-center gap-0.5 min-w-max">
                  <p>{item?.guaranteed_ram || 0} GB</p>
                </div>
                |
                <div className="flex items-center gap-0.5 min-w-max">
                  <p className="">{item?.core || 0} </p>
                  <h3>vCPUs</h3>
                </div>
                |
                <div className="flex items-center justify-center gap-0.5 min-w-max">
                  <p className="">{item?.disk_limit || 0} GB</p>
                  <h3 className="uppercase">Disk</h3>
                </div>
              </div>
            </div>
          </div>
        );

      case "uRLAaPanel": {
        return (
          <Tooltip
            radius="sm"
            content={
              <div className="flex items-center gap-1 text-xs">
                <FaRegCopy />
                Sao chép
              </div>
            }
          >
            {cellValue}
            {/* 
              <Button
                variant="flat"
                color="primary"
                className="h-8 px-2 rounded-md text-blue-500 font-medium  data-[hover=true]:outline-primary data-[hover=true]:outline-1 tracking-wider"
              >
                {item?.["isActiveAapanel"] ? (
                  <div className="text-green-500 flex gap-1 justify-center items-center">
                    <p className="text-black text-sm font-normal">
                      Đang hoạt động
                    </p>
                    <MdOutlineDone />
                  </div>
                ) : (
                  <div className="text-red-500 flex gap-1 justify-center items-center">
                    <p className="text-black text-sm font-normal">
                      Không hoạt động
                    </p>
                    <IoClose />
                  </div>
                )}
              </Button>
            */}
          </Tooltip>
        );
      }
      case "status":
        return (
          <div className="flex items-center justify-center">
            <Chip
              color={
                item?.["status"] ? colorStatus(item?.["status"]) : "default"
              }
              variant="flat"
              radius="sm"
              classNames={{
                content: "font-semibold tracking-wider flex items-center gap-2",
              }}
            >
              {item?.["status"] === "Pending" && (
                <Spinner size="sm" aria-label="Loading..." />
              )}

              {item?.["status"] || "Trống"}
            </Chip>
          </div>
        );

      case "ip":
        if (!item["ip"]) {
          return (
            <div className="col-span-1 flex items-center justify-center gap-2">
              <i className="text-base">Trống</i>
            </div>
          );
        }

        return (
          <Tooltip
            radius="sm"
            content={
              <div className="flex items-center gap-1 text-xs">
                <FaRegCopy />
                Sao chép
              </div>
            }
          >
            <Button
              variant="flat"
              color="primary"
              className="h-8 px-1 rounded-md text-dark data-[hover=true]:outline-primary data-[hover=true]:outline-1 tracking-wider"
              onPress={() => handleCopy(item["ip"])}
            >
              {item?.["ip"]}
            </Button>
          </Tooltip>
        );

      case "team":
        return (
          <div className="flex items-center justify-center">
            {cellValue?.name}
          </div>
        );

      case "created_by":
        return (
          <User
            name={cellValue?.name || cellValue?.username}
            avatarProps={{
              size: "sm",
              className: "min-w-8 min-h-8",
              src: urlImage,
            }}
            classNames={{
              base: "hover:opacity-50 cursor-pointer",
              description: "hidden",
              name: "w-max",
            }}
          />
        );

      case "expires":
        return (
          <div className="flex flex-col items-center gap-1 min-w-48">
            <b className="tracking-wide text-danger">
              {expiryDate?.format("DD/MM/YYYY")}
            </b>
            <div className="flex justify-center gap-2">
              <span>Còn lại:</span>
              <b className="text-blue-400">
                {totalDays} ngày {remainingHours} giờ
              </b>
            </div>
          </div>
        );

      case "createdAt":
        return (
          <p className="tracking-wide">
            {moment(item?.createdAt).format("HH:mm DD-MM-YYYY")}
          </p>
        );

      case "note":
        return (
          <Tooltip
            radius="sm"
            content={cellValue}
            classNames={{
              content: "max-w-xs max-h-72 overflow-auto scroll-main",
            }}
          >
            <span className="line-clamp-2 tracking-wide">{cellValue}</span>
          </Tooltip>
        );

      case "actions":
        return (
          <div className="flex justify-center gap-2">
            <ActionsCell
              disableDelete={true}
              disableUpdate={true}
              actionsAdd={addNewActions}
            />
            {!isTP && (isTroLy || isRoleIt) ? (
              <></>
            ) : (
              <Tooltip
                content={"Chỉnh sửa"}
                className={`capitalize  text-black`}
              >
                <Button
                  variant="solid"
                  radius="full"
                  className={`bg-primary min-w-0 w-max p-[7px] h-max min-h-max`}
                  onClick={() => {
                    setDataInit(item);
                    setModalState((prev) => ({ ...prev, isAddEditOpen: true }));
                  }}
                >
                  <MdModeEditOutline color="white" />
                </Button>
              </Tooltip>
            )}

            {!isTP && (
              <Tooltip
                content={"Xem thông tin Aapanel"}
                className={`capitalize  text-black`}
              >
                <Button
                  variant="solid"
                  radius="full"
                  className={`bg-gray-200 min-w-0 w-max p-[7px] h-max min-h-max`}
                  onClick={() => {
                    handleGetAapanel(item._id);
                  }}
                >
                  <GoCodeSquare color="black" />
                </Button>
              </Tooltip>
            )}

            {!isTP && (isTroLy || isRoleIt) ? (
              <></>
            ) : (
              <Tooltip content={"Xóa"} className={`capitalize  text-black`}>
                <Button
                  variant="solid"
                  radius="full"
                  className={`bg-red-500 min-w-0 w-max p-[7px] h-max min-h-max`}
                  onClick={() => {
                    setSelectedKeys(new Set([item._id]));
                    setModalState((prev) => ({
                      ...prev,
                      isDeleteOpen: true,
                    }));
                  }}
                >
                  <MdDelete color="white" />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      case "sites":
        return <p className="!text-xs ">{cellValue}</p>;
      default:
        return cellValue;
    }
  };

  const [modalState, setModalState] = useState({
    isAddEditOpen: false,
    isDeleteOpen: false,
    isOpenAapanel: false,
  });
  const [dataInit, setDataInit] = useState(null);
  const tableVpsOrther: any = useAppSelector(
    (state) => state.table["vps_orther"]
  );
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
  return (
    <Container>
      <TableControl
        tableId={"vps_orther"}
        columns={columns}
        data={vpsList}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
        selectionMode="multiple"
      />
      <ModalAddVps
        dataInit={dataInit}
        isOpen={modalState.isAddEditOpen}
        onClose={() =>
          setModalState((prev) => ({ ...prev, isAddEditOpen: false }))
        }
        setDataInit={setDataInit}
        reloadTable={fetchData}
      />
      {modalState.isDeleteOpen && (
        <ModalDeleteVps
          isOpen={modalState.isDeleteOpen}
          onClose={() =>
            setModalState((prev) => ({
              ...prev,
              isDeleteOpen: false,
            }))
          }
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          reloadTable={fetchData}
        />
      )}
      <ModalAapanel
        isOpen={modalState.isOpenAapanel}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            isOpenAapanel: false,
          }))
        }
        aapanel={aapanel}
      />
    </Container>
  );
}

export default TableVpsOrther;
