import { ActionEnum, SubjectEnum } from "@/constants/enum";
import Access from "@/components/Access/access";
import FilterBrand from "./components/filter-brand";
import TableBrand from "./components/table-brand";

function Brands() {
    return (
        <Access subject={SubjectEnum.BRAND} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <FilterBrand />

                <TableBrand />
            </div>
        </Access>
    );
}

export default Brands;
