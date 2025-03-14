import AccessRuleSecurityGroup from "./access-rule-security-group";
import BasicInformationSecurityGroup from "./basic-information-security-group";

function SecurityGroups() {
    return (
        <div className="flex flex-col gap-3">
            <BasicInformationSecurityGroup />

            <AccessRuleSecurityGroup />
        </div>
    )
}

export default SecurityGroups;