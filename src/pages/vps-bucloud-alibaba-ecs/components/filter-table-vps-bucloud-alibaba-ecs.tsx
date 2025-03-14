import Container from "@/components/container";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
} from "@heroui/react";
import { BiSearch } from "react-icons/bi";
import { statuses } from "./constants";
import { convertPriceToUSD } from "@/utils/digital-ocean";
import { useAppDispatch, useAppSelector } from "@/stores";
import { useDebounce } from "@/hooks/useDebounce";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { asyncThunkGetPagingBuCloudAlibabaEcs } from "@/stores/async-thunks/alibaba-ecs-thunk";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import {
  setSearchByIp,
  setStatus,
  setTeamSelected,
} from "@/stores/slices/alibaba-ecs.slice";
import ExportVpsAlibabaEcsExcel from "./export-excel-vps-bucloud-alibaba-ecs";
import { SubjectEnum } from "@/constants/enum";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";

function FilterTableBuCloudAlibabaEcs() {
  const dispatch = useAppDispatch();
  const tableVpsBuCloudAlibabaEcs = useAppSelector(
    (state) => state.table["vps_bucloud_alibaba_ecs"]
  );
  const dis = useMemo(() => {
    const listSelectedKey = tableVpsBuCloudAlibabaEcs?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [tableVpsBuCloudAlibabaEcs]);
  const { permissions, user } = useAppSelector((state) => state.auth);
  const isAdmin = useMemo(() => {
    if (!permissions?.length) return false;
    const hasPermission = permissions.some(
      (item: any) => item.subject === SubjectEnum.ALL
    );
    return hasPermission;
  }, [permissions]);
  const [isOpenModalAssignedUser, setIsOpenModalAssignedUser] = useState(false);
  const handleAssingedUser = () => {
    setIsOpenModalAssignedUser(true);
  };
  const { teams } = useAppSelector((state) => state.teams);
  const { status, teamSelected, searchByIp, totalInstancesList, totalPrice } =
    useAppSelector((state) => state.alibabaEcs);

  const searchMatch = useDebounce(searchByIp, 500);

  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }

    if (status) {
      query.status = status;
    }

    if (teamSelected) {
      query.team = teamSelected;
    }

    if (tableVpsBuCloudAlibabaEcs) {
      const cPageSize = tableVpsBuCloudAlibabaEcs?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsBuCloudAlibabaEcs?.pageSize][0]
        : 10;

      if (
        tableVpsBuCloudAlibabaEcs?.sortDescriptor?.direction &&
        tableVpsBuCloudAlibabaEcs?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsBuCloudAlibabaEcs?.sortDescriptor?.direction &&
        tableVpsBuCloudAlibabaEcs?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsBuCloudAlibabaEcs?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsBuCloudAlibabaEcs?.sortDescriptor?.column}`;
      }

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsBuCloudAlibabaEcs?.pageIndex) || 1;

      dispatch(asyncThunkGetPagingBuCloudAlibabaEcs(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableVpsBuCloudAlibabaEcs, status, teamSelected, searchMatch]);

  useEffect(() => {
    dispatch(asyncThunkGetAllYourTeam());

    return () => {};
  }, []);

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "vps_alibaba_ecs",
        pageIndex: 1,
      })
    );
  };

  const handleValueChange = (value: any, key: string) => {
    if (key === "search") {
      dispatch(setSearchByIp(value));
    }

    if (key === "status") {
      dispatch(setStatus(value));
    }

    if (key === "team") {
      dispatch(setTeamSelected(value));
    }

    resetPageIndex();
  };

  const onClear = () => {
    dispatch(setSearchByIp(""));
    resetPageIndex();
  };
  const isLeader = useMemo(() => {
    if (user?.role?.name?.toLowerCase() === "leader") {
      return true;
    }

    return false;
  }, [user]);
  return (
    <Container className="flex gap-2 justify-between items-center">
      <div className="flex flex-col gap-1">
        <Chip
          variant="solid"
          color="primary"
          radius="sm"
          classNames={{
            content: "tracking-wide font-medium",
          }}
        >
          Tổng: {totalInstancesList}
        </Chip>
        <Chip
          variant="solid"
          color="danger"
          radius="sm"
          classNames={{
            content: "tracking-wide font-medium",
          }}
        >
          Tổng tiền: {convertPriceToUSD(totalPrice + totalPrice * 0.1 || 0)}
        </Chip>
      </div>

      <div className="flex-1 flex gap-2 justify-end items-center">
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
        {/* Btn Export Excel */}
        <ExportVpsAlibabaEcsExcel />

        {/* Filter By Ip */}
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

        {/* Filter By Status */}
        <Autocomplete
          defaultItems={statuses}
          placeholder="Trạng thái"
          radius="sm"
          variant="bordered"
          inputProps={initPropsAutoComplete}
          classNames={{
            base: "max-w-44",
          }}
          selectedKey={status}
          onSelectionChange={(value) => handleValueChange(value, "status")}
        >
          {(item: any) => (
            <AutocompleteItem key={item?.value}>{item?.label}</AutocompleteItem>
          )}
        </Autocomplete>

        {/* Filter By Team */}
        <div className="max-w-52">
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
            {(item: any) => (
              <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </div>
      <ModalAssignedUserToVps
        isOpen={isOpenModalAssignedUser}
        onOpenChange={setIsOpenModalAssignedUser}
      />
    </Container>
  );
}

export default FilterTableBuCloudAlibabaEcs;
