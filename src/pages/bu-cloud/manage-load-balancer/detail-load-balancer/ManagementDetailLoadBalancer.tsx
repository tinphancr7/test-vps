import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderDetailLoadBalancer from "./HeaderDetailLoadBalancer";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import SideBarLoadBalancer from "./SideBarLoadBalancer";
import { useAppDispatch } from "@/stores";
import { setDataSettingLoadBalancer } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting.slice";
import digitalOceanBuCloudApi from "@/apis/digital-ocean-bucloud.api";

function ManagementDetailLoadBalancer() {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const [dataInfo, setDataInfo] = useState<any>({});
  const dispatch = useAppDispatch();
  // ????? by tuan
  const [render, setRender] = useState<any>(true);

  const detailVPSDigitalOcean = async () => {
    const result = await digitalOceanBuCloudApi.detailLoadBalancerDigitalOcean(
      id
    );
    if (!result?.data?.status) {
      showToast(result?.data?.message, "error");
      navigate("/vps/load-balancer-digital-ocean");
      return;
    }
    setDataInfo(result?.data?.data);
    dispatch(
      setDataSettingLoadBalancer({
        detailSettingLoadBalancer: result?.data?.data,
      })
    );
  };
  useEffect(() => {
    detailVPSDigitalOcean();
  }, [render]);

  return (
    <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
      <HeaderDetailLoadBalancer info={dataInfo} />
      <SideBarLoadBalancer info={dataInfo} setRender={setRender} />
    </Access>
  );
}

export default ManagementDetailLoadBalancer;
