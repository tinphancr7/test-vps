import digitalOceanApi from "@/apis/digital-ocean.api";
import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConfirmBuyLoadBalancer() {
  const navigate = useNavigate();
  const { statusValueNode, valueOfNode } = useAppSelector(
    (state) => state.digitalOceanLBScaling
  );
  const { forwarding_rules } = useAppSelector(
    (state) => state.digitalOceanForwardingRule
  );
  const { isValidName, nameLoadBalancer, team_id } = useAppSelector(
    (state) => state.digitalOceanNameLoadBalancer
  );

  const { selectedRegion, selectedDataCenter } = useAppSelector(
    (state) => state.digitalOceanRegion
  );
  const { selectedVPSInRegion } = useAppSelector(
    (state) => state.digitalOceanLBConnectVPS
  );
  const {
    stickySessions,
    protocol,
    healcheckPort,
    healcheckPath,
    redirect_http_to_https,
    enable_proxy_protocol,
    enable_backend_keepalive,
    http_idle_timeout_seconds,
    cookieName,
    ttl,
    healcheck_check_interval_seconds,
    healcheck_response_timeout_seconds,
    healcheck_healthy_threshold,
    healcheck_unhealthy_threshold,
  } = useAppSelector((state) => state.digitalOceanAdvanceSetting);

  const stickySess =
    stickySessions === "none"
      ? { type: "none" }
      : {
          type: "cookies",
          cookie_name: cookieName,
          cookie_ttl_seconds: ttl,
        };

  const objectCreateLoadBalancer = {
    droplet_ids: [...selectedVPSInRegion],
    region: [...selectedDataCenter][0],
    name: nameLoadBalancer,
    size_unit: valueOfNode,
    forwarding_rules: forwarding_rules,
    health_check: {
      protocol: protocol,
      port: healcheckPort,
      path: healcheckPath,
      check_interval_seconds: healcheck_check_interval_seconds,
      response_timeout_seconds: healcheck_response_timeout_seconds,
      unhealthy_threshold: healcheck_unhealthy_threshold,
      healthy_threshold: healcheck_healthy_threshold,
    },
    sticky_session: stickySess,
    redirect_http_to_https,
    enable_proxy_protocol,
    enable_backend_keepalive,
    http_idle_timeout_seconds,
    team_id: team_id,
    selectedRegion,
  };
  const isValidCreate = () => {
    return statusValueNode && forwarding_rules?.length > 0 && isValidName;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateLoadBalancer = async () => {
    setIsLoading(true);
    const create = await digitalOceanApi.createLoadBalancerDigitalOcean(
      objectCreateLoadBalancer
    );
    if (!create?.data?.status) {
      showToast("Lỗi tạo Load Balancer, " + create?.data?.message, "error");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    showToast("Tạo thành công Load Balancer", "success");
    navigate("/vps/load-balancer-digital-ocean");
  };

  return (
    <div className="z-50 mt-10 w-full h-[100px] sticky bottom-0 bg-white border-t-[#dfdfdf] border-t border-solid p-4 flex justify-between items-center">
      <div className="grid ">
        <Button
          className="bg-primary text-white font-bold"
          radius="sm"
          isDisabled={!isValidCreate()}
          onPress={() => handleCreateLoadBalancer()}
          isLoading={isLoading}
        >
          Tạo Load Balancer
        </Button>
      </div>
    </div>
  );
}

export default ConfirmBuyLoadBalancer;
