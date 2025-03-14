/* eslint-disable no-case-declarations */
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppDispatch, useAppSelector } from "@/stores";
import { Avatar, Button, Chip, Spinner, Tooltip, User } from "@heroui/react";
import moment from "moment";
import { FaRegCopy } from "react-icons/fa6";
import RenderIconOs from "../../../../../components/render-icon-os";
import {
  IoIosEye,
  IoMdCheckmarkCircleOutline,
  IoMdInformationCircleOutline,
  IoMdPower,
} from "react-icons/io";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import { API_IMAGE } from "@/configs/apis";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useCallback, useMemo } from "react";
import { VscNotebook } from "react-icons/vsc";
import ActionsCell from "@/components/actions-cell";
import { setModal } from "@/stores/slices/modal-slice";
import NoteCellVps from "./note-cell-vps";
import ActionsVps from "./actions-vps";
import { SubjectEnum } from "@/constants/enum";
import { formatPrice } from "@/utils/format-price";
import { convertToMemory } from "@/utils";
import { osOptions, ROLE_TO_PHO } from "@/constants";

function TableVpsScaleWay() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { permissions, user } = useAppSelector((state) => state.auth);
  const { vpsList, isLoading } = useAppSelector((state) => state.scaleway);

  const isAdmin = useMemo(() => {
    if (!permissions?.length) return false;

    const hasPermission = permissions.some(
      (item: any) => item.subject === SubjectEnum.ALL
    );

    return hasPermission;
  }, [permissions]);

  const isTP = useMemo(() => {
    if (user?.role?._id === ROLE_TO_PHO) {
      return true;
    }

    return false;
  }, [user]);

  const columns = [
    { _id: "configure", name: "Cấu hình", className: "text-left w-1/5" },
    { _id: "total", name: "Giá/tháng", sortable: true },
    { _id: "ip", name: "Địa chỉ IP", className: "w-[10%]" },
    { _id: "status", name: "Trạng thái" },
    { _id: "team", name: "Team" },
    { _id: "created_at", name: "Ngày tạo" },
    { _id: "note", name: "Ghi chú" },
    { _id: "actions", name: "Hành động" },
  ];

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleNavigateToDetail = useCallback(
    (id: string) => {
      navigate(`${paths.vps_manage_bu_cloud_scaleway}/${id}`);
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

  // const handleUpdateHostName = (vps: any) => {
  // 	dispatch(
  // 		setModal({
  // 			isOpen: true,
  // 			placement: "default",
  // 			title: "Chỉnh sửa nhãn",
  // 			body: <LabelCellVps vps={vps} />,
  // 		})
  // 	);
  // };

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    const urlImage = item?.created_by?.avatar
      ? `${API_IMAGE}/${item?.created_by?.avatar}`
      : "";
    const findOs = (value: any) =>
      osOptions.find((os: any) => value?.includes(os?.name));

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
        isDisabled: !isTP && isAdmin ? false : true,
        onPress: () => {
          handleNavigateToDetail(item?._id);
        },
      },
    ];

    switch (columnKey) {
      case "configure":
        return (
          <div className="flex items-end gap-4">
            <div>
              <div
                className="flex items-start font-bold text-primary-500 cursor-pointer"
                // onClick={() => handleUpdateHostName(item)}
              >
                {item["vps_id"]?.hostname || "Trống"}
              </div>

              <div className="flex items-center flex-nowrap gap-1">
                <div className="flex items-center gap-1">
                  <Avatar
                    src={`/icons/${
                      findOs(item["vps_id"]?.image?.name)?.logoUrl
                    }`}
                    className="w-5 h-5 text-large bg-transparent ring-default ring-1"
                  />
                </div>
                <div className="flex items-center justify-center gap-0.5">
                  <b>
                    {convertToMemory(item["vps_id"]?.instanceType?.ram) || 0}
                  </b>{" "}
                  GB RAM
                </div>
                |
                <div className="flex items-center gap-0.5">
                  <b>{item["vps_id"]?.instanceType?.ncpus ?? 0}</b>
                  <h3>vCPUs</h3>
                </div>
                |
                <div className="flex items-center justify-center gap-0.5">
                  <b>
                    {Number(item["vps_id"]?.volumes?.size) / 1000000000 || 0}
                  </b>{" "}
                  GB DISK
                </div>
              </div>
            </div>
          </div>
        );

      case "total":
        const calculatorTotal = item["vps_id"]?.price ?? 0;

        return (
          <p className="font-medium tracking-wider">
            {formatPrice(convertVnToUsd(calculatorTotal, "VNG"))}
            <b>$</b>
          </p>
        );

      case "status":
        const status = item["vps_id"].state ?? "unknown";
        let statusColor:
          | "warning"
          | "default"
          | "primary"
          | "secondary"
          | "success"
          | "danger"
          | undefined = "danger";
        let statusIcon = <IoMdInformationCircleOutline />;
        let statusText = "warning";

        if (status === "running") {
          statusColor = "success";
          statusIcon = <IoMdCheckmarkCircleOutline />;
          statusText = "Running";
        } else if (status === "stopped") {
          statusColor = "danger";
          statusIcon = <IoMdPower />;
          statusText = "Stopped";
        } else if (status === "maintenance") {
          statusColor = "default";
          statusIcon = <IoMdInformationCircleOutline />;
          statusText = "Maintenance";
        } else if (status === "error") {
          statusColor = "warning";
          statusIcon = <IoMdPower />;
          statusText = "Error";
        }

        return (
          <Chip
            color={statusColor ?? "default"}
            variant="flat"
            radius="sm"
            classNames={{
              content:
                "font-semibold tracking-wider flex items-center gap-2 capitalize",
            }}
          >
            {item["vps_id"]?.["state"] === "pending" && (
              <Spinner size="sm" aria-label="Loading..." />
            )}
            {statusIcon}
            {statusText || "Trống"}
          </Chip>
        );

      case "ip":
        const publicIPv4 = item["vps_id"]?.publicIp?.address;

        if (!publicIPv4) {
          return (
            <div className="col-span-1 flex items-center justify-center gap-2">
              <Spinner color="primary" size="sm" />
              <i className="text-sm">Đang cập nhật</i>
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
              onPress={() => handleCopy(publicIPv4)}
            >
              {publicIPv4}
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

      case "created_at": {
        const currentDate: any = new Date();
        const createdAt: any = new Date(item?.createdAt);
        let timeDifference = currentDate - createdAt;

        if (item?.status === "terminated") {
          const updateAt: any = new Date(item?.updatedAt);
          timeDifference = currentDate - updateAt;
        }
        const daysUsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        return (
          <>
            <p>{moment(item?.createdAt).format("DD-MM-YYYY")}</p>
            <p className="text">
              Số ngày sử dụng: <strong>{daysUsed} ngày</strong>
            </p>
          </>
        );
      }

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

            {!isTP && <ActionsVps id={item?.id} vm={item["vps_id"]} />}
          </div>
        );

      default:
        return cellValue;
    }
  };

  return (
    <Container>
      <TableControl
        tableId={"vps_scaleway"}
        columns={columns}
        data={vpsList?.result || []}
        // @ts-ignore
        total={vpsList?.meta?.totalPages || 0}
        isLoading={isLoading}
        renderCell={renderCell}
        selectionMode="multiple"
      />
    </Container>
  );
}

export default TableVpsScaleWay;
