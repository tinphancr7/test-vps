import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import HeaderProvider from "./components/header-provider";
import TableProvider from "./components/table-provider";

function Provider() {
    return (
        <Access subject={SubjectEnum.OTHER_PROVIDER} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <HeaderProvider />

                <TableProvider />
            </div>
        </Access>
    )
}

export default Provider;