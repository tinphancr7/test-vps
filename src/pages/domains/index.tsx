import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterDomains from "./components/filter-domains";
import TableDomains from "./components/table-domains";

function Domains() {
    return (
        <Access subject={SubjectEnum.DOMAIN} action={ActionEnum.READ}>
			<div className="flex flex-col gap-3 mt-3">
                <FilterDomains />

                <TableDomains />
            </div>
        </Access>
    )
}

export default Domains;