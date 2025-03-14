/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-prototype-builtins */
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { osTemplate } from "@/constants/os-templates";
import { useAppDispatch, useAppSelector } from "@/stores";
import { Avatar, Button, Chip, Spinner, Tooltip, User } from "@heroui/react";

import moment from "moment";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import RenderIconOs from "../../../components/render-icon-os";

import { API_IMAGE } from "@/configs/apis";
import { convertVnToUsdFollowProviderId } from "@/utils/vn-to-usd";
import { useCallback, useEffect } from "react";

import { IoClose } from "react-icons/io5";
import { setTableSelectedKeys } from "@/stores/slices/table-slice";

function TableVpsGeneral() {
  const dispatch = useAppDispatch();

  const { vpsList, total, isLoading } = useAppSelector(
    (state) => state.vpsGeneral
  );
  useEffect(() => {
    dispatch(
      setTableSelectedKeys({
        tableId: "vps_general",
        selectedKeys: [],
      })
    );
  }, []);

  const columns = [
    { _id: "configure", name: "Cấu hình", className: "text-left w-[500px]" },
    {
      _id: "provider",
      name: "Nhà cung cấp",
      className: "w-[200px]",
    },
    { _id: "total", name: "Giá", sortable: true, className: "w-[200px]" },
    { _id: "ip", name: "Địa chỉ IP", className: "w-[10%]" },
    { _id: "status", name: "Trạng thái" },
    { _id: "team", name: "Team" },
    { _id: "expires", name: "Ngày hết hạn", sortable: true },
    {
      _id: "sites",
      name: "Số lượng site",
      sortable: true,
      className: "text-left ",
    },
    { _id: "uRLAaPanel", name: "URL Aapanel" },
    { _id: "note", name: "Ghi chú" },
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

  const renderCell = useCallback((item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    const urlImage = item?.created_by?.avatar
      ? `${API_IMAGE}/${item?.created_by?.avatar}`
      : "";
    const findOs = osTemplate?.find((os) => os?.name === item["vps_id"]["os"]);

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
              <div className="flex items-start font-bold text-primary-500 cursor-pointer">
                {item["vps_id"]?.["vm"]?.["label"] ||
                  item["vps_id"]?.["product_name"] ||
                  "Trống"}
              </div>

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
          convertVnToUsdFollowProviderId(
            cellValue,
            item["vps_id"]?.["provider"]?.["_id"]
          ) +
          convertVnToUsdFollowProviderId(
            cellValue * 0.1,
            item["vps_id"]?.["provider"]?.["_id"]
          );
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
                content: "font-semibold tracking-wider flex items-center gap-2",
              }}
            >
              {item["vps_id"]?.["status"] === "Pending" && (
                <Spinner size="sm" aria-label="Loading..." />
              )}

              {item["vps_id"]?.["status"] || "Trống"}
            </Chip>
          </div>
        );
      case "provider":
        return (
          <div className="col-span-1 flex items-center justify-center gap-2">
            <i className="text-base font-medium">
              {item["vps_id"]?.["provider"]?.["name"] || "(Trống)"}
            </i>
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

      case "sites":
        return <p className="!text-xs ">{cellValue}</p>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <Container>
      <TableControl
        tableId={"vps_general"}
        columns={columns}
        data={vpsList}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
        selectionMode="none"
      />
    </Container>
  );
}

export default TableVpsGeneral;
