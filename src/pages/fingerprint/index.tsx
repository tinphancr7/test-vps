import Access from "@/components/Access/access";
import FilterFingerPrints from "./components/filter";
import TableFingerPrints from "./components/table";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function FingerPrints() {
  return (
    <Access subject={SubjectEnum.LOG_LOGIN} action={ActionEnum.READ}>
      <div className="flex flex-col gap-3 mt-3">
        <FilterFingerPrints />

        <TableFingerPrints />
      </div>
    </Access>
  );
}

export default FingerPrints;
