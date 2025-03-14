import { Status } from "@/components/digital-ocean/Status";
import TableControl from "@/components/table-control";
import { SiGooglecloudstorage } from "react-icons/si";
import { useEffect, useMemo, useState } from "react";
import { convertPriceToUSD, stringInfoVps } from "@/utils/digital-ocean";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Tooltip,
} from "@heroui/react";
import { FaRegCopy } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/stores";
import { IoIosEye } from "react-icons/io";
import showToast from "@/utils/toast";
import Container from "@/components/container";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import {
  classNamesAutoComplete,
  initPropsAutoComplete,
  ROLE_TO_PHO,
} from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { BiSearch } from "react-icons/bi";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import { VscNotebook } from "react-icons/vsc";
import { setModal } from "@/stores/slices/modal-slice";
import NoteCellVps from "./NoteVPSDigitalOcean";
import ActionVPSDigitalOcean from "./detail-vps/ActionVPSDigitalOcean";
import { SubjectEnum } from "@/constants/enum";
import ExportVPSExcelDigitalOcean from "./ExportVPSExcelDigitalOcean";
import moment from "moment";
import { getListVPSBuCloud } from "@/stores/slices/digital-ocean-slice/digital-ocean-vps-bu-cloud.slice";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";

function ManagementVPSBuCloudDigitalOcean() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { permissions, user } = useAppSelector((state) => state.auth);

  const { listVPS, total, totalPrice, isLoading } = useAppSelector(
    (state) => state.digitalOceanVPSBuCloud
  );
  const vpsManagement = useAppSelector(
    (state) => state.table["vpsmanagement_digital_ocean_bucloud"]
  );
  const { teams } = useAppSelector((state) => state.teams);

  const [teamSelected, setTeamSelected] = useState<any>(null);
  const [searchByIp, setSearchByIp] = useState<string>("");
  const [statusVPS, setStatusVPS] = useState<any>(null);

  const searchMatch = useDebounce(searchByIp, 500);
  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }

    if (teamSelected) {
      query["team"] = teamSelected;
    }

    if (statusVPS) {
      query["statusVPS"] = statusVPS;
    }

    if (vpsManagement) {
      const cPageSize = vpsManagement?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...vpsManagement?.pageSize][0]
        : 10;

      if (
        vpsManagement?.sortDescriptor?.direction &&
        vpsManagement?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        vpsManagement?.sortDescriptor?.direction &&
        vpsManagement?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (vpsManagement?.sortDescriptor?.column) {
        query.field = `vps_id.selectedSize.${vpsManagement?.sortDescriptor?.column}`;
      }

      query["pageIndex"] = vpsManagement?.pageIndex || 1;
      query["pageSize"] = cPageSize;

      dispatch(getListVPSBuCloud(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vpsManagement, teamSelected, searchMatch, statusVPS]);

  useEffect(() => {
    if (!teams?.length) {
      dispatch(asyncThunkGetAllYourTeam());
    }

    return () => {};
  }, []);

  const handleCopyDomainName = (item: any) => {
    navigator.clipboard.writeText(item);
  };
  const columns = [
    { _id: "nameVPS", name: "Cấu hình", className: "text-left w-1/4" },
    {
      _id: "price_monthly",
      name: "Giá / Tháng",
      className: "w-[10%]",
      sortable: true,
    },
    { _id: "networks", name: "Địa chỉ IP", className: "w-[10%]" },
    { _id: "created_at", name: "Ngày tạo", className: "w-1/6" },
    { _id: "status", name: "Tình trạng" },
    { _id: "teamName", name: "Team", className: "w-[10%]" },
    { _id: "note", name: "Ghi chú" },

    // { _id: "created_by", name: "Tạo bởi" },
    { _id: "actions", name: "Hành động" },
  ];

  const handleDetailVPS = (item: any) => {
    if (item?.status !== "new") {
      navigate(`/vps/bu-cloud/digital-ocean/${item?._id}/overview`);
    } else {
      showToast("VPS đang được tạo, vui lòng đợi và truy cập lại sau", "info");
      return;
    }
  };
  const handleOpenModalNote = (vps: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "default",
        title: "Ghi chú",
        body: (
          <NoteCellVps
            vps={vps}
            searchByIp={searchByIp}
            teamSelected={teamSelected}
          />
        ),
      })
    );
  };

  const TruncatedText = (text: string) => {
    return (
      <Tooltip
        content={text}
        placement="top"
        classNames={{
          content: "max-w-xs max-h-72 overflow-auto scroll-main",
        }}
      >
        <div className="line-clamp-2 hover:cursor-pointer">{text}</div>
      </Tooltip>
    );
  };
  const [isOpenModalAssignedUser, setIsOpenModalAssignedUser] = useState(false);
  const handleAssingedUser = () => {
    setIsOpenModalAssignedUser(true);
  };
  const isAdmin = useMemo(() => {
    if (!permissions?.length) return false;

    const hasPermission = permissions.some(
      (item: any) => item.subject === SubjectEnum.ALL
    );

    return hasPermission;
  }, [permissions]);
  const dis = useMemo(() => {
    const listSelectedKey = vpsManagement?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [vpsManagement]);
  const isTP = useMemo(() => {
    if (user?.role?._id === ROLE_TO_PHO) {
      return true;
    }

    return false;
  }, [user]);

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "nameVPS":
        return (
          <div className="text-left">
            <div className=" flex gap-4">
              <SiGooglecloudstorage className="my-auto" />
              <p className="font-bold text-[#0069ff]">
                {item.status !== "new" ? (
                  <Link
                    to={`/vps/bu-cloud/digital-ocean/${item?._id}/overview`}
                  >
                    {item?.nameVPS}
                  </Link>
                ) : (
                  item?.nameVPS
                )}
              </p>
            </div>
            <div>
              <p>{stringInfoVps(item)}</p>
            </div>
          </div>
        );
      case "price_monthly":
        return (
          <p className="font-bold">
            {convertPriceToUSD(item?.selectedSize?.price_monthly)}
          </p>
        );
      case "note":
        return TruncatedText(item?.note);
      case "networks":
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
              className="h-8 px-1 rounded-md  text-dark data-[hover=true]:outline-primary data-[hover=true]:outline-1 tracking-wider "
              color="primary"
              variant="flat"
              onPress={() =>
                handleCopyDomainName(item?.networks?.v4[0]?.ip_address)
              }
            >
              <p> {item?.networks?.v4[0]?.ip_address}</p>
            </Button>
          </Tooltip>
        );

      //  <div>{<p>{item?.networks?.v4[0].ip_address}</p>}</div>;

      case "status":
        return Status(item?.status);
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
      case "teamName":
        return <p>{item?.teamName}</p>;
      // case "create_by":
      //     return <p>{item?.created_by}</p>;
      case "actions":
        return (
          <div className="flex gap-2 justify-center">
            <Tooltip
              content={"Ghi chú"}
              color="default"
              className={`capitalize`}
            >
              <Button
                variant="solid"
                radius="full"
                color="default"
                className={`min-w-0 w-max p-[6px] h-max min-h-max bg-default-400`}
                onPress={() => handleOpenModalNote(item)}
              >
                <VscNotebook className="min-w-max text-base w-4 h-4 text-light" />
              </Button>
            </Tooltip>

            {!isTP && isAdmin && (
              <Tooltip
                content={"Xem chi tiết"}
                color="warning"
                className={`capitalize`}
              >
                <Button
                  variant="solid"
                  radius="full"
                  color="warning"
                  className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                  onPress={() => handleDetailVPS(item)}
                >
                  <IoIosEye className="min-w-max text-base w-4 h-4 text-light" />
                </Button>
              </Tooltip>
            )}

            {!isTP && (
              <ActionVPSDigitalOcean
                item={item}
                searchByIp={searchByIp}
                teamSelected={teamSelected}
              />
            )}
          </div>
        );
      default:
        return cellValue;
    }
  };

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "vpsmanagement",
        pageIndex: 1,
      })
    );
  };

  const handleValueChange = (value: any, key: string) => {
    if (key === "search") {
      setSearchByIp(value);
    }

    if (key === "team") {
      setTeamSelected(value);
    }
    if (key === "statusVPS") {
      setStatusVPS(value);
    }
    resetPageIndex();
  };

  const onClear = () => {
    setSearchByIp("");
    dispatch(
      setTablePageIndex({
        tableId: "vpsmanagement",
        pageIndex: 1,
      })
    );
  };
  const statuses = [
    { label: "NEW", value: "new" },
    { label: "INPROGESS", value: "in-progress" },
    { label: "ACTIVE", value: "active" },
    { label: "TERMINATED", value: "terminated" },
    { label: "OFF", value: "off" },
  ];
  const isLeader = useMemo(() => {
    if (user?.role?.name?.toLowerCase() === "leader") {
      return true;
    }

    return false;
  }, [user]);
  return (
    <div className="flex flex-col gap-3">
      {/* Filter By Team */}
      <Container className="flex gap-2 items-center justify-between">
        {/* Filter By Ip */}
        <div className="flex flex-col gap-1">
          <Chip
            variant="solid"
            color="primary"
            radius="sm"
            classNames={{
              content: "tracking-wide font-medium",
            }}
          >
            Tổng: {total}
          </Chip>
          <Chip
            variant="solid"
            color="danger"
            radius="sm"
            classNames={{
              content: "tracking-wide font-medium",
            }}
          >
            Tổng tiền: {convertPriceToUSD(totalPrice)}
          </Chip>
        </div>

        <div className="flex gap-4">
          {(isAdmin || isLeader) && (
            <div className="">
              <Button
                variant="solid"
                color="primary"
                className="bg-blue-500 rounded-md w-full text-white font-bold text-sm items-center"
                onPress={() => {
                  handleAssingedUser();
                }}
                isDisabled={dis}
              >
                Phân quyền người quản lý
              </Button>
            </div>
          )}
          <ExportVPSExcelDigitalOcean
            teamSelected={teamSelected}
            searchByIp={searchByIp}
            statusVPS={statusVPS}
          />
          <Input
            isClearable
            variant="bordered"
            radius="sm"
            className="max-w-xs"
            classNames={{
              inputWrapper:
                "bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
              input: "font-medium",
            }}
            placeholder="Tìm kiếm"
            startContent={<BiSearch className="text-black" />}
            value={searchByIp}
            onClear={onClear}
            onValueChange={(value) => handleValueChange(value, "search")}
          />
          <Autocomplete
            defaultItems={statuses}
            placeholder="Tất cả trạng thái"
            radius="sm"
            variant="bordered"
            inputProps={initPropsAutoComplete}
            classNames={classNamesAutoComplete}
            selectedKey={statusVPS}
            onSelectionChange={(value) => handleValueChange(value, "statusVPS")}
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
          {/* Filter By Team */}
          <div className="w-full">
            <Autocomplete
              defaultItems={teams}
              placeholder="Team"
              radius="sm"
              variant="bordered"
              inputProps={initPropsAutoComplete}
              classNames={classNamesAutoComplete}
              selectedKey={teamSelected}
              onSelectionChange={(value) => handleValueChange(value, "team")}
            >
              {(item) => (
                <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>
      </Container>

      {/* Table Vps */}
      <Container>
        <TableControl
          tableId={"vpsmanagement_digital_ocean_bucloud"}
          columns={columns}
          data={listVPS}
          total={total}
          isLoading={isLoading}
          renderCell={renderCell}
          selectionMode="multiple"
        />
      </Container>
      <ModalAssignedUserToVps
        isOpen={isOpenModalAssignedUser}
        onOpenChange={setIsOpenModalAssignedUser}
      />
    </div>
  );
}

export default ManagementVPSBuCloudDigitalOcean;
