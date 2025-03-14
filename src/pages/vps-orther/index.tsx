import { ActionEnum, SubjectEnum } from "@/constants/enum";
import Access from "@/components/Access/access";
import FilterVpsOrther from "./components/filter-vps-orther";
import TableVpsOrther from "./components/table-vps-orther";
export default function ManagementOrtherVps() {
  return (
    <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
      <div className="flex flex-col gap-3">
        <FilterVpsOrther />
        <TableVpsOrther />
      </div>
    </Access>
  );
}
