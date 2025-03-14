import { useAppDispatch, useAppSelector } from "@/stores";
import {
  setDataSettingLoadBalancer,
  updateSettingLoadBalancer,
} from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting-bu-cloud.slice";
import { Button, Checkbox } from "@heroui/react";
import { useEffect, useState } from "react";
import ButtonEdit from "./ButtonEdit";
import showToast from "@/utils/toast";

function SSLRedirect({ info, setRender }: any) {
    const [enableEdit, setEnableEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
      detailSettingLoadBalancer,
      dataChangeSetting,
      result,
      hiddenButtonEditSetting,
    }: any = useAppSelector(
      (state) => state.loadBalancerEditDigitalOceanBuCloud
    );

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    ...dataChangeSetting,
                    redirect_http_to_https:
                        detailSettingLoadBalancer?.redirect_http_to_https,
                },
            })
        );
    }, [detailSettingLoadBalancer, enableEdit]);
    const handleChangeSettingLoadBalancer = async () => {
        if (
            info?.redirect_http_to_https ===
            dataChangeSetting?.redirect_http_to_https
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
                    redirect_http_to_https:
                        dataChangeSetting?.redirect_http_to_https,
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
    const isDisable = info?.status === "terminated";

    return (
        <>
            {!enableEdit ? (
                <div className=" grid grid-cols-4 my-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        SSL :
                    </h3>
                    <div className=" col-span-2 my-auto gap-4 ">
                        <p>
                            {info?.redirect_http_to_https
                                ? "Chuyển tiếp từ HTTP sang HTTPS"
                                : "Không chuyển tiếp"}
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
                        <div className="ssl mt-4 ">
                            <p className="font-bold">SSL</p>
                            <div className=" gap-1 my-3 flex">
                                <Checkbox
                                    radius="md"
                                    isSelected={
                                        dataChangeSetting?.redirect_http_to_https
                                    }
                                    onValueChange={(e) => {
                                        dispatch(
                                            setDataSettingLoadBalancer({
                                                dataChangeSetting: {
                                                    ...dataChangeSetting,
                                                    redirect_http_to_https: e,
                                                },
                                            })
                                        );
                                    }}
                                >
                                    Chuyển tiếp từ HTTP đến HTTPS
                                </Checkbox>
                            </div>
                        </div>
                        <div className="flex gap-4">
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

export default SSLRedirect;
