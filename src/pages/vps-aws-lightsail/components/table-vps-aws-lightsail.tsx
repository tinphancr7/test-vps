import ActionsCell from "@/components/actions-cell";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppDispatch, useAppSelector } from "@/stores";
import ActionsVps from "./actions-vps";
import { Button, Chip, Spinner, Tooltip, User } from "@heroui/react";
import moment from "moment";
import { FaRegCopy } from "react-icons/fa6";
import { API_IMAGE } from "@/configs/apis";
import { VscNotebook } from "react-icons/vsc";
import { IoIosEye } from "react-icons/io";
import { useMemo } from "react";
import { SubjectEnum } from "@/constants/enum";
import NoteCellVps from "./note-cell-vps";
import { setModal } from "@/stores/slices/modal-slice";
import paths from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import { convertPriceToUSD } from "@/utils/digital-ocean";
import { genAWSImageBlueprint } from "@/utils/collections/aws";
import { ROLE_TO_PHO } from "@/constants";

function TableAwsLightsail() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { instancesList, total, isLoading } = useAppSelector(
    (state) => state.awsLightsail
  );
  const { permissions, user } = useAppSelector((state) => state.auth);

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
    { _id: "configure", name: "Cấu hình", className: "text-left w-1/5" },
    { _id: "price", name: "Giá", sortable: true },
    { _id: "publicIpAddress", name: "Địa chỉ IP", className: "w-[10%]" },
    { _id: "status", name: "Trạng thái" },
    { _id: "team", name: "Team" },
    { _id: "createdAt", name: "Ngày tạo" },
    { _id: "note", name: "Ghi chú" },
    { _id: "actions", name: "Hành động" },
  ];

  const colorStatus = (type: string) => {
    switch (type) {
      case "pending":
      case "stopping":
        return "warning";

      case "running":
        return "success";

      default:
        return "danger";
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleNavigateToDetail = (id: string) => {
    navigate(`${paths.vps_manage_bu_cloud_aws_lightsail}/${id}/overview`);
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

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    const urlImage = item?.created_by?.avatar
      ? `${API_IMAGE}/${item?.created_by?.avatar}`
      : "";

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
    ];

    const now = moment();
    const expiryDate = moment(item?.createdAt);
    const duration = moment.duration(now.diff(expiryDate));

    // Calculate total number of days between the two dates
    const totalDays = Math.floor(duration.asDays());

    // Calculate the remaining hours directly
    const remainingHours = duration.hours();

    switch (columnKey) {
      case "configure":
        return (
          <div className="flex flex-col gap-1">
            <div className="text-left font-bold text-primary-500 cursor-pointer break-words">
              {item["vps_id"]?.["name"] || "Trống"}
            </div>

            <div className="flex items-center gap-1">
              <img
                src={genAWSImageBlueprint(item["vps_id"]?.blueprintId)}
                className="w-[24px]"
                alt={item["vps_id"]?.blueprintName}
              />

              <div className="text-base text-left">
                <b>{item["vps_id"]?.hardware?.cpuCount}</b> vCPUs -{" "}
                <b>{item["vps_id"]?.hardware?.ramSizeInGb}</b> GB RAM -{" "}
                <b>{item["vps_id"]?.hardware?.disks?.[0]?.sizeInGb}</b> GB DISK
              </div>
            </div>
          </div>
        );

      case "price":
        // eslint-disable-next-line no-case-declarations
        const calculatorTotal =
          item["vps_id"]?.price + item["vps_id"]?.price * 0.1;

        return (
          <p className="font-semibold tracking-wider">
            {convertPriceToUSD(calculatorTotal)}
          </p>
        );

      case "status":
        return (
          <div className="flex items-center justify-center">
            <Chip
              color={
                item["vps_id"]?.["state"]?.["name"]
                  ? colorStatus(item["vps_id"]?.["state"]?.["name"])
                  : "default"
              }
              variant="flat"
              radius="sm"
              classNames={{
                content:
                  "font-semibold tracking-wider flex items-center gap-2 capitalize",
              }}
            >
              {item["vps_id"]?.["state"]?.["name"] === "Pending" && (
                <Spinner size="sm" aria-label="Loading..." />
              )}

              {item["vps_id"]?.["state"]?.["name"] || "Trống"}
            </Chip>
          </div>
        );

      case "publicIpAddress":
        if (!item["vps_id"]?.publicIpAddress) {
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
              onPress={() => handleCopy(item["vps_id"]["publicIpAddress"])}
            >
              {item["vps_id"]?.["publicIpAddress"]}
            </Button>
          </Tooltip>
        );

      case "team":
        return (
          <div className="flex items-center justify-center font-medium">
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

      case "createdAt":
        return (
          <div className="flex flex-col items-center gap-1 min-w-48">
            <b className="tracking-wide text-danger">
              {expiryDate?.format("DD/MM/YYYY")}
            </b>
            <div className="flex justify-center gap-2">
              <span>Đã sử dụng:</span>
              <b className="text-blue-400">
                {totalDays} ngày {remainingHours} giờ
              </b>
            </div>
          </div>
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

            {!isTP && <ActionsVps id={item?._id} item={item["vps_id"]} />}
          </div>
        );

      default:
        return cellValue;
    }
  };

  return (
    <Container>
      <TableControl
        tableId={"vps_aws_lightsail"}
        columns={columns}
        data={instancesList}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
        selectionMode="multiple"
      />
    </Container>
  );
}

export default TableAwsLightsail;
