import useForm from "@/hooks/use-form";
import { Button, Divider, Input, ModalFooter, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import { FORM_DNS, TYPE_DNS_OPTIONS } from "./constants";
import Count from "@/components/count";
import { useEffect, useState } from "react";
import { resetModal } from "@/stores/slices/modal-slice";
import { useAppDispatch, useAppSelector } from "@/stores";
import cloudflareApis from "@/apis/cloudflare.api";
import showToast from "@/utils/toast";
import { asyncThunkGetDnsListCloudflare } from "@/stores/async-thunks/dns-thunk";

function FormDns({ zone_id, isEdit, item }: { zone_id: string, isEdit: boolean, item?: any }) {
    const {
        initialState,
        getValues,
        isEmptyValues,
        setState,
        getState,
        setErrorMessage,
        setValue,
        getValue,
        validateForm,
    } = useForm((FORM_DNS as any)[TYPE_DNS_OPTIONS[0]]);
    const dispatch = useAppDispatch();
    const { searchValue } = useAppSelector((state) => state.dns);
    const tableDns = useAppSelector(
        (state) => state.table["table_dns"]
    );

    const [dnsType, setDnsType] = useState<any>(
        new Set([TYPE_DNS_OPTIONS[0]])
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comment, setComment] = useState('');

    const fetchData = async () => {
        try {
            const { data } = await cloudflareApis.getDetailDnsById(item?.id);

            if (data?.status === 1) {
                const newState = (FORM_DNS as any)[data?.record?.type];
                setDnsType(new Set([data?.record?.type]));
                setState(newState);

                for (const key of Object.keys(newState)) {
                    let parseValue = data?.record[key];

                    if (getState(key)?.type === "select") {
                        parseValue = new Set([parseValue]);
                    }

                    setValue(key, parseValue);
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    useEffect(() => {
        if (isEdit) {
            fetchData();
        }
    }, [isEdit]);

    const handleValueChange = (key: string, value: any) => {
        if (key === 'type_dns') {
            setDnsType(value);

            const [parseValue] = [...value];

            setState((FORM_DNS as any)[parseValue]);

            if (
                isEdit && 
                item?.type === parseValue
            ) {
                fetchData();
            }
        } else {
            setValue(key, value);
            setErrorMessage(key, value && "");
        }
    };

    const onSubmit = async () => {
        if (isEmptyValues) {
            return validateForm();
        }

        try {
            setIsSubmitting(true);

            const parseValue = Object.keys(getValues())?.reduce(
                (curr: any, key: string) => {
                    let result = getValue(key);

                    if (getState(key).type === "select") {
                        result = [...getValue(key)][0];
                    }

                    curr[key] = result;

                    return curr;
                },
                {}
            );

            const payload = {
                ...parseValue,
                ttl: Number(parseValue?.ttl),
                type: [...dnsType][0],
                comment: comment?.trim(),
                zone_id,
            };

            let result: any = {};

            if (isEdit) {
                const { data } = await cloudflareApis.updateDns(item?.id, payload);

                result = data;
            } else {
                const { data } = await cloudflareApis.createDns(payload);

                result = data;
            }

            if (result?.status === 1) {
                showToast('Thêm DNS thành công!', 'success');

                const query: any = {
                    zone_id,
                };
                
                if (searchValue !== undefined) {
                    query.search = searchValue;
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
            }
        } catch (error: any) {
            console.log('error: ', error);
            showToast(error?.response?.data?.message || 'Thêm DNS thất bại!', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full relative flex flex-col justify-between overflow-y-auto scroll-main overflow-x-hidden">
            <div className="grid grid-cols-2 gap-3 pb-4 pr-2">
                <Select
                    labelPlacement="outside"
                    label={"Type"}
                    items={TYPE_DNS_OPTIONS?.map(it => ({ label: it, value: it })) || []}
                    selectionMode="single"
                    classNames={{
                        base: "w-full col-span-2",
                        label: "text-dark font-medium",
                        trigger:
                            "text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                    }}
                    disallowEmptySelection
                    selectedKeys={dnsType}
                    onSelectionChange={value => handleValueChange('type_dns', value)}
                    renderValue={(items) => {
                        const textValue = items.map(
                            (e) => e.rendered
                        );
                        return <span>{textValue.join(", ")}</span>;
                    }}
                >
                    {(item) => (
                        <SelectItem
                            key={item.value}
                            textValue={item.value}
                        >
                            {item?.label}
                        </SelectItem>
                    )}
                </Select>

                {Object.keys(initialState).map((key, index) => {
                    if (getState(key).type === "text")
                        return (
                            <Input
                                key={index}
                                radius="sm"
                                color="primary"
                                variant="bordered"
                                labelPlacement="outside"
                                classNames={{
                                    base: "col-span-2",
                                    inputWrapper:
                                        "h-10 data-[hover=true]:border-primary border border-slate-400",
                                    label: "text-dark font-medium",
                                }}
                                type={getState(key).type}
                                label={getState(key).label}
                                placeholder={`${getState(key).placeholder || ""}`}
                                value={getValue(key)}
                                onValueChange={(value) =>
                                    handleValueChange(key, value)
                                }
                                errorMessage={getState(key).errorMessage}
                                isInvalid={!!getState(key).errorMessage}
                            />
                        );

                    if (getState(key).type === "select")
                        return (
                            <Select
                                key={index}
                                labelPlacement="outside"
                                label={getState(key).label}
                                items={getState(key)?.options || []}
                                selectionMode="single"
                                placeholder={getState(key)?.label}
                                classNames={{
                                    base: `w-full ${["lat_direction", "long_direction"].includes(key) ? 'col-span-1' : 'col-span-2'}`,
                                    label: "text-dark font-medium",
                                    trigger:
                                        "text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                                }}
                                selectedKeys={getValue(key)}
                                onSelectionChange={(value) =>
                                    handleValueChange(key, value)
                                }
                                renderValue={(items) => {
                                    const textValue = items.map(
                                        (e) => e?.rendered
                                    );
                                    return <span>{textValue.join(", ")}</span>;
                                }}
                            >
                                {(getState(key)?.options as Array<any>).map(
                                    (item) => (
                                        <SelectItem
                                            key={item.value}
                                            textValue={item.value}
                                        >
                                            {item?.label}
                                        </SelectItem>
                                    )
                                )}
                            </Select>
                        );

                    if (getState(key).type === "textarea") {
                        return (
                            <Textarea
                                minRows={3}
                                labelPlacement="outside"
                                classNames={{
                                    base: "rounded-sm col-span-2",
                                    label: "font-medium",
                                    inputWrapper: `rounded-md shadow-none border p-0 bg-white data-[hover=true]:bg-white data-[hover=true]:border data-[hover=true]:border-primary group-data-[focus=true]:bg-white group-data-[focus=true]:border-1 group-data-[focus=true]:border-primary`,
                                    input: "p-2 text-base placeholder:font-normal font-medium resize-none overflow-hidden break-words",
                                }}
                                label={getState(key).label}
                                placeholder={getState(key)?.placeholder || ""}
                                value={getValue(key)}
                                onValueChange={value => handleValueChange(key, value)}
                                errorMessage={getState(key).errorMessage}
                                isInvalid={!!getState(key).errorMessage}
                            />
                        );
                    }

                    if (getState(key).type === "count") {
                        return (
                            <div className="col-span-1">
                                <p className="font-medium mb-1 text-base">
                                    {getState(key).label}
                                </p>
    
                                <Count 
                                    min={0}
                                    max={Number(getState(key)?.max)}
                                    value={Number(getValue(key))} 
                                    setValue={(value) => handleValueChange(key, value)} 
                                />
    
                                {getState(key)?.placeholder && (
                                    <span className="text-sm">{getState(key)?.placeholder}</span>
                                )}
                            </div>
                        );
                    }

                    if (getState(key).type === "switch") {
                        return (
                            <div className="col-span-1">
                                <p className="font-medium mb-2 text-base">
                                    {getState(key).label}: 
                                </p>

                                <Switch
                                    size="sm"
                                    isSelected={getValue(key)}
                                    onValueChange={(value) => handleValueChange(key, value)}
                                >
                                    {getValue(key) ? "Proxied" : "DNS Only"}
                                </Switch>
                            </div>
                        );
                    }

                    return (
                        <div className="col-span-1 py-2">
                            <span className="font-medium mb-1 text-base">{getState(key).label}: </span>
                            <span className="text-base">0</span>
                        </div>
                    );
                })}

                <Divider className="col-span-2 my-4" />

                <Textarea
                    minRows={3}
                    labelPlacement="outside"
                    classNames={{
                        base: "rounded-sm col-span-2",
                        label: "font-medium",
                        inputWrapper: `rounded-md shadow-none border p-0 bg-white data-[hover=true]:bg-white data-[hover=true]:border data-[hover=true]:border-primary group-data-[focus=true]:bg-white group-data-[focus=true]:border-1 group-data-[focus=true]:border-primary`,
                        input: "p-2 text-base placeholder:font-normal font-medium resize-none overflow-hidden break-words",
                    }}
                    label={"Bình luận"}
                    placeholder={"Nhập bình luận của bạn vào đây (tối đa 100 ký tự)."}
                    value={comment}
                    onValueChange={setComment}
                />
            </div>

            <ModalFooter className="px-2 sticky bottom-0 border-t gap-4 bg-white">
                <Button
                    variant="solid"
                    color="danger"
                    className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                    onPress={() => dispatch(resetModal())}
                >
                    Hủy
                </Button>
                <Button
                    variant="solid"
                    className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                    isLoading={isSubmitting}
                    onPress={onSubmit}
                >
                    Xác nhận
                </Button>
            </ModalFooter>
        </div>
    );
}

export default FormDns;
