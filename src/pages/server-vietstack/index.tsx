import Access from '@/components/Access/access';
import { ActionEnum, SubjectEnum } from '@/constants/enum';
import TableServerVietStack from './components/table-server-vietstack';
import FilterVietStackServer from './components/filter-vietstack-server';

function ServerVietStack() {
    return (
        <Access subject={SubjectEnum.SERVER} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <FilterVietStackServer />
                <TableServerVietStack />
            </div>
        </Access>
    );
}

export default ServerVietStack;
