import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import FilterOrderDomainStatus from "./components/filter-order-domain-status";
import TableOrderDomainStatus from "./components/table-order-domain-status";

function OrderDomainStatus() {
    return (
        <Access subject={SubjectEnum.ORDER_DOMAIN_STATUS} action={ActionEnum.READ}>
			<div className="flex flex-col gap-3 mt-3">
                <FilterOrderDomainStatus />

                <TableOrderDomainStatus />
            </div>
        </Access>
    );
}

export default OrderDomainStatus;