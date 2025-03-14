import Access from "@/components/Access/access";
import TableVpsVng from "./components/table-vps-vng";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterVpsVng from "./components/filter-vps-vng";

function VpsUpCloud() {
  return (
    <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
      <div className="flex flex-col gap-3">
        <FilterVpsVng />

        <TableVpsVng />
      </div>
    </Access>
  );
}

export default VpsUpCloud;
