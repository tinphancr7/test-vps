/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-prototype-builtins */
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { osTemplate } from "@/constants/os-templates";
import { useAppDispatch, useAppSelector } from "@/stores";
import { Avatar, Button, Chip, Spinner, Tooltip, User } from "@heroui/react";
import { Switch } from "@heroui/switch";
import moment from "moment";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import RenderIconOs from "../../../components/render-icon-os";
import { IoIosEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import { API_IMAGE } from "@/configs/apis";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VscNotebook } from "react-icons/vsc";
import ActionsCell from "@/components/actions-cell";
import { setModal } from "@/stores/slices/modal-slice";
import NoteCellVps from "./note-cell-vps";
import LabelCellVps from "./label-cell-vps";
import ActionsVps from "./actions-vps";
import { SubjectEnum } from "@/constants/enum";
import { IoClose } from "react-icons/io5";
import { setTableSelectedKeys } from "@/stores/slices/table-slice";
import vpsApis from "@/apis/vps-apis";
import { asyncThunkPaginationVpsVng } from "@/stores/async-thunks/vps-vng-thunk";
import showToast from "@/utils/toast";
import ModalAapanel from "@/pages/vps-orther/components/ModalAapanel";
import { toast } from "react-toastify";
import { GoCodeSquare } from "react-icons/go";
import { ROLE_TO_PHO } from "@/constants";
import { TbWorldWww } from "react-icons/tb";
import siteApi from "@/apis/site.api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
function TableVpsVng() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { permissions, user } = useAppSelector((state) => state.auth);
  const { vpsList, total, isLoading, search } = useAppSelector(
    (state) => state.vpsVng
  );
  useEffect(() => {
    dispatch(
      setTableSelectedKeys({
        tableId: "vps_vng",
        selectedKeys: [],
      })
    );
  }, []);

  const vpsRenew: any = useMemo(() => {
    if (vpsList.length) {
      return vpsList?.reduce((curr, it) => {
        curr[it?._id] = it?.vps_id?.autorenew === "1" ? true : false;
        return curr;
      }, {});
    }
    return {};
  }, [vpsList]);

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

  const isTP = useMemo(() => {
    if (user?.role?._id === ROLE_TO_PHO) {
      return true;
    }

    return false;
  }, [user]);

  const columns = [
    { _id: "configure", name: "Cấu hình", className: "text-left w-[500px]" }, //,
    { _id: "total", name: "Giá", sortable: true, className: "w-[200px]" },
    { _id: "ip", name: "Địa chỉ IP", className: "w-[10%]" },
    { _id: "status", name: "Trạng thái" },
    // {_id: "os", name: "Hệ điều hành"},
    { _id: "team", name: "Team" },
    // { _id: "created_by", name: "Tạo bởi" },
    { _id: "expires", name: "Ngày hết hạn", sortable: true },
    // { _id: "createdAt", name: "Ngày tạo" },
    {
      _id: "sites",
      name: "Số lượng site",
      sortable: true,
      className: "text-left ",
    },
    { _id: "uRLAaPanel", name: "URL Aapanel" },
    { _id: "note", name: "Ghi chú" },
    { _id: "autorenew", name: "Tự động Gia hạn" },
    { _id: "actions", name: "Hành động" },
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

  const handleNavigateToDetail = useCallback(
    (id: string) => {
      navigate(`${paths.vps_management_vng}/${id}/overview`);
    },
    [navigate]
  );

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
  const handleRenewVPS = async (item: any, value: any) => {
    const result = await vpsApis.autoRenewVPS({ item, value });
    if (!result?.data?.status) {
      showToast(
        `${value ? "Bật" : "Tắt"} dịch vụ tự động gia hạn không thành công`,
        "error"
      );
      return;
    }
    dispatch(asyncThunkPaginationVpsVng(search));
    showToast(
      `${value ? "Bật" : "Tắt"} dịch vụ tự động gia hạn thành công`,
      "success"
    );
  };
  const handleExportListSiteVps = async (vps: any) => {
    try {
      const response = await siteApi.callFetchListSiteFollowVpsId({
        vps_id: vps?.vps_id?._id || "",
      });

      if (response?.status !== 200)
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");

      const siteList = response?.data?.data || [];

      const workbook = new ExcelJS.Workbook();

      const siteSheet = workbook.addWorksheet(
        `Danh sách site của VPS - ${vps?.vps_id?.ip}`
      );
      const title = `Danh sách site của VPS - ${vps?.vps_id?.ip}`;
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
      const fileName = `VPS_Sites_${vps?.vps_id?.ip}.xlsx`;
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
  const renderCell = useCallback(
    (item: any, columnKey: string) => {
      const cellValue = item[columnKey];
      const urlImage = item?.created_by?.avatar
        ? `${API_IMAGE}/${item?.created_by?.avatar}`
        : "";
      const findOs = osTemplate?.find(
        (os) => os?.name === item["vps_id"]["os"]
      );

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
          isDisabled: !isTP && (isAdmin || isLeader) ? false : true,
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
      const expiryDate = moment(item["vps_id"]["expires"]);
      const duration = moment.duration(expiryDate.diff(now));

      // Tính tổng số ngày giữa hai thời điểm
      const totalDays = Math.floor(duration.asDays());

      // Tính số giờ còn lại sau khi đã tính số ngày
      const remainingHours = duration.subtract(totalDays, "days").hours();

      switch (columnKey) {
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
                    {item["vps_id"]?.["vm"]?.["label"] ||
                      item["vps_id"]?.["product_name"] ||
                      "Trống"}
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
                    <p>{item?.vps_id?.vm?.memory / 1024 || 0} GB</p>
                  </div>
                  |
                  <div className="flex items-center gap-0.5  min-w-max">
                    <p className="">{item?.vps_id?.vm?.cores || 0} </p>
                    <h3>vCPUs</h3>
                  </div>
                  |
                  <div className="flex items-center justify-center gap-0.5  min-w-max">
                    <p className="">{item?.vps_id?.vm?.disk || 0} GB</p>
                    <h3 className="uppercase">Disk</h3>
                  </div>
                </div>
              </div>
            </div>
          );

        case "total": {
          const calculatorTotal =
            convertVnToUsd(cellValue) + convertVnToUsd(cellValue * 0.1);
          const price = Math.floor(calculatorTotal * 100) / 100;
          return (
            <p className="font-medium tracking-wider">
              {price.toFixed(2)}
              <b>$</b>
            </p>
          );
        }

        case "uRLAaPanel": {
          if (!item["vps_id"]["uRLAaPanel"]) {
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
                className="h-8 px-2 rounded-md text-blue-500 font-medium  data-[hover=true]:outline-primary data-[hover=true]:outline-1 tracking-wider"
                onPress={() => handleCopy(item["vps_id"]["uRLAaPanel"])}
              >
                <span className="max-w-36 line-clamp-1 text-nowrap">
                  {item["vps_id"]?.["uRLAaPanel"]}
                </span>
                {item["vps_id"]?.["isActiveAapanel"] ? (
                  <span className="text-green-500">
                    <FaCheck />
                  </span>
                ) : (
                  <span className="text-red-500">
                    <IoClose />
                  </span>
                )}
              </Button>
            </Tooltip>
          );
        }

        case "status":
          return (
            <div className="flex items-center justify-center">
              <Chip
                color={
                  item["vps_id"]?.["status"]
                    ? colorStatus(item["vps_id"]?.["status"])
                    : "default"
                }
                variant="flat"
                radius="sm"
                classNames={{
                  content:
                    "font-semibold tracking-wider flex items-center gap-2",
                }}
              >
                {item["vps_id"]?.["status"] === "Pending" && (
                  <Spinner size="sm" aria-label="Loading..." />
                )}

                {item["vps_id"]?.["status"] || "Trống"}
              </Chip>
            </div>
          );

        case "ip":
          if (!item["vps_id"]["ip"]) {
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
                onPress={() => handleCopy(item["vps_id"]["ip"])}
              >
                {item["vps_id"]?.["ip"]}
              </Button>
            </Tooltip>
          );

        case "os":
          return (
            <div className="flex items-center justify-center gap-2">
              {findOs ? (
                <>
                  <RenderIconOs osName={findOs?.name} />
                  <p className="tracking-wide">{item["vps_id"]?.["os"]}</p>
                </>
              ) : (
                <Spinner size="sm" aria-label="Loading..." />
              )}
            </div>
          );

        case "team":
          return (
            <div className="flex items-center justify-center">
              {cellValue?.name}
            </div>
          );
        case "autorenew":
          return (
            <Switch
              isSelected={vpsRenew[item?._id]}
              onValueChange={(value: any) => {
                handleRenewVPS(item, value);
              }}
            />
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
                content: "max-w-36  max-h-36 overflow-auto scroll-main",
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

              {!isTP && (
                <>
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
                  <ActionsVps
                    id={item?._id}
                    vm={item["vps_id"]?.["vm"]}
                    serviceId={item["vps_id"]?.["id"]}
                  />
                </>
              )}
            </div>
          );
        case "sites":
          return <p className="!text-xs ">{cellValue}</p>;
        default:
          return cellValue;
      }
    },
    [vpsRenew]
  );
  const [aapanel, setAapanel] = useState({});
  const [modalState, setModalState] = useState({
    isOpenAapanel: false,
  });
  const handleGetAapanel = async (_id: string) => {
    try {
      const response = await vpsApis.getAapanel(_id);
      setAapanel(response?.data?.data);
      setModalState((prev) => ({
        ...prev,
        isOpenAapanel: true,
      }));
    } catch (error: any) {
      toast("Bạn không có quyền truy cập!");
    }
  };
  return (
    <Container>
      <TableControl
        tableId={"vps_vng"}
        columns={columns}
        data={vpsList}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
        selectionMode="multiple"
      />
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

export default TableVpsVng;
