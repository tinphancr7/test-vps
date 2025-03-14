import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterTableAlibabaEcs from "./components/filter-table-alibaba-ecs";
import TableAlibabaEcs from "./components/table-alibaba-ecs";

function VpsAlibabaEcs() {
    return (
        <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <FilterTableAlibabaEcs />

                <TableAlibabaEcs />
            </div>
        </Access>
    )
}

export default VpsAlibabaEcs;