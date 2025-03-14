import { useAppDispatch, useAppSelector } from "@/stores";
import {
    setDataSettingLoadBalancer,
    updateSettingLoadBalancer,
} from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting.slice";
import showToast from "@/utils/toast";
import {
    Button,
    Input,
    Select,
    SelectItem,
    SelectSection,
} from "@heroui/react";
import { useEffect, useState } from "react";
import ButtonEdit from "./ButtonEdit";

function HealthChecks({ info, setRender }: any) {
    const [enableEdit, setEnableEdit] = useState(false);
    const {
        detailSettingLoadBalancer,
        dataChangeSetting,
        result,
        hiddenButtonEditSetting,
    }: any = useAppSelector((state) => state.loadBalancerEditDigitalOcean);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (!result?.status && Object.keys(result).length > 0) {
            showToast(result?.data, "error");
            return;
        }
        setRender((prev: any) => !prev);
        showToast(result?.data, "success");
    }, [isLoading]);

    const handleChangeSettingLoadBalancer = async () => {
        setIsLoading(true);
        setEnableEdit(false);
        showToast("Đang cập nhật thay đổi", "info");
        await dispatch(
            updateSettingLoadBalancer({
                _id: info?._id,
                dataChangeSetting: {
                    healthChecks: dataChangeSetting?.healthChecks,
                },
                region: info?.slugDataCenter,
                forwarding_rules: info?.forwarding_rules,
                name: info?.name_load_balancer,
            })
        );
        dispatch(
            setDataSettingLoadBalancer({
                hiddenButtonEditSetting: false,
            })
        );
        setIsLoading(false);
    };

    useEffect(() => {
        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    ...dataChangeSetting,
                    healthChecks: {
                        protocol:
                            detailSettingLoadBalancer?.health_check?.protocol,
                        port: detailSettingLoadBalancer?.health_check?.port,
                        path: detailSettingLoadBalancer?.health_check?.path,
                        interval:
                            detailSettingLoadBalancer?.health_check
                                ?.check_interval_seconds,
                        timeout:
                            detailSettingLoadBalancer?.health_check
                                ?.response_timeout_seconds,
                        healthy_threshold:
                            detailSettingLoadBalancer?.health_check
                                ?.healthy_threshold,
                        unhealthy_threshold:
                            detailSettingLoadBalancer?.health_check
                                ?.unhealthy_threshold,
                    },
                },
            })
        );
    }, [detailSettingLoadBalancer, enableEdit]);
    const dispatch = useAppDispatch();
    const protocolHealChecks = [
        { label: "TCP", key: "tcp", value: "TCP" },
        { label: "HTTP", key: "http", value: "HTTP" },
        { label: "HTTPS", key: "https", value: "HTTPS" },
    ];
    const isDisable = info?.status === "terminated";
    const handleChangeProtocol = (e: any) => {
        if (e.target.value === "tcp") {
            dispatch(
                setDataSettingLoadBalancer({
                    dataChangeSetting: {
                        ...dataChangeSetting,
                        healthChecks: {
                            ...dataChangeSetting?.healthChecks,
                            path: "/",
                        },
                    },
                })
            );
        }
        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    ...dataChangeSetting,
                    healthChecks: {
                        ...dataChangeSetting?.healthChecks,
                        protocol: e?.target?.value,
                        path: "/",
                    },
                },
            })
        );
    };
    return (
        <>
            {!enableEdit ? (
                <div className=" grid grid-cols-4 my-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        Health check:
                    </h3>
                    <div className=" col-span-2 my-auto gap-4 ">
                        <p className="flex gap-2">
                            {info?.health_check?.protocol}://0.0.0.0:
                            {info?.health_check?.port}
                            {info?.health_check?.path}
                        </p>
                    </div>
                    <div className="col-span-1 my-auto flex justify-center">
                        {!hiddenButtonEditSetting ? (
                            <Button
                                onPress={() => {
                                    setEnableEdit(true);
                                    dispatch(
                                        setDataSettingLoadBalancer({
                                            hiddenButtonEditSetting: true,
                                            result: {},
                                        })
                                    );
                                }}
                                className="bg-primary"
                                isDisabled={isDisable}
                            >
                                Thay đổi
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="my-4">
                        <div className="healthChecks ">
                            <p className="font-semibold text-[1.3rem] text-[#444] ">
                                Health checks
                            </p>
                            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-4">
                                <Select
                                    // items={protocolHealChecks}
                                    label="Protocol"
                                    variant="bordered"
                                    radius="none"
                                    value={
                                        dataChangeSetting?.healthChecks
                                            ?.protocol
                                    }
                                    defaultSelectedKeys={[
                                        dataChangeSetting?.healthChecks
                                            ?.protocol,
                                    ]}
                                    disallowEmptySelection={true}
                                    onChange={handleChangeProtocol}
                                >
                                    <SelectSection title="Protocol">
                                        {protocolHealChecks.map((item: any) => {
                                            return (
                                                <SelectItem key={item.key}>
                                                    {item.label}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectSection>
                                </Select>

                                <Input
                                    radius="none"
                                    value={
                                        dataChangeSetting?.healthChecks?.port
                                    }
                                    type="text"
                                    label="Port"
                                    variant="bordered"
                                    // isInvalid={
                                    //     valuePort === "" || isNotNumberPort
                                    //         ? true
                                    //         : false
                                    // }
                                    // color={
                                    //     valuePort === "" ||
                                    //     isNotNumberPort ||
                                    //     Number(valuePort) > 65535
                                    //         ? "danger"
                                    //         : undefined
                                    // }
                                    // errorMessage={
                                    //     valuePort === ""
                                    //         ? t("advancedSetting.list2.must1")
                                    //         : isNotNumberPort
                                    //         ? t("advancedSetting.list2.must1")
                                    //         : Number(valuePort) > 65535
                                    //         ? t(
                                    //               "advancedSetting.list2.mustBe65535"
                                    //           )
                                    //         : ""
                                    // }
                                    onValueChange={(e) => {
                                        dispatch(
                                            setDataSettingLoadBalancer({
                                                dataChangeSetting: {
                                                    ...dataChangeSetting,
                                                    healthChecks: {
                                                        ...dataChangeSetting?.healthChecks,
                                                        port: Number(e),
                                                    },
                                                },
                                            })
                                        );
                                    }}
                                    className="max-w-xs "
                                />
                                {dataChangeSetting?.healthChecks?.protocol ===
                                    "https" ||
                                dataChangeSetting?.healthChecks?.protocol ===
                                    "http" ? (
                                    <Input
                                        radius="none"
                                        value={
                                            dataChangeSetting?.healthChecks
                                                ?.path
                                        }
                                        type="text"
                                        label="Path"
                                        variant="bordered"
                                        // isInvalid={
                                        //     valuePath === ""
                                        //         ? true
                                        //         : checkString(valuePath)
                                        //         ? true
                                        //         : false
                                        // }
                                        // color={
                                        //     valuePath === ""
                                        //         ? "danger"
                                        //         : checkString(valuePath)
                                        //         ? "danger"
                                        //         : undefined
                                        // }
                                        // errorMessage={
                                        //     valuePath === ""
                                        //         ? t(
                                        //               "advancedSetting.list2.interval"
                                        //           )
                                        //         : checkString(valuePath)
                                        //         ? t(
                                        //               "advancedSetting.list2.interval"
                                        //           )
                                        //         : ""
                                        // }
                                        onValueChange={(e) => {
                                            dispatch(
                                                setDataSettingLoadBalancer({
                                                    dataChangeSetting: {
                                                        ...dataChangeSetting,
                                                        healthChecks: {
                                                            ...dataChangeSetting?.healthChecks,
                                                            path: e,
                                                        },
                                                    },
                                                })
                                            );
                                        }}
                                        className="max-w-xs"
                                    />
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="additionalSettings mt-4 ">
                            <p className="font-bold">Additional settings</p>

                            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 mt-4">
                                <Input
                                    radius="none"
                                    type="text"
                                    value={
                                        dataChangeSetting?.healthChecks
                                            ?.interval
                                    }
                                    label="Check interval (in s)"
                                    variant="bordered"
                                    // isInvalid={
                                    //     valueInterval === ""
                                    //         ? true
                                    //         : isNotNumberInterval
                                    //         ? true
                                    //         : Number(valueInterval) < 3
                                    //         ? true
                                    //         : Number(valueInterval) > 300
                                    //         ? true
                                    //         : false
                                    // }
                                    // color={
                                    //     valueInterval === ""
                                    //         ? "danger"
                                    //         : isNotNumberInterval
                                    //         ? "danger"
                                    //         : Number(valueInterval) < 3
                                    //         ? "danger"
                                    //         : Number(valueInterval) > 300
                                    //         ? "danger"
                                    //         : undefined
                                    // }
                                    // errorMessage={
                                    //     valueInterval === ""
                                    //         ? t("advancedSetting.list2.mustBe3")
                                    //         : isNotNumberInterval
                                    //         ? t("advancedSetting.list2.mustBe3")
                                    //         : Number(valueInterval) < 3
                                    //         ? t("advancedSetting.list2.mustBe3")
                                    //         : Number(valueInterval) > 300
                                    //         ? t(
                                    //               "advancedSetting.list2.mustBe300"
                                    //           )
                                    //         : ""
                                    // }
                                    onValueChange={(e) => {
                                        dispatch(
                                            setDataSettingLoadBalancer({
                                                dataChangeSetting: {
                                                    ...dataChangeSetting,
                                                    healthChecks: {
                                                        ...dataChangeSetting?.healthChecks,
                                                        interval: Number(e),
                                                    },
                                                },
                                            })
                                        );
                                    }}
                                    className="max-w-xs"
                                />
                                <Input
                                    radius="none"
                                    type="text"
                                    value={
                                        dataChangeSetting?.healthChecks?.timeout
                                    }
                                    label="Response Timeout (in s)"
                                    variant="bordered"
                                    // isInvalid={
                                    //     valueTimeOut === ""
                                    //         ? true
                                    //         : isNotNumberTimeOut
                                    //         ? true
                                    //         : Number(valueTimeOut) < 3
                                    //         ? true
                                    //         : Number(valueTimeOut) > 300
                                    //         ? true
                                    //         : false
                                    // }
                                    // color={
                                    //     valueTimeOut === ""
                                    //         ? "danger"
                                    //         : isNotNumberTimeOut
                                    //         ? "danger"
                                    //         : Number(valueTimeOut) < 3
                                    //         ? "danger"
                                    //         : Number(valueTimeOut) > 300
                                    //         ? "danger"
                                    //         : undefined
                                    // }
                                    // errorMessage={
                                    //     valueTimeOut === ""
                                    //         ? t("advancedSetting.list2.mustBe3")
                                    //         : isNotNumberTimeOut
                                    //         ? t("advancedSetting.list2.mustBe3")
                                    //         : Number(valueTimeOut) < 3
                                    //         ? t("advancedSetting.list2.mustBe3")
                                    //         : Number(valueTimeOut) > 300
                                    //         ? t(
                                    //               "advancedSetting.list2.mustBe300"
                                    //           )
                                    //         : ""
                                    // }
                                    onValueChange={(e) => {
                                        dispatch(
                                            setDataSettingLoadBalancer({
                                                dataChangeSetting: {
                                                    ...dataChangeSetting,
                                                    healthChecks: {
                                                        ...dataChangeSetting?.healthChecks,
                                                        timeout: Number(e),
                                                    },
                                                },
                                            })
                                        );
                                    }}
                                    className="max-w-xs"
                                />
                                <Input
                                    radius="none"
                                    type="text"
                                    value={
                                        dataChangeSetting?.healthChecks
                                            ?.unhealthy_threshold
                                    }
                                    label="Unhealthy Threshold"
                                    variant="bordered"
                                    // isInvalid={
                                    //     valueUnhealthy === ""
                                    //         ? true
                                    //         : isNotNumberUnhealthy
                                    //         ? true
                                    //         : Number(valueUnhealthy) < 2
                                    //         ? true
                                    //         : Number(valueUnhealthy) > 11
                                    //         ? true
                                    //         : false
                                    // }
                                    // color={
                                    //     valueUnhealthy === ""
                                    //         ? "danger"
                                    //         : isNotNumberUnhealthy
                                    //         ? "danger"
                                    //         : Number(valueUnhealthy) < 2
                                    //         ? "danger"
                                    //         : Number(valueUnhealthy) > 11
                                    //         ? "danger"
                                    //         : undefined
                                    // }
                                    // errorMessage={
                                    //     valueUnhealthy === ""
                                    //         ? t("advancedSetting.list2.mustBe2")
                                    //         : isNotNumberUnhealthy
                                    //         ? t("advancedSetting.list2.mustBe2")
                                    //         : Number(valueUnhealthy) < 2
                                    //         ? t("advancedSetting.list2.mustBe2")
                                    //         : Number(valueUnhealthy) > 11
                                    //         ? t(
                                    //               "advancedSetting.list2.mustBe10"
                                    //           )
                                    //         : undefined
                                    // }
                                    onValueChange={(e) => {
                                        dispatch(
                                            setDataSettingLoadBalancer({
                                                dataChangeSetting: {
                                                    ...dataChangeSetting,
                                                    healthChecks: {
                                                        ...dataChangeSetting?.healthChecks,
                                                        unhealthy_threshold:
                                                            Number(e),
                                                    },
                                                },
                                            })
                                        );
                                    }}
                                    className="max-w-xs"
                                />
                                <Input
                                    radius="none"
                                    type="text"
                                    value={
                                        dataChangeSetting?.healthChecks
                                            ?.healthy_threshold
                                    }
                                    label="Healthy Threshold"
                                    variant="bordered"
                                    // isInvalid={
                                    //     valueHealthy === ""
                                    //         ? true
                                    //         : isNotNumberHealthy
                                    //         ? true
                                    //         : Number(valueHealthy) < 2
                                    //         ? true
                                    //         : Number(valueHealthy) > 11
                                    //         ? true
                                    //         : false
                                    // }
                                    // color={
                                    //     valueHealthy === ""
                                    //         ? "danger"
                                    //         : isNotNumberHealthy
                                    //         ? "danger"
                                    //         : Number(valueHealthy) < 2
                                    //         ? "danger"
                                    //         : Number(valueHealthy) > 11
                                    //         ? "danger"
                                    //         : undefined
                                    // }
                                    // errorMessage={
                                    //     valueHealthy === ""
                                    //         ? t("advancedSetting.list2.mustBe2")
                                    //         : isNotNumberHealthy
                                    //         ? t("advancedSetting.list2.mustBe2")
                                    //         : Number(valueHealthy) < 2
                                    //         ? t("advancedSetting.list2.mustBe2")
                                    //         : Number(valueHealthy) > 11
                                    //         ? t(
                                    //               "advancedSetting.list2.mustBe10"
                                    //           )
                                    //         : ""
                                    // }
                                    onValueChange={(e) => {
                                        dispatch(
                                            setDataSettingLoadBalancer({
                                                dataChangeSetting: {
                                                    ...dataChangeSetting,
                                                    healthChecks: {
                                                        ...dataChangeSetting?.healthChecks,
                                                        healthy_threshold:
                                                            Number(e),
                                                    },
                                                },
                                            })
                                        );
                                    }}
                                    className="max-w-xs"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 my-4">
                            <ButtonEdit
                                handleChangeSettingLoadBalancer={
                                    handleChangeSettingLoadBalancer
                                }
                                setEnableEdit={setEnableEdit}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default HealthChecks;
