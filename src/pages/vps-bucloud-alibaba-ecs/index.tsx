import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterTableBuCloudAlibabaEcs from "./components/filter-table-vps-bucloud-alibaba-ecs";
import TableBuCloudAlibabaEcs from "./components/table-bucloud-alibaba-ecs";

function VpsBuCloudAlibabaEcs() {
    return (
        <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <FilterTableBuCloudAlibabaEcs />

                <TableBuCloudAlibabaEcs />
            </div>
        </Access>
    )
}

export default VpsBuCloudAlibabaEcs;