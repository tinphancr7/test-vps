import { useAppDispatch, useAppSelector } from "@/stores";
import {
  setDataSettingLoadBalancer,
  updateSettingLoadBalancer,
} from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting-bu-cloud.slice";
import showToast from "@/utils/toast";
import { Button, Checkbox } from "@heroui/react";
import { useEffect, useState } from "react";
import ButtonEdit from "./ButtonEdit";

function BackendKeepalive({ info, setRender }: any) {
  const [enableEdit, setEnableEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    detailSettingLoadBalancer,
    dataChangeSetting,
    result,
    hiddenButtonEditSetting,
  }: any = useAppSelector((state) => state.loadBalancerEditDigitalOceanBuCloud);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setDataSettingLoadBalancer({
        dataChangeSetting: {
          ...dataChangeSetting,
          enable_backend_keepalive:
            detailSettingLoadBalancer?.enable_backend_keepalive,
        },
      })
    );
  }, [detailSettingLoadBalancer, enableEdit]);
  const handleChangeSettingLoadBalancer = async () => {
    if (
      info?.enable_backend_keepalive ===
      dataChangeSetting?.enable_backend_keepalive
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
          enable_backend_keepalive: dataChangeSetting?.enable_backend_keepalive,
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
            Backend keepalive :
          </h3>
          <div className=" col-span-2 my-auto gap-4 ">
            <p>{info?.enable_backend_keepalive ? "Bật" : "Tắt"}</p>
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
            <div className="backendKeppalive mt-4 ">
              <p className="font-bold">Backend Keepalive</p>
              <div className=" gap-1 my-3 flex ">
                <Checkbox
                  radius="md"
                  isSelected={dataChangeSetting?.enable_backend_keepalive}
                  onValueChange={(e) => {
                    dispatch(
                      setDataSettingLoadBalancer({
                        dataChangeSetting: {
                          ...dataChangeSetting,
                          enable_backend_keepalive: e,
                        },
                      })
                    );
                  }}
                >
                  Bật Backend Keepalive
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

export default BackendKeepalive;
