import { useEffect, useState } from "react";
import {
    Button,
    Input,
    ModalFooter,
} from "@heroui/react";
import useForm from "@/hooks/use-form";
import { useAppDispatch, useAppSelector } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";
import { asyncThunkGetAllRoles } from "@/stores/async-thunks/role-thunk";
import brandApis from "@/apis/brand-api";
import showToast from "@/utils/toast";
import { asyncThunkPaginationBrands } from "@/stores/slices/brand-slice";

interface FormBrand {
    isEdit: boolean;
    isRead?: boolean;
    brand?: any;
}

function FormBrand({ isEdit = false, isRead = false, brand }: FormBrand) {
    const {
        isEmptyValues,
        initialState,
        getState,
        setErrorMessage,
        setValue,
        getValue,
        validateForm,
    } = useForm({
        name: {
            label: "Tên thương hiệu",
            type: "text",
            value: "",
            errorMessage: "",
            isRequire: true,
        },
    });

    const dispatch = useAppDispatch();
    const tableBrand = useAppSelector((state) => state.table["brand"]);
    const { search } = useAppSelector((state) => state.brand);

    const [isLoading, setIsLoading] = useState(false);

    const handleGetBrandInfo = async () => {
        try {
            const { data } = await brandApis.getById(brand?._id as string);

            if (data) {
                setValue("name", data?.brand?.name);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    useEffect(() => {
        dispatch(asyncThunkGetAllRoles());

        if (isEdit || isRead) {
            handleGetBrandInfo();
        }
    }, []);

    const handleValueChange = (key: string, value: any) => {
        setValue(key, value);
        setErrorMessage(key, value && "");
    };

    const handleSubmit = async () => {
        if (!isEdit) {
            const { data } = await brandApis.create(getValue('name'));

            return data?.status;
        }

        const { data } = await brandApis.update(brand?._id, getValue('name'));

        return data?.status;
    };

    const onSubmit = async () => {
        if (isEmptyValues) {
            return validateForm();
        }

        try {
            setIsLoading(true);

            const status = await handleSubmit();

            if (status === 1) {
                showToast('Tạo thương hiệu thành công!', 'success');
                dispatch(resetModal());

                const query: any = {};
                
                if (search !== undefined) {
                    query.search = search;
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
            }
        } catch (error) {
            console.log("error: ", error);
        } finally {
            setIsLoading(false);
        }
    }; 

    return (
        <div className="h-full relative flex flex-col justify-between overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-3 mt-2">
                {Object.keys(initialState).map((key, index) => (
                    <Input
                        key={index}
                        radius="sm"
                        color="primary"
                        variant="bordered"
                        labelPlacement="outside"
                        classNames={{
                            inputWrapper:
                                "h-10 data-[hover=true]:border-primary border border-slate-400",
                            label: "text-dark font-medium",
                        }}
                        type={getState(key).type}
                        label={getState(key).label}
                        placeholder={`${getState(key).label}`}
                        value={getValue(key)}
                        onValueChange={(value) =>
                            handleValueChange(key, value)
                        }
                        errorMessage={getState(key).errorMessage}
                        isInvalid={!!getState(key).errorMessage}
                        onKeyDown={(event) =>
                            event.key === "Enter" && onSubmit()
                        }
                        isDisabled={isRead}
                    />
                ))}
            </div>

            <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
                <Button
                    variant="solid"
                    color="danger"
                    className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                    onPress={() => dispatch(resetModal())}
                >
                    Hủy
                </Button>
                {!isRead && (
                    <Button
                        variant="solid"
                        className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                        isLoading={isLoading}
                        onPress={onSubmit}
                    >
                        Xác nhận
                    </Button>
                )}
            </ModalFooter>
        </div>
    );
}

export default FormBrand;
