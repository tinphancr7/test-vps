import FilterDns from "./components/filter-dns";
import TableDns from "./components/table-dns";

function CloudflareDns() {
	return (
		<div className="flex flex-col gap-3 mt-3">
			<FilterDns />

			<TableDns />
		</div>
	);
}

export default CloudflareDns;
