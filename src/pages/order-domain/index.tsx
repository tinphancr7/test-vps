import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterOrderDomain from "./components/filter-order-domain";
import TableOrderDomain from "./components/table-order-domain";

function OrderDomain() {
    return (
        <Access subject={SubjectEnum.ORDER_DOMAIN} action={ActionEnum.READ}>
			<div className="flex flex-col gap-3 mt-3">
                <FilterOrderDomain />

                <TableOrderDomain />
            </div>
        </Access>
    );
}

export default OrderDomain;