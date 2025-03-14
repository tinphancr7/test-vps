import Container from "@/components/container";
import RegionDigitalOcean from "./region/RegionDigitalOcean";
import ConfirmBuyLoadBalancer from "./button-confirm/ConfirmBuyLoadBalancer";
import ScalingConfigurationLoadBalancer from "./scaling-config/ScalingConfigurationLoadBalancer";
import ConnectVPSLoadBalancer from "./connect-vps-load-balancer/ConnectVPSLoadBalancer";
import ForwardingRules from "./forwarding-rule/ForwardingRule";
import AdvanceSettingLoadBalancer from "./advance-setting/AdvanceSettingLoadBalancer";
import NameLoadBalancer from "./name-load-balancer/NameLoadBalancer";

function CreateLoadBalancerDigitalOceanBuCloud() {
  return (
    <Container className="overflow-auto scroll-main pb-0">
      <p className="font-bold text-2xl">Tạo Load Balancer bằng Digital Ocean</p>
      <RegionDigitalOcean />
      <ScalingConfigurationLoadBalancer />
      <ConnectVPSLoadBalancer />
      <ForwardingRules />
      <AdvanceSettingLoadBalancer />
      <NameLoadBalancer />
      <ConfirmBuyLoadBalancer />
    </Container>
  );
}

export default CreateLoadBalancerDigitalOceanBuCloud;
