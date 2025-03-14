import ActionsCell from '@/components/actions-cell';
import Container from '@/components/container';
import TableControl from '@/components/table-control';
import { setModal } from '@/stores/slices/modal-slice';
import { useCallback, useMemo } from 'react';
import { ActionEnum, SubjectEnum } from '@/constants/enum';
import { useAppDispatch, useAppSelector } from '@/stores';
import moment from 'moment';
import { IoIosEye } from 'react-icons/io';
import FormDomain from './form-domain';
import { Chip, Snippet } from '@heroui/react';
import { bgColorStatusDomain } from '@/utils/domain';
import { STATUSES_DOMAIN } from '@/constants/domain';

function TableDomains() {
    const dispatch = useAppDispatch();
    const { domainsList, total, isLoading } = useAppSelector(
        (state) => state.domains,
    );
    const { permissions } = useAppSelector((state) => state.auth);

    const columns = [
        { _id: 'name', name: 'Tên domain', className: 'text-left' },
        { _id: 'nameServers', name: 'NameServers' },
        { _id: 'provider', name: 'Nhà cung cấp' },
        { _id: 'brand', name: 'Thương hiệu' },
        { _id: 'team', name: 'Team' },
        { _id: 'createdBy', name: 'Người tạo' },
        { _id: 'manager', name: 'Người quản lý' },
        { _id: 'status', name: 'Trạng thái' },
        { _id: 'createdAt', name: 'Ngày tạo' },
        { _id: 'expireDate', name: 'Ngày hết hạn' },
        { _id: 'actions', name: 'Hành động' },
    ];

    const accessRole = useMemo(() => {
        const accessRoles = permissions?.map((item: any) => ({
            subject: item.subject,
            action: item.action,
        }));

        return accessRoles?.find(
            (it: any) =>
                it.subject === SubjectEnum.DOMAIN ||
                it.subject === SubjectEnum.ALL,
        );
    }, [permissions]);

    const isAccessRoleUpdate = useMemo(
        () =>
            accessRole?.action?.find(
                (item: any) => item === ActionEnum.UPDATE || item === ActionEnum.MANAGE,
            ),
        [accessRole],
    );

    const isAccessRoleDelete = useMemo(
        () =>
            accessRole?.action?.find(
                (item: any) => item === ActionEnum.DELETE || item === ActionEnum.MANAGE,
            ),
        [accessRole],
    );

    const onUpdate = (order: any) => {
        dispatch(
            setModal({
                isOpen: true,
                placement: 'right',
                title: 'Thông tin domain',
                body: <FormDomain isEdit={true} domainId={order?._id} />,
                maxWidth: "max-w-[50%]",
            }),
        );
    };

    const onRead = (order: any) => {
        dispatch(
            setModal({
              isOpen: true,
              placement: "right",
              title: "Thông tin domain",
              body: <FormDomain isEdit={false} domainId={order?._id} />,
              maxWidth: "max-w-[50%]",
            })
        );
    }; 

    const renderCell = useCallback(
        (item: any, columnKey: string, index: number) => {
            const cellValue = item[columnKey];
            const addNewActions = [
                {
                    order: 1,
                    label: "Xem",
                    icon: IoIosEye,
                    bgColor: "bg-warning",
                    isDisabled: false,
                    onPress: () => {
                        onRead(item);
                    },
                },
            ];

            switch (columnKey) {
                case "name":
                    return (
                        <div className='flex justify-start'>
                            <Snippet
                                color={index % 2 === 0 ? 'danger' : 'primary'}
                                size='sm'
                                classNames={{
                                    pre: 'font-bold tracking-wider text-base'
                                }}
                            >
                                {cellValue}
                            </Snippet>
                        </div>
                    );

                case "team":
                case "brand":
                case "createdBy":
                    return cellValue?.name;

                case "provider":
                    return (
                        <span className='text-base font-medium uppercase tracking-wide'>{cellValue?.name}</span>
                    );
                
                case "manager":
                    return cellValue?.map((user: any) => user?.name)?.join(', ');

                case "nameServers":
                    if (!cellValue?.length) {
                        return <></>
                    }

                    return (
                        <div className='flex flex-col gap-1'>
                            {cellValue?.map((it: any, index: number) => (
                                <Chip 
                                    key={index} 
                                    color={!index ? 'danger' : 'secondary'}    
                                    size='sm'
                                    radius='sm'
                                    classNames={{
                                        content: 'tracking-wide font-medium text-base'
                                    }}
                                >
                                    {it}
                                </Chip>
                            ))}
                        </div>
                    );
                
                case "status":
                    // eslint-disable-next-line no-case-declarations
                    const status = STATUSES_DOMAIN?.find((item) => item.value === cellValue) as any;
            
                    return (
                        <Chip
                            variant="solid"
                            radius="sm"
                            classNames={{
                                base: `${bgColorStatusDomain(status?.value)} text-white`,
                                content: 'font-medium tracking-wider text-sm uppercase'
                            }}
                        >
                            {status?.label || "(Trống)"}
                        </Chip>
                    );

                case "createdAt":
                    return (
                        <p className="text-bold text-black">
                            {moment(cellValue).format("DD/MM/YYYY HH:mm")}
                        </p>
                    );

                case "expireDate":
                    return (
                        <p className="text-bold text-black">
                            {moment(cellValue).format("DD/MM/YYYY")}
                        </p>
                    );

                case "actions":
                    return (
                        <ActionsCell
                            actionsAdd={addNewActions}
                            onUpdate={() => onUpdate(item)}
                            disableUpdate={isAccessRoleUpdate ? false : true}
                            disableDelete={isAccessRoleDelete ? false : true}
                        />
                    );

                default:
                    return cellValue;
            }
        },
        [isAccessRoleUpdate, isAccessRoleDelete],
    );

    return (
        <Container>
            <TableControl
                tableId={'domains'}
                columns={columns}
                data={domainsList}
                total={total}
                isLoading={isLoading}
                renderCell={renderCell}
            />
        </Container>
    );
}

export default TableDomains;