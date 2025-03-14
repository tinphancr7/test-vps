import Container from '@/components/container';

import { useAppSelector } from '@/stores';

import { Button } from '@heroui/react';
import { useMemo, useState } from 'react';

import { SubjectEnum } from '@/constants/enum';
import ModalAssignedUserToServer from './modal-assigned-user-to-server';

function FilterVngServer() {
    const tableVpsBuCloud = useAppSelector((state) => state.table['server_vng']);
    const dis = useMemo(() => {
        const listSelectedKey = tableVpsBuCloud?.selectedKeys;
        if (listSelectedKey) {
            const a = [...listSelectedKey];
            if (a.length > 0) {
                return false;
            }
            return true;
        }
    }, [tableVpsBuCloud]);
    const { permissions, user } = useAppSelector((state) => state.auth);
    const isAdmin = useMemo(() => {
        if (!permissions?.length) return false;

        const hasPermission = permissions.some((item: any) => item.subject === SubjectEnum.ALL);

        return hasPermission;
    }, [permissions]);
    const [isOpenModalAssignedUser, setIsOpenModalAssignedUser] = useState(false);
    const handleAssingedUser = () => {
        setIsOpenModalAssignedUser(true);
    };

    const isLeader = useMemo(() => {
        if (user?.role?.name?.toLowerCase() === 'leader') {
            return true;
        }

        return false;
    }, [user]);
    return (
        <Container className="grid lg:grid-cols-12 grid-cols-2 gap-2">
            <div className="grid col-span-12">
                <div className=" grid grid-cols-1 gap-2">
                    {(isAdmin || isLeader) && (
                        <div className="col-start-3 col-end-5">
                            <Button
                                variant="solid"
                                color="primary"
                                className="bg-blue-500 rounded-md w-full text-white font-bold text-sm items-center"
                                onPress={() => {
                                    handleAssingedUser();
                                }}
                                isDisabled={dis}
                            >
                                Phân quyền người quản lý
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ModalAssignedUserToServer
                isOpen={isOpenModalAssignedUser}
                onOpenChange={setIsOpenModalAssignedUser}
            />
        </Container>
    );
}

export default FilterVngServer;
