import Container from "@/components/container";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";

import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";

// import { formatPrice } from "@/utils/format-price";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import ExportOrderExcel from "./export-excel-vps-vng";

import {
  fetchInstances,
  setSearchByIp,
  setStatus,
  setTeamSelected,
} from "@/stores/slices/vps-scaleway-slice";
import { statuses } from "@/constants/statuses-vps-scaleway";
import { formatPrice } from "@/utils/format-price";
import { SubjectEnum } from "@/constants/enum";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";

function FilterScaleWay() {
  const dispatch = useAppDispatch();
  const tableVpsScaleWay = useAppSelector(
    (state) => state.table["vps_scaleway"]
  );
  const dis = useMemo(() => {
    const listSelectedKey = tableVpsScaleWay?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [tableVpsScaleWay]);
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
  const { vpsList, statusVps } = useAppSelector((state) => state.scaleway);
  const { teams } = useAppSelector((state) => state.teams);
  const { status, teamSelected, searchByIp } = useAppSelector(
    (state) => state.scaleway
  );
  const totalMoney = vpsList?.result?.reduce((acc: any, item: any) => {
    return acc + (item?.vps_id?.price || 0);
  }, 0);

  // const { products: productsVng } = useAppSelector((state) => state.prodVng);

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

    if (tableVpsScaleWay) {
      const cPageSize = tableVpsScaleWay?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsScaleWay?.pageSize][0]
        : 10;

      if (
        tableVpsScaleWay?.sortDescriptor?.direction &&
        tableVpsScaleWay?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsScaleWay?.sortDescriptor?.direction &&
        tableVpsScaleWay?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsScaleWay?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsScaleWay?.sortDescriptor?.column}`;
      }

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsScaleWay?.pageIndex) || 1;
      //@ts-ignore
      dispatch(fetchInstances(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableVpsScaleWay, status, teamSelected, searchMatch, statusVps]);

  useEffect(() => {
    dispatch(asyncThunkGetAllYourTeam());

    return () => {};
  }, []);

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "vps_scaleway",
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

  const onClearSearchIp = () => {
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
    <Container className="flex justify-start gap-2 items-center">
      <div className="flex flex-col gap-1">
        <Chip
          variant="solid"
          color="primary"
          radius="sm"
          classNames={{
            content: "tracking-wide font-medium",
          }}
        >
          {/* @ts-ignore */}
          Tổng: {vpsList?.meta?.totalItems || 0}
        </Chip>
        <Chip
          variant="solid"
          color="danger"
          radius="sm"
          classNames={{
            content: "tracking-wide font-medium",
          }}
        >
          Tổng tiền: {formatPrice(convertVnToUsd(totalMoney, "VNG")) || 0}$
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
        <ExportOrderExcel />

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
          onClear={onClearSearchIp}
          onValueChange={(value) => handleValueChange(value, "search")}
        />
        <Autocomplete
          defaultItems={statuses}
          placeholder="Trạng thái"
          radius="sm"
          variant="bordered"
          inputProps={initPropsAutoComplete}
          classNames={{ base: "max-w-44" }}
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
        {/* Filter By site */}
      </div>
      <ModalAssignedUserToVps
        isOpen={isOpenModalAssignedUser}
        onOpenChange={setIsOpenModalAssignedUser}
      />
    </Container>
  );
}

export default FilterScaleWay;
