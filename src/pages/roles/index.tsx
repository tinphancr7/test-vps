import Access from "@/components/Access/access";
import FilterRoles from "./components/filter-roles";
import RolesList from "./components/roles-list";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function Roles() {
    return (  
		<Access subject={SubjectEnum.ROLE} action={ActionEnum.READ}>
            <div className="my-3">
                {/* Fitler Users */}
                <FilterRoles />

                {/* Roles */}
                <RolesList />
            </div>
        </Access>
    );
}

export default Roles;