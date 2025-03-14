import useForm from "@/hooks/use-form";
import { resetModal } from "@/stores/slices/modal-slice";
import { Autocomplete, AutocompleteItem, Button, Input, ModalFooter, Select, SelectItem, Textarea } from "@heroui/react";
import { formDomain } from "./constants";
import { useAppDispatch, useAppSelector } from "@/stores";
import { useEffect, useState } from "react";
import CustomMultiSelect from "@/components/form/custom-multi-select";
import userApis from "@/apis/user-api";
import domainApis from "@/apis/domain-api";
import showToast from "@/utils/toast";
import { asyncThunkGetPaginationDomains } from "@/stores/slices/domains-slice";

function FormDomain({ isEdit, domainId }: any) {
    const {
        isEmptyValues,
        initialState,
        getValues,
        getState,
        setErrorMessage,
        setValue,
        getValue,
        validateForm,
        setOptions,
    } = useForm(formDomain);
    const dispatch = useAppDispatch();
    const tableDomains = useAppSelector((state) => state.table["domains"]);
    const { team, brand, name, provider, status, manager, createdBy } = useAppSelector(
        (state) => state.domains,
    );
    const { brands } = useAppSelector((state) => state.brand);
    const { teams } = useAppSelector((state) => state.teams);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGetUserInfo = async () => {
        try {
            const { data } = await domainApis.getById(domainId as string);

            if (data?.status === 1) {
                for (const key of Object.keys(formDomain)) {
                    if (['team', 'brand'].includes(key)) {
                        setValue(key, data?.domain[key]?._id);
                    } else if (key === 'manager') {
                        setValue(key, data?.domain[key]?.map(
                            (it: any) => ({
                                label: it?.name || it?.username,
                                value: it?._id
                            }))
                        );
                    } else {
                        setValue(key, data?.domain[key]);
                    }
                }
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    useEffect(() => {
        setOptions('team', teams);
        setOptions('brand', brands);

        handleGetUserInfo();
    }, []);

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

    const handleValueChange = (key: string, value: any) => {
        setValue(key, value);
        setErrorMessage(key, value && "");
    };

    const onSubmit = async () => {
        if (isEmptyValues) {
            return validateForm();
        }

        if (!getValue('manager') || !getValue('manager')?.length) {
            return setErrorMessage('manager', 'Vui lòng chọn người quản lý!');
        }

        try {
            setIsSubmitting(true);

            const payload = { 
                ...getValues(),
                manager: getValue('manager')?.map((user: any) => user?.value),
            };

            const { data } = await domainApis.update(domainId, payload);

            if (data?.status === 1) {
                showToast('Cập nhật domain thành công!', 'success');
                dispatch(resetModal());
            }

            const query: any = {};
            
            if (name !== undefined) {
                query.name = name;
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
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full relative flex flex-col justify-between overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-5">
                {Object.keys(initialState).map((key, index) => {
                    if (getState(key).type === 'select')
                        return (
                            <Select
                                key={index}
                                labelPlacement="outside"
                                label={getState(key).label}
                                items={getState(key)?.options || []}
                                selectionMode="multiple"
                                placeholder={getState(key)?.label}
                                classNames={{
                                    base: "w-full",
                                    label: "text-dark font-medium",
                                    trigger:
                                        "text-dark border rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                                }}
                                selectedKeys={getValue(key)}
                                onSelectionChange={(value) => handleValueChange(key, value)}
                                renderValue={(items) => {
                                    const textValue = items.map((e) => e.textValue);
                                    return <span>{textValue.join(", ")}</span>;
                                }}
                                isDisabled={!isEdit}
                                errorMessage={getState(key).errorMessage}
                                isInvalid={!!getState(key).errorMessage}
                            >
                                {(getState(key)?.options as Array<any>).map((team) => (
                                    <SelectItem
                                        key={team?._id || team.value}
                                        textValue={team?.name || team.value}>
                                        {team?.name || team?.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        );

                    if (getState(key).type === 'autocomplete')
                        return (
                            <Autocomplete
                                key={index}
                                aria-label={getState(key).label}
                                fullWidth
                                defaultItems={getState(key)?.options || []}
                                labelPlacement="outside"
                                label={getState(key).label}
                                placeholder={getState(key).label}
                                radius="sm"
                                variant="bordered"
                                selectedKey={getValue(key)}
                                inputProps={{
                                    classNames: {
                                        label: "text-dark font-medium",
                                        inputWrapper:
                                            "border group-data-[open=true]:border-primary group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
                                    },
                                }}
                                onSelectionChange={(value) => handleValueChange(key, value)}
                                isDisabled={!isEdit}
                                errorMessage={getState(key).errorMessage}
                                isInvalid={!!getState(key).errorMessage}
                            >
                                {(item: any) => (
                                    <AutocompleteItem key={item?._id || item?.value}>{item?.name || item?.label}</AutocompleteItem>
                                )}
                            </Autocomplete>
                        );

                    if (getState(key).type === 'users')
                        return (
                            <div className="w-full">
                                <label htmlFor="" className="inline-block pb-1 font-medium text-base">
                                    {getState(key).label}
                                </label>

                                <CustomMultiSelect
                                    value={getValue(key)}
                                    onChange={(value: any) => handleValueChange(key, value)}
                                    placeholder={`${getState(key).label}`}
                                    loadOptions={loadOptionsData}
                                    errorMessage={getState(key).errorMessage}
                                    isInvalid={!!getState(key).errorMessage}
                                />
                            </div>
                        );

                    if (getState(key).type === "textarea") 
                        return (
                            <Textarea
                                labelPlacement="outside"
                                classNames={{
                                    base: "rounded-sm col-span-2",
                                    label: "font-medium",
                                    inputWrapper: `rounded-md shadow-none border p-0 bg-white data-[hover=true]:bg-white data-[hover=true]:border data-[hover=true]:border-primary group-data-[focus=true]:bg-white group-data-[focus=true]:border-1 group-data-[focus=true]:border-primary`,
                                    input:
                                    "p-2 text-base placeholder:font-normal font-medium resize-none overflow-hidden break-words",
                                }}
                                label={getState(key).label}
                                placeholder={getState(key)?.placeholder || ""}
                                value={getValue(key)}
                                onValueChange={(value) => handleValueChange(key, value)}
                                errorMessage={getState(key).errorMessage}
                                isInvalid={!!getState(key).errorMessage}
                            />
                        );

                    return (
                        <Input
                            key={index}
                            radius="sm"
                            color="primary"
                            variant="bordered"
                            labelPlacement="outside"
                            classNames={{
                                inputWrapper:
                                    "h-10 data-[hover=true]:border-primary border",
                                label: "text-dark font-medium",
                            }}
                            type={getState(key).type}
                            label={getState(key).label}
                            placeholder={`${getState(key).label}`}
                            value={getValue(key)}
                            onValueChange={(value) => handleValueChange(key, value)}
                            errorMessage={getState(key).errorMessage}
                            isInvalid={!!getState(key).errorMessage}
                            onKeyDown={(event) => event.key === "Enter" && onSubmit()}
                            isDisabled={!isEdit}
                        />
                    );
                })}
            </div>

            <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
                <Button
                    variant="solid"
                    color="danger"
                    className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                    onPress={() => dispatch(resetModal())}>
                    Hủy
                </Button>
                {isEdit && (
                    <Button
                        variant="solid"
                        className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                        isLoading={isSubmitting}
                        onPress={onSubmit}>
                        Xác nhận
                    </Button>
                )}
            </ModalFooter>
        </div>
    )
}

export default FormDomain;