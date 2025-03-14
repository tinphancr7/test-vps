import Access from "@/components/Access/access";

import {ActionEnum, SubjectEnum} from "@/constants/enum";

import TableVpsScaleWay from "./components/table-vps-scaleway";
import FilterScaleWay from "./components/filter-vps-scaleway";

function ManagementScaleWay() {
	return (
		<Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
			<div className="flex flex-col gap-3">
				<FilterScaleWay />

				<TableVpsScaleWay />
			</div>
		</Access>
	);
}

export default ManagementScaleWay;
