import Access from '@/components/Access/access';
import { ActionEnum, SubjectEnum } from '@/constants/enum';
import TableServerVng from './components/table-server-vng';
import FilterVngServer from './components/filter-vng-server';

function ServerVng() {
    return (
        <Access subject={SubjectEnum.SERVER} action={ActionEnum.READ}>
            <div className="flex flex-col gap-3">
                <FilterVngServer />
                <TableServerVng />
            </div>
        </Access>
    );
}

export default ServerVng;
