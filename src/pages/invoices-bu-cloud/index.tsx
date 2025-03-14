import LazyLoadingLayout from "@/components/lazy-loading-layout";
import { Suspense } from "react";
import FilterTable from "./components/filter-table";
import TableInvoiceAws from "./components/table-invoice-aws";

function InvoicesBuCloudAws() {
    return (
        <>
            <Suspense fallback={<LazyLoadingLayout />}>
                <FilterTable />

                <TableInvoiceAws />
            </Suspense>
        </>
    );
}

export default InvoicesBuCloudAws;
