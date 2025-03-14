import Access from "@/components/Access/access";
import FilterUsers from "./components/filter-users";
import TableUsers from "./components/table-user";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function Users() {
	return (
		<Access subject={SubjectEnum.USER} action={ActionEnum.READ}>
			<div className="flex flex-col gap-3 mt-3">
				{/* Header: Filter Users */}
				<FilterUsers />

				{/* Table Users */}
				<TableUsers />
			</div>
		</Access>
	);
}

export default Users;
