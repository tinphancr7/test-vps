import TableInvoiceDigitalOcean from "./components/TableInvoiceDigitalOcean";
import TopFilter from "./components/TopFilter";

function InvoicesDigitalOcean() {
    return (
        <div>
            <TopFilter
            // topFilter={topFilter}
            // onChangeTopFilter={handleChangeTopFilter}
            // onClearTopFilter={handleClearTopFilter}
            // onClickTopFilter={handleClickTopFilter}
            />
            <TableInvoiceDigitalOcean />
        </div>
    );
}

export default InvoicesDigitalOcean;
