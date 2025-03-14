import Access from "@/components/Access/access";
import FilterVpsVng from "./components/filter-vps-vng";
import TableVpsVng from "./components/table-vps-vng";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function VpsBuCloud() {
  return (
    <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
      <div className="flex flex-col gap-3">
        <FilterVpsVng />

        <TableVpsVng />
      </div>
    </Access>
  );
}

export default VpsBuCloud;
