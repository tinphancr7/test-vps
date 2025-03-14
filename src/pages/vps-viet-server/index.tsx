import {ActionEnum, SubjectEnum} from "@/constants/enum";

import Access from "@/components/Access/access";
import FilterVpsVietServer from "./components/filter-vps-vietserver";
import TableVpsVietServer from "./components/table-vps-vietserver";

function VpsVietServer() {
	return (
		<Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
			<div className="flex flex-col gap-3">
				<FilterVpsVietServer />

				<TableVpsVietServer />
			</div>
		</Access>
	);
}

export default VpsVietServer;
