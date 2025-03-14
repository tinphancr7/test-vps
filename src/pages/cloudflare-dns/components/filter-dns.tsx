import Container from "@/components/container";
import { Button, Input } from "@heroui/react";
import { FaPlus } from "react-icons/fa6";
import FormDns from "./form-dns";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setModal } from "@/stores/slices/modal-slice";
import { BiSearch } from "react-icons/bi";
import { setSearchValue } from "@/stores/slices/dns-slice";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";
import { asyncThunkGetDnsListCloudflare } from "@/stores/async-thunks/dns-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import { useParams } from "react-router-dom";

function FilterDns() {
    const dispatch = useAppDispatch();
    const tableDns = useAppSelector(
        (state) => state.table["table_dns"]
    );
    const { searchValue } = useAppSelector((state) => state.dns);
    const { id } = useParams();
    const searchMatch = useDebounce(searchValue, 500);

    useEffect(() => {
        const query: any = {
            zone_id: id,
        };

        if (searchMatch !== undefined) {
            query.search = searchMatch;
        }

        if (tableDns) {
            const cPageSize = tableDns?.pageSize
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                  [...tableDns?.pageSize][0]
                : 10;

            query.pageSize = Number(cPageSize);
            query.pageIndex = Number(tableDns?.pageIndex) || 1;

            dispatch(asyncThunkGetDnsListCloudflare(query));
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableDns, searchMatch]);

    const handleOpenModalUser = () => {
        dispatch(
            setModal({
                isOpen: true,
                placement: "right",
                title: "Thêm DNS",
                body: <FormDns zone_id={id as string} isEdit={false} />,
            })
        );
    };

    const onClear = () => {
        dispatch(setSearchValue(""));

        dispatch(
            setTablePageIndex({
                tableId: "table_dns",
                pageIndex: 1
            })
        )
    };

    return (
        <Container className="flex justify-between items-center">
            <Button
                variant="solid"
                color="primary"
                radius="sm"
                className="h-8 font-semibold"
                startContent={<FaPlus />}
                onPress={handleOpenModalUser}
            >
                Thêm mới
            </Button>

            <Input
                isClearable
                variant="bordered"
                radius="sm"
                className="max-w-xs"
                classNames={{
                    inputWrapper:
                        "bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
                }}
                placeholder="Tìm kiếm"
                startContent={<BiSearch className="text-black" />}
                value={searchValue}
                onClear={onClear}
                onValueChange={(value) => dispatch(setSearchValue(value))}
            />
        </Container>
    );
}

export default FilterDns;
