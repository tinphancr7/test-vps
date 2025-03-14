import { Divider } from "@heroui/react";
import ScalingConfiguration from "./ScalingConfiguration";
import ForwardingRules from "./ForwardingRules";
import HealthChecks from "./HealthChecks";
import StickySessions from "./StickySessions";
import SSLRedirect from "./SSLRedirect";
import ProxyProtocol from "./ProxyProtocol";
import BackendKeepalive from "./BackendKeepalive";
import HTTPIdleTimeout from "./HTTPIdleTimeout";
import { useEffect } from "react";
import { setDataSettingLoadBalancer } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting.slice";
import { useAppDispatch } from "@/stores";

function OverviewDigitalOcean({ info, setRender }: any) {
    const dataRender = [
        {
            key: "ScalingConfiguration",
            render: <ScalingConfiguration info={info} setRender={setRender} />,
        },
        {
            key: "ForwardingRules",
            render: <ForwardingRules info={info} setRender={setRender} />,
        },
        {
            key: "HealthChecks",
            render: <HealthChecks info={info} setRender={setRender} />,
        },
        {
            key: "StickySession",
            render: <StickySessions info={info} setRender={setRender} />,
        },
        {
            key: "SSLRedirect",
            render: <SSLRedirect info={info} setRender={setRender} />,
        },
        {
            key: "ProxyProtocol",
            render: <ProxyProtocol info={info} setRender={setRender} />,
        },
        {
            key: "BackenKeepalive",
            render: <BackendKeepalive info={info} setRender={setRender} />,
        },
        {
            key: "HTTPIdleTimeout",
            render: <HTTPIdleTimeout info={info} setRender={setRender} />,
        },
    ];
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(
            setDataSettingLoadBalancer({
                hiddenButtonEditSetting: false,
                result: {},
            })
        );
    }, []);
    return (
        <div className="p-4">
            <div className=" grid grid-cols-4 my-4">
                <h3 className="col-span-1 text-base font-bold my-auto">
                    Địa chỉ IP:
                </h3>
                <div className=" col-span-3 my-auto gap-4 flex justify-between text-center">
                    <span>
                        <strong>{info?.ip}</strong>
                    </span>
                </div>
            </div>
            <Divider />
            <div className=" grid grid-cols-4 my-4">
                <h3 className="col-span-1 text-base font-bold my-auto">
                    Khu vực:
                </h3>
                <div className=" col-span-3 my-auto gap-4 flex justify-between text-center">
                    <span>
                        <strong>
                            {info?.region?.name} -{" "}
                            {info?.region?.slug.toUpperCase()}
                        </strong>
                    </span>
                </div>
            </div>
            <Divider />
            {dataRender.map((item: any) => {
                return (
                    <div key={item.key}>
                        {item.render}
                        <Divider />
                    </div>
                );
            })}
            <div className=" grid grid-cols-4 my-4">
                <h3 className="col-span-1 text-base font-bold my-auto">
                    Ghi chú:
                </h3>
                <div className=" col-span-3 my-auto gap-4">
                    <p>
                        <strong>{info?.note}</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OverviewDigitalOcean;
