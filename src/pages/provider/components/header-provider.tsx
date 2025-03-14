import Container from "@/components/container";
import { Button, Input } from "@heroui/react";
import { BiSearch } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/stores";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import { setSearchByIp } from "@/stores/slices/alibaba-ecs.slice";
import { asyncThunkPaginationProviders } from "@/stores/async-thunks/provider-thunk";
import { FaPlus } from "react-icons/fa6";
import { setModal } from "@/stores/slices/modal-slice";
import FormProvider from "./form-provider";

function HeaderProvider() {
    const dispatch = useAppDispatch();
    const tableProvider = useAppSelector(
        (state) => state.table["provider"]
    );
    const { search } = useAppSelector(state => state.provider);

    const searchMatch = useDebounce(search, 500);

    useEffect(() => {
        const query: any = {};

        if (searchMatch !== undefined) {
            query.search = searchMatch;
        }

        if (tableProvider) {
            const cPageSize = tableProvider?.pageSize
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                  [...tableProvider?.pageSize][0]
                : 10;

            query.pageSize = Number(cPageSize);
            query.pageIndex = Number(tableProvider?.pageIndex) || 1;

            dispatch(asyncThunkPaginationProviders(query));
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableProvider, searchMatch]);

    useEffect(() => {
        dispatch(asyncThunkGetAllYourTeam());

        return () => {};
    }, []);

    const resetPageIndex = () => {
        dispatch(
            setTablePageIndex({
                tableId: "provider",
                pageIndex: 1,
            })
        );
    };
    
    const handleValueChange = (value: any, key: string) => {
        if (key === "search") {
            dispatch(setSearchByIp(value));
        }

        resetPageIndex();
    };

    const onClear = () => {
        dispatch(setSearchByIp(""));
        resetPageIndex();
    };

    const handleOpenModal = () => {
        dispatch(
			setModal({
				isOpen: true,
				placement: 'right',
				title: 'Thêm nhà cung cấp mới',
				body: <FormProvider isEdit={false} isRead={false} />,
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

export default HeaderProvider;
