import Container from "@/components/container";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { asyncThunkGetAllBrands } from "@/stores/slices/brand-slice";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { asyncThunkGetPaginationDomains, setBrand, setCreatedBy, setManager, setName, setProvider, setStatus, setTeam } from "@/stores/slices/domains-slice";
import { PROVIDER_OPTIONS, STATUSES_DOMAIN } from "@/constants/domain";
import CustomMultiSelect from "@/components/form/custom-multi-select";
import userApis from "@/apis/user-api";

function FilterDomains() {
    const dispatch = useAppDispatch();
    const tableDomains = useAppSelector((state) => state.table["domains"]);
    const { brands } = useAppSelector((state) => state.brand);
    const { teams } = useAppSelector((state) => state.teams);
    const { team, brand, name, provider, status, manager, createdBy } = useAppSelector(
        (state) => state.domains,
    );

    const searchMatch = useDebounce(name, 500);

    useEffect(() => {
        const query: any = {};

        if (searchMatch !== undefined) {
            query.name = searchMatch;
        }

        if (team) {
            query.team = team;
        }

        if (brand) {
            query.brand = brand;
        }

        if (provider) {
            query.provider = provider;
        }

        if (status) {
            query.status = status;
        }

        if (createdBy) {
            query.createdBy = (createdBy as any)?.value;
        }

        if (manager?.length) {
            query.manager = manager?.map((it: any) => it?.value);
        }

        if (tableDomains) {
            const cPageSize = tableDomains?.pageSize
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                [...tableDomains?.pageSize][0]
                : 10;

            query.pageIndex = tableDomains?.pageIndex || 1;
            query.pageSize = cPageSize;

            dispatch(asyncThunkGetPaginationDomains(query));
        }

        return () => { };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableDomains, team, brand, searchMatch, provider, status, createdBy, manager]);

    const loadOptionsData = async (searchQuery: string, _loadedOptions: any, { page }: any) => {
        const res = await userApis.getPaginationUsers({
            search: searchQuery,
            pageIndex: page,
            pageSize: 10,
        });

        const users = res?.data?.users.map((user: any) => ({
            label: user.username,
            value: user._id,
        }));

        return {
            options: users,
            hasMore: res?.data?.totalPages > page,
            additional: {
                page: searchQuery ? 1 : page + 1,
            },
        };
    };

    useEffect(() => {
        dispatch(asyncThunkGetAllYourTeam());
        dispatch(asyncThunkGetAllBrands());

        return () => { };
    }, []);

    const onClear = () => {
        dispatch(setName(""));
        dispatch(
            setTablePageIndex({
                tableId: "domains",
                pageIndex: 1,
            }),
        );
    };

    return (
        <Container className="flex justify-between items-center">
            <div className="flex-1 grid grid-cols-5 items-center justify-end gap-3">
                {/* Filter By Name or Username */}
                <Input
                    isClearable
                    fullWidth
                    variant="bordered"
                    radius="sm"
                    classNames={{
                        inputWrapper:
                            "bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
                    }}
                    placeholder="Tìm kiếm tên domain..."
                    startContent={<BiSearch className="text-black" />}
                    value={name}
                    onClear={onClear}
                    onValueChange={(value) => dispatch(setName(value))}
                />

                <Autocomplete
                    fullWidth
                    defaultItems={PROVIDER_OPTIONS}
                    placeholder="Nhà cung cấp"
                    radius="sm"
                    variant="bordered"
                    inputProps={initPropsAutoComplete}
                    classNames={classNamesAutoComplete}
                    selectedKey={provider}
                    onSelectionChange={(value) => dispatch(setProvider(value))}
                >
                    {(item: any) => <AutocompleteItem key={item?.value}>{item?.label}</AutocompleteItem>}
                </Autocomplete>

                {/* Filter By Team */}
                <Autocomplete
                    fullWidth
                    defaultItems={teams}
                    placeholder="Team"
                    radius="sm"
                    variant="bordered"
                    inputProps={initPropsAutoComplete}
                    classNames={classNamesAutoComplete}
                    selectedKey={team}
                    onSelectionChange={(value) => dispatch(setTeam(value))}
                >
                    {(item) => <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>}
                </Autocomplete>

                <Autocomplete
                    fullWidth
                    defaultItems={brands}
                    placeholder="Thương hiệu"
                    radius="sm"
                    variant="bordered"
                    inputProps={initPropsAutoComplete}
                    classNames={classNamesAutoComplete}
                    selectedKey={brand}
                    onSelectionChange={(value) => dispatch(setBrand(value))}
                >
                    {(item: any) => <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>}
                </Autocomplete>

                <Autocomplete
                    fullWidth
                    defaultItems={STATUSES_DOMAIN}
                    placeholder="Trạng thái"
                    radius="sm"
                    variant="bordered"
                    inputProps={initPropsAutoComplete}
                    classNames={classNamesAutoComplete}
                    selectedKey={status}
                    onSelectionChange={(value) => dispatch(setStatus(value))}
                >
                    {(item: any) => <AutocompleteItem key={item?.value}>{item?.label}</AutocompleteItem>}
                </Autocomplete>

                <div className="w-full col-span-1">
                    <CustomMultiSelect
                        isMulti={false}
                        value={createdBy}
                        onChange={(value: any) => dispatch(setCreatedBy(value))}
                        placeholder={`Người tạo`}
                        loadOptions={loadOptionsData}
                    />
                </div>

                <div className="w-full col-span-2">
                    <CustomMultiSelect
                        value={manager}
                        onChange={(value: any) => dispatch(setManager(value))}
                        placeholder={`Người quản lý`}
                        loadOptions={loadOptionsData}
                    />
                </div>
            </div>
        </Container>
    );
}

export default FilterDomains;
