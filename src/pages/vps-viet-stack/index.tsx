import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterVpsVietStack from "./components/filter-vps-vietstack";
import TableVpsVietStack from "./components/table-vps-vietstack";
import Access from "@/components/Access/access";

function VpsVietStack() {
    return (  
		<Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <FilterVpsVietStack />

                <TableVpsVietStack />
            </div>
        </Access>
    );
}

export default VpsVietStack;