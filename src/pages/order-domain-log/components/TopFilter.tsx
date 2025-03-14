import ordersDomainStatusApis from '@/apis/order-domain-status-api';
import userApis from '@/apis/user-api';
import CustomMultiSelect from '@/components/form/custom-multi-select';
import CustomSelect from '@/components/form/custom-select';
import CustomTextField from '@/components/form/text-field';

import { useAppSelector } from '@/stores';

import { Button, Divider } from '@heroui/react';
import { useEffect, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { IoIosRefresh } from 'react-icons/io';

interface IProps {
    topFilter: any;
    onChangeTopFilter: (key: any, value: any) => void;
    onClearTopFilter?: () => void;
    onClickTopFilter: () => void;
}
const TopFilter = ({
    topFilter,
    onChangeTopFilter,
    onClearTopFilter,
    onClickTopFilter,
}: IProps) => {
    const [statuses, setStatuses] = useState([]);

    const { user } = useAppSelector((state) => state.auth);
    const loadOptionsData = async (searchQuery: string, _loadedOptions: any, { page }: any) => {
        const res = await userApis.getPaginationUsers({
            search: searchQuery,
            pageIndex: page,
            pageSize: 10,
        });
        const users = res?.data?.users.map((user: any) => ({
            label: user.username,
            value: user._id,
        }));
        return {
            options: users,
            hasMore: res?.data?.totalPages > page,
            additional: {
                page: searchQuery ? 1 : page + 1,
            },
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            // Fetch providers and teams in parallel
            const res = await ordersDomainStatusApis.getPagination({
                search: '',
                pageIndex: 1,
                pageSize: 100,
            });

            const statusData = res?.data?.orderStatuses?.map((item: any) => ({
                label: item.name,
                value: item._id,
            }));

            setStatuses(statusData);

            // const providerData = statusData?.data?.data?.data || [];

            // const teamData = userData?.data?.data?.result || [];

            // setProviders(providerData);
            // const userTeams = user?.team || [];

            // // Filter out teams that the user is not in
            // const teams =
            //     user?.role?.name?.toLowerCase() === 'leader'
            //         ? teamData.filter((team: any) => userTeams.includes(team._id))
            //         : teamData;

            // setTeams(teams);
        };

        fetchData();
    }, [user]);
    return (
        <>
            <div className="flex items-center w-full gap-10">
                <div className="w-1/3">
                    <label htmlFor="" className="inline-block pb-1">
                        Mã đơn hàng :
                    </label>
                    <CustomTextField
                        value={topFilter.order}
                        onChange={(e) => onChangeTopFilter('order', e.target.value)}
                        placeholder="Nhập dữ liệu "
                    />
                </div>
                <div className="w-1/3">
                    <label htmlFor="" className="inline-block pb-1">
                        Trạng thái :
                    </label>
                    <CustomSelect
                        selectedKeys={[topFilter.status]}
                        onChange={(e) => onChangeTopFilter('status', e.target.value)}
                        placeholder="--- Chọn ---"
                        items={statuses}
                    />
                </div>
                <div className="w-1/3">
                    <label htmlFor="" className="inline-block pb-1">
                        Tài khoản thao tác :
                    </label>
                    <CustomMultiSelect
                        value={topFilter.users}
                        onChange={(value: any) => onChangeTopFilter('users', value)}
                        placeholder="--- Chọn ---"
                        loadOptions={loadOptionsData}
                    />
                </div>
                <div className="flex items-center gap-4 mt-7 cursor-pointer">
                    <Button
                        startContent={<BiFilter size={20} />}
                        className="bg-primary text-white"
                        onPress={onClickTopFilter}
                    >
                        Lọc
                    </Button>
                    <div className="cursor-pointer" onClick={onClearTopFilter}>
                        <IoIosRefresh size={20} />
                    </div>
                </div>
            </div>
            <Divider className="my-4" />
        </>
    );
};

export default TopFilter;
