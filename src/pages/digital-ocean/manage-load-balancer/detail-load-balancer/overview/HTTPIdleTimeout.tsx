import { useAppDispatch, useAppSelector } from "@/stores";
import {
    setDataSettingLoadBalancer,
    updateSettingLoadBalancer,
} from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting.slice";
import showToast from "@/utils/toast";
import { Button, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import ButtonEdit from "./ButtonEdit";

function HTTPIdleTimeout({ info, setRender }: any) {
    const [enableEdit, setEnableEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        detailSettingLoadBalancer,
        dataChangeSetting,
        result,
        hiddenButtonEditSetting,
    }: any = useAppSelector((state) => state.loadBalancerEditDigitalOcean);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    ...dataChangeSetting,
                    http_idle_timeout_seconds:
                        detailSettingLoadBalancer?.http_idle_timeout_seconds,
                },
            })
        );
    }, [detailSettingLoadBalancer, enableEdit]);
    const isDisable = info?.status === "terminated";

    const handleChangeSettingLoadBalancer = async () => {
        if (
            info?.http_idle_timeout_seconds ===
            dataChangeSetting?.http_idle_timeout_seconds
        ) {
            setEnableEdit(false);
            dispatch(
                setDataSettingLoadBalancer({
                    hiddenButtonEditSetting: false,
                })
            );
            return;
        }
        setIsLoading(true);
        setEnableEdit(false);
        showToast("Đang cập nhật thay đổi", "info");
        await dispatch(
            updateSettingLoadBalancer({
                _id: info?._id,
                dataChangeSetting: {
                    http_idle_timeout_seconds:
                        dataChangeSetting?.http_idle_timeout_seconds,
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
        if (!result?.status && Object.keys(result).length > 0) {
            showToast(result?.data, "error");
            return;
        }
        setRender((prev: any) => !prev);
        showToast(result?.data, "success");
    }, [isLoading]);
    return (
        <>
            {!enableEdit ? (
                <div className=" grid grid-cols-4 my-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        HTTP Idle Timeout :
                    </h3>
                    <div className=" col-span-2 my-auto gap-4 ">
                        <p>{info?.http_idle_timeout_seconds}</p>
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
                                isDisabled={isDisable}
                                className="bg-primary"
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
                        <div className=" mt-4 ">
                            <span className="font-bold">HTTP Idle Timeout</span>
                            <Input
                                radius="none"
                                type="number"
                                value={String(
                                    dataChangeSetting?.http_idle_timeout_seconds
                                )}
                                // label={`${t("advancedSetting.list2.httpDesc")}`}
                                // labelPlacement="outside"
                                variant="bordered"
                                // isInvalid={
                                //   timeoutHTTP === ""
                                //     ? true
                                //     : isNotNumberIdle
                                //     ? true
                                //     : Number(timeoutHTTP) < 30
                                //     ? true
                                //     : Number(timeoutHTTP) > 600
                                //     ? true
                                //     : false
                                // }
                                // color={
                                //   timeoutHTTP === ""
                                //     ? "danger"
                                //     : isNotNumberIdle
                                //     ? "danger"
                                //     : Number(timeoutHTTP) < 30
                                //     ? "danger"
                                //     : Number(timeoutHTTP) > 600
                                //     ? "danger"
                                //     : undefined
                                // }
                                // errorMessage={
                                //   timeoutHTTP === ""
                                //     ? t("advancedSetting.list2.mustBe30")
                                //     : isNotNumberIdle
                                //     ? t("advancedSetting.list2.mustBe30")
                                //     : Number(timeoutHTTP) < 30
                                //     ? t("advancedSetting.list2.mustBe30")
                                //     : Number(timeoutHTTP) > 600
                                //     ? t("advancedSetting.list2.mustBe600")
                                //     : ""
                                // }
                                onValueChange={(e) => {
                                    dispatch(
                                        setDataSettingLoadBalancer({
                                            dataChangeSetting: {
                                                ...dataChangeSetting,
                                                http_idle_timeout_seconds:
                                                    Number(e),
                                            },
                                        })
                                    );
                                }}
                                className="mt-4 lg:w-1/4"
                            />
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

export default HTTPIdleTimeout;
