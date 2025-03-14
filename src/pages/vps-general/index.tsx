import { ActionEnum, SubjectEnum } from "@/constants/enum";
import Access from "@/components/Access/access";
import FilterVpsGeneral from "./components/filter-vps-general";
import TableVpsOrther from "./components/table-vps-general";
export default function VpsGeneralPage() {
  return (
    <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
      <div className="flex flex-col gap-3">
        <FilterVpsGeneral />
        <TableVpsOrther />
      </div>
    </Access>
  );
}
