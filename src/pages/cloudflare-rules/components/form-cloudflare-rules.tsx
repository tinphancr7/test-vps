/* eslint-disable no-extra-boolean-cast */
import {
    Button,
    CircularProgress,
    Divider,
    Input,
    Select,
    SelectItem,
    Switch,
} from "@heroui/react";
import {
    ACTIONS_EMPTY_VALUE,
    defaultValues,
    FORM_PAGE_RULES,
    SETTING_OPTIONS,
    SETTINGS_ENUM,
} from "./constants";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import showToast from "@/utils/toast";
import cloudflareApis from "@/apis/cloudflare-api";
import { useAppDispatch } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";

function FormCloudflareRules({
    zone_id,
    pageRoleId,
    isEdit,
    fetch
}: {
    zone_id: string;
    pageRoleId?: string;
    isEdit: boolean;
    fetch: () => void;
}) {
    const dispatch = useAppDispatch();
    const [url, setUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        handleSubmit,
        control,
        setError,
        // clearErrors,
        watch,
        setValue,
        // reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: defaultValues,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const { data } = await cloudflareApis.getPageRoleDetail({
                    id: pageRoleId as string,
                    zone_id,
                });

                if (data?.status === 1) {
                    setUrl(data?.result?.targets[0]?.constraint?.value);

                    const actions = [];

                    for (const action of (data?.result?.actions || [])) {
                        const payload: any = {
                            action: action?.id,
                        };

                        if (action?.id === SETTINGS_ENUM.FORWARDING_URL) {
                            payload['status_code'] = String(action?.value?.status_code);
                            payload['url'] = action?.value?.url;
                        }

                        if (
                            action?.id !== SETTINGS_ENUM.FORWARDING_URL && 
                            !ACTIONS_EMPTY_VALUE.includes(action.id)
                        ) {
                            payload['value'] = action?.value;
                        }

                        actions.push(payload);
                    }

                    setValue('actions', actions);
                }
            } catch (error: any) {
                const parseError: any = JSON.parse(error?.response?.data?.error || {});
                const message =
                    parseError?.errors[0]?.message || "Xóa Page Role thất bại";
    
                showToast(message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (isEdit) {
            fetchData();
        }
    }, [pageRoleId, zone_id, isEdit]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "actions",
    });

    const handleAppendAction = () => {
        const actionsSelected = watch("actions")?.map((it) => it?.action);
        const filterOptions = SETTING_OPTIONS?.filter(
            (it) => !actionsSelected?.includes(it?.value)
        );

        const payloadAppend: any = {
            action: filterOptions[0]?.value,
        };

        if (
            (FORM_PAGE_RULES as any)[filterOptions[0]?.value]?.value?.value !==
            undefined
        ) {
            payloadAppend["value"] = (FORM_PAGE_RULES as any)[
                filterOptions[0]?.value
            ]?.value?.value;
        }

        if (filterOptions[0]?.value === SETTINGS_ENUM.FORWARDING_URL) {
            payloadAppend["status_code"] = (FORM_PAGE_RULES as any)[
                filterOptions[0]?.value
            ]?.status_code?.value;
            payloadAppend["url"] = (FORM_PAGE_RULES as any)[
                filterOptions[0]?.value
            ]?.url?.value;
        }

        append(payloadAppend);
    };

    const getOptions = (index: number) => {
        const filterActions = watch("actions")
            ?.filter((_, idx: number) => idx !== index)
            ?.map((it) => it?.action);

        const filterSettings = SETTING_OPTIONS?.filter(
            (item: any) => !filterActions?.includes(item?.value)
        );

        return filterSettings;
    };

    const onSubmit = async ({ actions }: any) => {
        const cloneActions = actions;

        if (!url) return;

        for (let index = 0; index < cloneActions.length; index++) {
            const action = cloneActions[index];

            Object.keys(action).forEach((key: string) => {
                if (ACTIONS_EMPTY_VALUE.includes(key as any)) return;

                const label =
                    (FORM_PAGE_RULES as any)?.[action?.action]?.[key]?.label ||
                    key;

                if (!action[key]) {
                    setError(`actions.${index}.${key}` as any, {
                        type: "manual",
                        message: `${label} không được bỏ trống`,
                    });
                }
            });
        }

        if (Object.keys(errors)?.length) return;

        const formatValue = actions?.map((item: any) => {
            const { action, ...rest } = item;

            if (ACTIONS_EMPTY_VALUE.includes(action)) {
                return {
                    id: action,
                };
            }

            if (action === SETTINGS_ENUM.FORWARDING_URL) {
                return {
                    id: action,
                    value: {
                        status_code: Number(rest?.status_code),
                        url: rest?.url,
                    },
                };
            }

            if ([SETTINGS_ENUM.EDGE_CACHE_TTL, SETTINGS_ENUM.BROWSER_CACHE_TTL].includes(action)) {
                return {
                    id: action,
                    value: Number(rest?.value),
                }
            }

            return {
                id: action,
                ...rest,
            };
        });

        const payload: any = {
            actions: formatValue,
            zone_id,
            
        };

        if (!isEdit) {
            payload.status = "active";
            payload.targets = [
                {
                    target: "url",
                    constraint: {
                        operator: "matches",
                        value: url.trim(),
                    },
                },
            ];
        }

        try {
            const { data } = isEdit 
                ? await cloudflareApis.updatePageRole(pageRoleId as string, payload) 
                : await cloudflareApis.createPageRule(payload);

            if (data?.status === 1) {
                showToast(`${isEdit ? 'Cập nhật' : 'Thêm'} Page Rule thành công!`, "success");
                fetch();
                dispatch(resetModal());
            }
        } catch (error: any) {
            const parseError: any = JSON.parse(error?.response?.data?.error);
            const message =
                parseError?.errors[0]?.message || `${isEdit ? 'Cập nhật' : 'Thêm'} Page Rule thất bại`;

            showToast(message, "error");
        }
    };

    return (
        <div className="h-full relative flex flex-col justify-between px-6 pb-10">
            <div className="bg-[rgb(236, 244, 255)] border border-[rgb(130, 182, 255)] px-4 py-2 flex flex-col gap-2 rounded-md">
                <h5>Nếu URL khớp:</h5>

                <p className="text-base">
                    Bằng cách sử dụng ký tự dấu hoa thị (*), bạn có thể tạo các
                    mẫu động có thể khớp với nhiều URL thay vì chỉ một URL. Tất
                    cả các URL đều không phân biệt chữ hoa chữ thường.
                </p>

                <a
                    href="https://developers.cloudflare.com/rules/page-rules"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 underline underline-offset-4 text-base"
                >
                    Tìm hiểu thêm về Page Rules.
                </a>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-80">
                    <CircularProgress color="primary" size="lg" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6 mt-4">
                        <Input
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
                            type={"text"}
                            label={"URL"}
                            placeholder={`Example: www.box-music.today/*`}
                            value={url}
                            onValueChange={setUrl}
                            isInvalid={!!url ? false : true}
                            errorMessage={`URL không được bỏ trống!`}
                        />

                        {fields?.map((fieldItem: any, index: number) => {
                            const getActionValue = watch("actions")[index]?.action || fieldItem.action;
                            const form = (FORM_PAGE_RULES as any)[getActionValue];

                            return (
                                <div
                                    key={fieldItem?.id}
                                    className="grid grid-cols-12 gap-x-6 gap-y-4 relative"
                                >
                                    {form && Object.keys(form)?.map((key) => (
                                        <Controller
                                            key={key}
                                            name={
                                                `actions.${index}.${key}` as any
                                            }
                                            control={control}
                                            render={({ field }) => {
                                                if (form[key]?.type === "select") {
                                                    return (
                                                        <Select
                                                            key={key}
                                                            labelPlacement="outside"
                                                            label={form[key]?.label}
                                                            placeholder={form[key]?.label}
                                                            items={key === "action" ? getOptions(index) : form[key] ?.options}
                                                            selectionMode="single"
                                                            classNames={{
                                                                base: `w-full ${
                                                                    key ===
                                                                    "action"
                                                                        ? "col-span-6"
                                                                        : "col-span-5"
                                                                }`,
                                                                label: "text-dark font-medium text-base",
                                                                value: "text-base",
                                                                trigger:
                                                                    "text-base text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                                                            }}
                                                            disallowEmptySelection
                                                            selectedKeys={new Set([field?.value])}
                                                            onSelectionChange={(value) => {
                                                                const parseValue = [...value][0];

                                                                field.onChange(parseValue);
                                                            }}
                                                            renderValue={(items) => {
                                                                const textValue = items.map((e) => e.rendered);

                                                                return (
                                                                    <span className="text-base">
                                                                        {textValue.join(", ")}
                                                                    </span>
                                                                );
                                                            }}
                                                            isInvalid={!!(errors?.actions as any)?.[index]?.[key]?.message}
                                                            errorMessage={(errors?.actions as any)?.[index]?.[key]?.message}
                                                        >
                                                            {(item: any) => (
                                                                <SelectItem key={item.value} textValue={item.value}>
                                                                    {item?.label}
                                                                </SelectItem>
                                                            )}
                                                        </Select>
                                                    );
                                                }

                                                if (form[key]?.type === "switch") {
                                                    return (
                                                        <div className="flex flex-col items-start col-span-5">
                                                            <p className="h-7 w-7"></p>

                                                            <Switch
                                                                color="primary"
                                                                size="sm"
                                                                isSelected={field?.value === "on" ? true : false}
                                                                startContent={
                                                                    <FaCheck />
                                                                }
                                                                endContent={
                                                                    <IoClose />
                                                                }
                                                                onValueChange={(checked) => {
                                                                    if (checked) {
                                                                        field.onChange("on");
                                                                    } else {
                                                                        field.onChange("off");
                                                                    }
                                                                }}
                                                            >
                                                                {form[key]?.label}
                                                            </Switch>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <Input
                                                        radius="sm"
                                                        color="primary"
                                                        variant="bordered"
                                                        labelPlacement="outside"
                                                        classNames={{
                                                            base: "col-span-3",
                                                            inputWrapper:
                                                                "h-10 data-[hover=true]:border-primary border border-slate-400",
                                                            label: "text-dark font-medium",
                                                        }}
                                                        type={"text"}
                                                        label={form[key]?.label}
                                                        placeholder={form[key]?.placeholder ||form[key]?.label}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        isInvalid={!!(errors?.actions as any)?.[index]?.[key]?.message}
                                                        errorMessage={(errors?.actions as any)?.[index]?.[key]?.message}
                                                    />
                                                );
                                            }}
                                        />
                                    ))}

                                    {fields?.length > 1 && (
                                        <Button
                                            variant="solid"
                                            radius="full"
                                            color="default"
                                            className={`absolute top-1/3 right-1 min-w-0 bg-transparent hover:bg-gray-200 w-max p-[6px] h-max min-h-max`}
                                            onPress={() => remove(index)}
                                        >
                                            <IoClose className="min-w-max text-base w-4 h-4 text-gray-400" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}

                        {watch("actions")?.length < SETTING_OPTIONS?.length && (
                            <Button
                                variant="solid"
                                color="default"
                                className={`rounded-md text-base font-medium h-9 max-md:text-sm w-max`}
                                onPress={handleAppendAction}
                            >
                                Thêm cài đặt
                            </Button>
                        )}

                        <Divider className="my-4" />

                        <div className="flex gap-3">
                            <Button
                                variant="solid"
                                color="default"
                                className={`rounded-md text-base font-medium h-9 max-md:text-sm w-max`}
                                onPress={() => dispatch(resetModal())}
                            >
                                Hủy
                            </Button>

                            <Button
                                variant="solid"
                                className={`bg-primary-500 text-white rounded-md text-base font-medium h-9 max-md:text-sm w-max`}
                                type="submit"
                                isLoading={isSubmitting}
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

export default FormCloudflareRules;
