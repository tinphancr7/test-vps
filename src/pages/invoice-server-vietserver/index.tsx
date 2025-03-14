import LazyLoadingLayout from "@/components/lazy-loading-layout";
import { Suspense } from "react";
import TableInvoiceServerVietServer from "./components/table-invoice-server-vietserver";

function InvoiceServerVietServer() {
    return (
        <Suspense fallback={<LazyLoadingLayout />}>
            {/* <FilterTable /> */}

            <TableInvoiceServerVietServer />
        </Suspense>
    )
}

export default InvoiceServerVietServer;
