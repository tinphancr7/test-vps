import ActionsCell from '@/components/actions-cell';
import Container from '@/components/container';
import TableControl from '@/components/table-control';
import { setModal } from '@/stores/slices/modal-slice';
import { useCallback, useMemo } from 'react';
import FormOrderDomain from './form-order-domain';
import { ActionEnum, SubjectEnum } from '@/constants/enum';
import { useAppDispatch, useAppSelector } from '@/stores';
import moment from 'moment';
import { StatusOrderDomainEnum } from './enums';
import { Chip } from '@heroui/react';
import { IoIosEye } from 'react-icons/io';

function TableOrderDomain() {
    const dispatch = useAppDispatch();
    const { ordersList, total, isLoading } = useAppSelector(
        (state) => state.ordersDomain,
    );
    const { permissions } = useAppSelector((state) => state.auth);

    const columns = [
        { _id: 'name', name: 'Tên đơn hàng', className: 'text-left' },
        { _id: 'code', name: 'Mã đơn hàng' },
        { _id: 'status', name: 'Trạng thái' },
        { _id: 'team', name: 'Team' },
        { _id: 'brand', name: 'Thương hiệu' },
        { _id: 'total', name: 'Tổng tiền đặt hàng' },
        { _id: 'createdBy', name: 'Người tạo' },
        { _id: 'createdAt', name: 'Ngày tạo' },
        { _id: 'actions', name: 'Hành động' },
    ];

    const accessRole = useMemo(() => {
        const accessRoles = permissions?.map((item: any) => ({
            subject: item.subject,
            action: item.action,
        }));

        return accessRoles?.find(
            (it: any) =>
                it.subject === SubjectEnum.ORDER_DOMAIN ||
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

    const colorStatus = (status: StatusOrderDomainEnum) => {
        switch (status) {
            case StatusOrderDomainEnum.ORDER_STATUS_DONE:
                return 'success';

            case StatusOrderDomainEnum.ORDER_STATUS_CANCEL:
            case StatusOrderDomainEnum.UN_SUCCESS:
                return 'danger';

            case StatusOrderDomainEnum.ORDER_STATUS_CREATE:
                return 'warning'

            case StatusOrderDomainEnum.ORDER_STATUS_SEO_CREATE:
                return 'secondary'

            default:
                return 'default';
        }
    };

    const onUpdate = (order: any) => {
        dispatch(
            setModal({
                isOpen: true,
                placement: 'right',
                title: 'Thông tin đơn hàng',
                body: <FormOrderDomain isEdit={true} orderId={order?._id} />,
                maxWidth: "max-w-[50%]",
            }),
        );
    };

    const onRead = (order: any) => {
        dispatch(
            setModal({
              isOpen: true,
              placement: "right",
              title: "Thông tin đơn hàng",
              body: <FormOrderDomain isEdit={false} orderId={order?._id} />,
              maxWidth: "max-w-[50%]",
            })
        );
    }; 

    const renderCell = useCallback(
        (item: any, columnKey: string) => {
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
                case "total":
                    return (
                        <p className="tracking-wider text-base font-medium">
                            {cellValue?.toFixed(2) || "0.00"} $
                        </p>
                    );

                case "team":
                case "brand":
                case "createdBy":
                    return cellValue?.name;

                case "status":
                    return (
                            <Chip
                                radius="sm"
                                color={colorStatus(cellValue?.code)}
                                variant="flat"
                                classNames={{
                                    base: "h-auto",
                                    content:
                                        "font-semibold tracking-wider py-1",
                                }}
                            >
                                {cellValue?.name}
                            </Chip>
                    );

                case "createdAt":
                    return (
                        <p className="text-bold text-black">
                            {moment(cellValue).format("DD/MM/YYYY HH:mm")}
                        </p>
                    );

                case "actions":
                    // eslint-disable-next-line no-case-declarations
                    const isDisabledUpdate = ![
                        StatusOrderDomainEnum.ORDER_STATUS_CANCEL,
                        StatusOrderDomainEnum.ORDER_STATUS_DONE,
                    ].includes(item?.status.code) && isAccessRoleUpdate ? false: true;

                    return (
                        <ActionsCell
                            actionsAdd={addNewActions}
                            onUpdate={() => onUpdate(item)}
                            disableUpdate={isDisabledUpdate}
                            disableDelete={true}
                        />
                    );

                default:
                    return cellValue;
            }
        },
        [isAccessRoleUpdate],
    );

    return (
        <Container>
            <TableControl
                tableId={'ordersDomain'}
                columns={columns}
                data={ordersList}
                total={total}
                isLoading={isLoading}
                renderCell={renderCell}
            />
        </Container>
    );
}

export default TableOrderDomain;