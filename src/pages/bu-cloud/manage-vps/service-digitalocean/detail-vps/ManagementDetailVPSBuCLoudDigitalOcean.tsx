import digitalOceanApi from "@/apis/digital-ocean.api";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderDetailVPS from "./HeaderDetailVPS";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import SideBarDigitalOcean from "./SideBarDigitalOcean";

function ManagementDetailVPSBuCLoudDigitalOcean() {
    const { id }: any = useParams();
    const navigate = useNavigate();
    const [dataInfo, setDataInfo] = useState<any>({});

    // ????? by tuan
    const [render, setRender] = useState<any>(true);

    const detailVPSDigitalOcean = async () => {
        const result = await digitalOceanApi.detailVPSBuCloudDigitalOcean(id);
        if (!result?.data?.status) {
            showToast(result?.data?.message, "error");
            navigate("/vps/bu-cloud", {
                state: { keyTab: "digital-ocean" },
            });
            return;
        }
        setDataInfo(result?.data?.data);
    };
    useEffect(() => {
        detailVPSDigitalOcean();
    }, [render]);

    return (
        <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
            <HeaderDetailVPS info={dataInfo} setRender={setRender} />
            <SideBarDigitalOcean info={dataInfo} setRender={setRender} />
        </Access>
    );
}

export default ManagementDetailVPSBuCLoudDigitalOcean;
