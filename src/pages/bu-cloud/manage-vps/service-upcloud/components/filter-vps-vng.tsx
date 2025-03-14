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
import {
  setStatus,
  setTeamSelected,
  setSearchByIp,
  setProductName,
} from "@/stores/slices/vps-up-cloud.slice";
import { asyncThunkGetAllProducts } from "@/stores/async-thunks/prod-vng-thunk";
// import { formatPrice } from "@/utils/format-price";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { addCommas } from "@/utils";
import ExportOrderExcel from "./export-excel-vps-vng";
import { asyncThunkPaginationVpsBuCloudUpCloud } from "@/stores/async-thunks/up-cloud.thunk";
import ModalAssignedUserToVps from "./modal-assigned-user-to-vps";
import { SubjectEnum } from "@/constants/enum";

function FilterVpsVng() {
  const dispatch = useAppDispatch();
  const tableVpsBuCloud = useAppSelector(
    (state) => state.table["vps_up_cloud"]
  );
  const dis = useMemo(() => {
    const listSelectedKey = tableVpsBuCloud?.selectedKeys;
    if (listSelectedKey) {
      const a = [...listSelectedKey];
      if (a.length > 0) {
        return false;
      }
      return true;
    }
  }, [tableVpsBuCloud]);
  const { teams } = useAppSelector((state) => state.teams);
  const { permissions, user } = useAppSelector((state) => state.auth);
  const { status, teamSelected, searchByIp, productName, total, totalMoney } =
    useAppSelector((state) => state.upcloudVps);
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
  const searchMatch = useDebounce(searchByIp, 500);

  useEffect(() => {
    const query: any = {};

    if (searchMatch !== undefined) {
      query.search = searchMatch;
    }

    if (productName) {
      query.product_name = productName;
    }

    if (status) {
      query.status = status;
    }

    if (teamSelected) {
      query.team = teamSelected;
    }

    if (tableVpsBuCloud) {
      const cPageSize = tableVpsBuCloud?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsBuCloud?.pageSize][0]
        : 10;

      if (
        tableVpsBuCloud?.sortDescriptor?.direction &&
        tableVpsBuCloud?.sortDescriptor?.direction === "descending"
      ) {
        query.direction = -1;
      }

      if (
        tableVpsBuCloud?.sortDescriptor?.direction &&
        tableVpsBuCloud?.sortDescriptor?.direction === "ascending"
      ) {
        query.direction = 1;
      }

      if (tableVpsBuCloud?.sortDescriptor?.column) {
        query.field = `vps_id.${tableVpsBuCloud?.sortDescriptor?.column}`;
      }

      /*
				if (
					tableVpsVng?.sortFields && 
					Object.keys(tableVpsVng?.sortFields)?.length
				) {
					Object.keys(tableVpsVng?.sortFields)?.forEach(
						(field: string) => {
							query[`sort__${field}`] = tableVpsVng?.sortFields[field];
						}
					)
				}
			*/

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsBuCloud?.pageIndex) || 1;
      dispatch(asyncThunkPaginationVpsBuCloudUpCloud(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableVpsBuCloud, status, teamSelected, searchMatch, productName]);

  useEffect(() => {
    dispatch(asyncThunkGetAllYourTeam());
    dispatch(asyncThunkGetAllProducts());

    return () => {};
  }, []);

  // const loadOptionsData = async (
  //     searchQuery: string,
  //     _loadedOptions: any,
  //     { page }: any
  // ) => {
  //     const res = await siteApi.callFetchSite({
  //         search: searchQuery,
  //         pageIndex: page,
  //         pageSize: 10,
  //     });

  //     const items = res?.data?.users?.map((item: any) => ({
  //         label: item?.name,
  //         value: item?.vps_id,
  //     }));

  //     return {
  //         options: items,
  //         hasMore: res?.data?.totalPages > page,
  //         additional: {
  //             page: searchQuery ? 1 : page + 1,
  //         },
  //     };
  // };

  const resetPageIndex = () => {
    dispatch(
      setTablePageIndex({
        tableId: "vps_bu_cloud",
        pageIndex: 1,
      })
    );
  };

  const handleValueChange = (value: any, key: string) => {
    if (key === "product") {
      dispatch(setProductName(value));
    }

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
          Tổng tiền: {addCommas(convertVnToUsd(totalMoney, "VNG")) || 0}$
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
          defaultItems={[
            { label: "Started", value: "started" },
            { label: "Stoped", value: "stopped" },
            { label: "Maintenance", value: "maintenance" },
          ]}
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
        {/* Filter By Status */}

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

        {/* <div className="max-w-52 w-full">
                    <ReactSelectAsyncPaginate
                        value={site}
                        onChange={(value: any) =>
                            handleValueChange(value, "site")
                        }
                        loadOptions={loadOptionsData}
                        placeholder="site"
                    />
                </div> */}

        {/* <div className="max-w-52">
                    <Autocomplete
                        defaultItems={productsVng}
                        placeholder="Sản phẩm"
                        radius="sm"
                        variant="bordered"
                        inputProps={initPropsAutoComplete}
                        classNames={classNamesAutoComplete}
                        selectedKey={productName}
                        onSelectionChange={(value) =>
                            handleValueChange(value, "product")
                        }
                    >
                        {(item: any) => (
                            <AutocompleteItem key={item?.name}>
                                <div className="flex flex-row justify-between gap-1">
                                    <span>{item?.name}</span>
                                    <b>
                                        {formatPrice(
                                            convertVnToUsd(
                                                item?.m + item?.m * 0.1,
                                                "VNG"
                                            )
                                        )}
                                        $
                                    </b>
                                </div>
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                </div> */}
      </div>
      <ModalAssignedUserToVps
        isOpen={isOpenModalAssignedUser}
        onOpenChange={setIsOpenModalAssignedUser}
      />
    </Container>
  );
}

export default FilterVpsVng;
