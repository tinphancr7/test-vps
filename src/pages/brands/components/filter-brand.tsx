import { useAppDispatch, useAppSelector } from "@/stores";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";
import { asyncThunkPaginationBrands, setSearch } from "@/stores/slices/brand-slice";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import Container from "@/components/container";
import { Button, Input } from "@heroui/react";
import { FaPlus } from "react-icons/fa6";
import { BiSearch } from "react-icons/bi";
import { setModal } from "@/stores/slices/modal-slice";
import FormBrand from "./form-brand";

function FilterBrand() {
    const dispatch = useAppDispatch();
    const tableBrand = useAppSelector((state) => state.table["brand"]);
    const { search } = useAppSelector((state) => state.brand);

    const searchMatch = useDebounce(search, 500);

    useEffect(() => {
        const query: any = {};

        if (searchMatch !== undefined) {
            query.search = searchMatch;
        }

        if (tableBrand) {
            const cPageSize = tableBrand?.pageSize
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                  [...tableBrand?.pageSize][0]
                : 10;

            query.pageSize = Number(cPageSize);
            query.pageIndex = Number(tableBrand?.pageIndex) || 1;

            dispatch(asyncThunkPaginationBrands(query));
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableBrand, searchMatch]);

    const resetPageIndex = () => {
        dispatch(
            setTablePageIndex({
                tableId: "brand",
                pageIndex: 1,
            })
        );
    };

    const handleValueChange = (value: any, key: string) => {
        if (key === "search") {
            dispatch(setSearch(value));
        }

        resetPageIndex();
    };

    const onClear = () => {
        dispatch(setSearch(""));
        resetPageIndex();
    };

    const handleOpenModal = () => {
        dispatch(
            setModal({
                isOpen: true,
                placement: "right",
                title: "Thêm thương hiệu mới",
                body: <FormBrand isEdit={false} isRead={false} />,
            })
        );
    };

    return (
        <Container className="flex gap-2 justify-between items-center px-2 mt-4">
            <div className="flex gap-2 justify-start items-center">
                <Button
                    variant="solid"
                    color="primary"
                    radius="sm"
                    className="h-8 font-semibold"
                    startContent={<FaPlus />}
                    onPress={handleOpenModal}
                >
                    Thêm mới
                </Button>
            </div>
            <div className="flex-1 flex gap-2 justify-end items-center">
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
                    value={search}
                    onClear={onClear}
                    onValueChange={(value) =>
                        handleValueChange(value, "search")
                    }
                />
            </div>
        </Container>
    );
}

export default FilterBrand;
