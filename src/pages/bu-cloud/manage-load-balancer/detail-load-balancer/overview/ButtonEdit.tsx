import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataSettingLoadBalancer } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting-bu-cloud.slice";
import { Button } from "@heroui/react";

function ButtonEdit({ handleChangeSettingLoadBalancer, setEnableEdit }: any) {
  const dispatch = useAppDispatch();
  const { isConfirmUpdateNode, isLoadingSetting }: any = useAppSelector(
    (state) => state.loadBalancerEditDigitalOceanBuCloud
  );
  return (
    <>
      <Button
        color="primary"
        isDisabled={!isConfirmUpdateNode}
        onPress={handleChangeSettingLoadBalancer}
        isLoading={isLoadingSetting}
      >
        Cập nhật
      </Button>
      <Button
        onPress={() => {
          setEnableEdit(false);
          dispatch(
            setDataSettingLoadBalancer({
              hiddenButtonEditSetting: false,
              dataChangeSetting: {},
            })
          );
        }}
      >
        Hủy
      </Button>
    </>
  );
}

export default ButtonEdit;
