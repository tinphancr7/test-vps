import ActionsCell from "@/components/actions-cell";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppDispatch, useAppSelector } from "@/stores";
import { Button, Chip, Spinner, Tooltip, User } from "@heroui/react";
import ActionsVps from "./actions-vps";
import { FaRegCopy } from "react-icons/fa6";
import moment from "moment";
import { API_IMAGE } from "@/configs/apis";
import { VscNotebook } from "react-icons/vsc";
import { IoIosEye } from "react-icons/io";
import { useMemo } from "react";
import { SubjectEnum } from "@/constants/enum";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import { setModal } from "@/stores/slices/modal-slice";
import NoteCellVps from "./note-cell-vps";
import { publicPlatform } from "@/pages/buy-vps-alibaba-ecs/components/constants";
import { ROLE_TO_PHO } from "@/constants";

function TableBuCloudAlibabaEcs() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { instancesList, isLoading, totalInstancesList } = useAppSelector(
        (state) => state.alibabaEcs
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
            case "Pending":
            case "Stopping":
                return "warning";

            case "Running":
                return "success";

            default:
                return "danger";
        }
    };

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
    };

    const handleNavigateToDetail = (id: string) => {
        navigate(`${paths.vps_management_bucloud_alibaba_ecs}/${id}/overview`);
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

        // eslint-disable-next-line no-unsafe-optional-chaining
        const [imageName] = item["vps_id"]?.InstanceName?.split('-');
        const findImage = Object.keys(publicPlatform)?.find(
            it => it.toLowerCase().includes(imageName.toLowerCase())
        ) as string;

        switch (columnKey) {
            case "configure":
                return (
                    <div className="flex flex-col gap-1">
                        <div className="text-left font-bold text-primary-500 cursor-pointer break-words">
                            {item["vps_id"]?.["InstanceName"] || "Trống"}
                        </div>

                        <div className="flex items-center gap-1">
                            <img
                                src={`/imgs/alibaba-ecs/${(publicPlatform as any)[findImage]?.icon}`}
                                className="w-[24px]"
                                alt={item["vps_id"]?.ImageId}
                            />

                            <div className="text-base text-left">
                                <b>{item["vps_id"]?.Cpu}</b>{" "}
                                    vCPUs -{" "}
                                <b>{(item["vps_id"]?.Memory / 1024).toFixed(1)}</b>{" "}
                                    GB RAM -{" "}
                                <b>
                                    {item["vps_id"]?.Size || 0}
                                </b>{" "}
                                GB DISK
                            </div>
                        </div>
                    </div>
                );

            case "price":
                // eslint-disable-next-line no-case-declarations
                const calculatorTotal =
                    item["vps_id"]?.Price * 1.1;

                return (
                    <p className="font-semibold tracking-wider">
                        {calculatorTotal?.toFixed(2)}
                    </p>
                );

            case "status":
                return (
                    <div className="flex items-center justify-center">
                        <Chip
                            color={
                                item["vps_id"]?.["Status"]
                                    ? colorStatus(
                                          item["vps_id"]?.["Status"]
                                      )
                                    : "default"
                            }
                            variant="flat"
                            radius="sm"
                            classNames={{
                                content:
                                    "font-semibold tracking-wider flex items-center gap-2 capitalize",
                            }}
                        >
                            {item["vps_id"]?.["Status"] === "Pending" && (
                                <Spinner size="sm" aria-label="Loading..." />
                            )}

                            {item["vps_id"]?.["Status"] || "Trống"}
                        </Chip>
                    </div>
                );

            case "publicIpAddress":
                if (!item["vps_id"]["PublicIpAddress"]?.["IpAddress"]?.length) {
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
                            onPress={() =>
                                handleCopy(item["vps_id"]["PublicIpAddress"]?.["IpAddress"]?.[0])
                            }
                        >
                            {item["vps_id"]["PublicIpAddress"]?.["IpAddress"]?.[0]}
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
                            content:
                                "max-w-xs max-h-72 overflow-auto scroll-main",
                        }}
                    >
                        <span className="line-clamp-2 tracking-wide">
                            {cellValue}
                        </span>
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
                            <ActionsVps item={item["vps_id"]} />
                        )}
                    </div>
                );

            default:
                return cellValue;
        }
    };

    return (
        <Container>
            <TableControl
                tableId={"vps_bucloud_alibaba_ecs"}
                columns={columns}
                data={instancesList}
                total={totalInstancesList}
                isLoading={isLoading?.fetch}
                renderCell={renderCell}
                selectionMode="multiple"
            />
        </Container>
    );
}

export default TableBuCloudAlibabaEcs;
