import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterAwsLightsail from "./components/filter-vps-aws-lightsail";
import TableAwsLightsail from "./components/table-vps-aws-lightsail";

function VpsAwsLightsail() {
    return (
        <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <FilterAwsLightsail />

                <TableAwsLightsail />
            </div>
        </Access>
    )
}

export default VpsAwsLightsail;