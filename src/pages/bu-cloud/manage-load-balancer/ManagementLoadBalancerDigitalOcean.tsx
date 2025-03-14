import { Status } from "@/components/digital-ocean/Status";
import TableControl from "@/components/table-control";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Tooltip,
} from "@heroui/react";
import { FaRegCopy, FaRegTrashCan } from "react-icons/fa6";
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
import { BiSearch } from "react-icons/bi";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import { useDebounce } from "@/hooks/useDebounce";
import { VscNotebook } from "react-icons/vsc";
import { setModal } from "@/stores/slices/modal-slice";
import NoteCellVps from "./NoteLoadBalancerDigitalOcean";
import { SubjectEnum } from "@/constants/enum";
import ExportLBExcelDigitalOcean from "./ExportLBExcelDigitalOcean";
import ModalConfirmDestroy from "./detail-load-balancer/destroy/ModalConfirmDestroy";
import {
  getListLoadBalancer,
  setSearch,
} from "@/stores/slices/digital-ocean-slice/digital-ocean-load-balancer-bu-cloud.slice";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";

function ManagementLoadBalancerDigitalOceanBuCloud() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { permissions, user } = useAppSelector((state) => state.auth);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [infoDetail, setInfoDetail] = useState<any>();

  // Begin: Redux Store
  const { listLoadBalancer, total, isLoading } = useAppSelector(
    (state) => state.digitalOceanLoadBalancerBuCloud
  );
  const [statusVPS, setStatusVPS] = useState<any>(null);

  const loadBalancerManagement = useAppSelector(
    (state) => state.table["loadbalancer-management-bucloud"]
  );
  const dis = useMemo(() => {
    const listSelectedKey = loadBalancerManagement?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [loadBalancerManagement]);
  const { teams } = useAppSelector((state) => state.teams);
  // End: Redux Store

  // Begin: Fitler Vps
  const [teamSelected, setTeamSelected] = useState<any>(null);
  const [searchByIp, setSearchByIp] = useState<string>("");

  const searchMatch = useDebounce(searchByIp, 500);
  // End: Fitler Vps

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
    if (loadBalancerManagement) {
      const cPageSize = loadBalancerManagement?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...loadBalancerManagement?.pageSize][0]
        : 10;

      query["pageIndex"] = loadBalancerManagement?.pageIndex || 1;
      query["pageSize"] = cPageSize;
      dispatch(setSearch(query));
      dispatch(getListLoadBalancer(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadBalancerManagement, teamSelected, searchMatch, statusVPS]);

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
    {
      _id: "nameLoadBalancer",
      name: "Tên Load Balancer",
      className: "text-left w-1/6",
    },
    { _id: "networks", name: "Địa chỉ IP", className: "w-[10%]" },
    { _id: "status", name: "Tình trạng" },
    // { _id: "created_at", name: "Ngày tạo" },
    { _id: "teamName", name: "Team" },
    // { _id: "created_by", name: "Nguời tạo" },
    { _id: "note", name: "Ghi chú" },
    { _id: "actions", name: "Hành động" },
  ];

  const handleDetailLoadBalancer = (item: any) => {
    if (item?.status !== "new") {
      navigate(
        `/vps/bu-cloud/load-balancer-digital-ocean/${item?._id}/overview`
      );
    } else {
      showToast(
        "Load Balancer đang được tạo, vui lòng đợi và truy cập lại sau",
        "info"
      );
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

  const handleDestroyLoadBalancer = (item: any) => {
    setOpenModalConfirm(true);
    setInfoDetail(item);
  };
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "nameLoadBalancer":
        return (
          <div className="text-left">
            <div className=" flex gap-4">
              {/* <SiGooglecloudstorage className="my-auto" /> */}
              <p className="font-bold text-[#0069ff]">
                {item.status !== "new" ? (
                  <Link
                    to={`/vps/bu-cloud/load-balancer-digital-ocean/${item?._id}/overview`}
                  >
                    {item?.name_load_balancer}
                  </Link>
                ) : (
                  item?.name_load_balancer
                )}
              </p>
            </div>
            <div>{/* <p>{stringInfoVps(item)}</p> */}</div>
          </div>
        );
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
              className="h-8 px-1 rounded-md bg-transparent  "
              onPress={() => handleCopyDomainName(item?.ip)}
            >
              <p className="font-bold"> {item?.ip}</p>
            </Button>
          </Tooltip>
        );

      //  <div>{<p>{item?.networks?.v4[0].ip_address}</p>}</div>;

      case "status":
        return Status(item?.status);
      case "created_at":
        return <p>{moment(item?.created_at).format("DD-MM-YYYY HH:mm:ss")}</p>;
      case "create_by":
        return <p>{item?.created_by}</p>;
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
            {!isTP && (isAdmin || isLeader) && (
              <>
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
                    onPress={() => handleDetailLoadBalancer(item)}
                  >
                    <IoIosEye className="min-w-max text-base w-4 h-4 text-light" />
                  </Button>
                </Tooltip>
                <Tooltip
                  content={"Hủy Load Balancer"}
                  color="danger"
                  className={`capitalize`}
                >
                  <Button
                    variant="solid"
                    radius="full"
                    color="danger"
                    isDisabled={item?.status === "terminated" ? true : false}
                    className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                    onPress={() => handleDestroyLoadBalancer(item)}
                  >
                    <FaRegTrashCan className="min-w-max text-base w-4 h-4 text-light" />
                  </Button>
                </Tooltip>
              </>
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
        tableId: "loadbalancer-management",
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
        tableId: "loadbalancer-management",
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
  const [isOpenModalAssignedUser, setIsOpenModalAssignedUser] = useState(false);
  const handleAssingedUser = () => {
    setIsOpenModalAssignedUser(true);
  };
  return (
    <div className="flex flex-col gap-3">
      {/* Filter By Team */}
      <Container className="flex gap-2 items-center justify-between">
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
          {/* <Chip
                        variant="solid"
                        color="danger"
                        radius="sm"
                        classNames={{
                            content: "tracking-wide font-medium",
                        }}
                    >
                        Tổng tiền: {convertPriceToUSD(totalPrice || 0)}
                    </Chip> */}
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
          <ExportLBExcelDigitalOcean
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
          tableId={"loadbalancer-management-bucloud"}
          columns={columns}
          data={listLoadBalancer}
          total={total}
          isLoading={isLoading}
          renderCell={renderCell}
          selectionMode="multiple"
        />
      </Container>
      <ModalConfirmDestroy
        openModalConfirm={openModalConfirm}
        setOpenModalConfirm={setOpenModalConfirm}
        info={infoDetail}
      />
      <ModalAssignedUserToVps
        isOpen={isOpenModalAssignedUser}
        onOpenChange={setIsOpenModalAssignedUser}
      />
    </div>
  );
}

export default ManagementLoadBalancerDigitalOceanBuCloud;
