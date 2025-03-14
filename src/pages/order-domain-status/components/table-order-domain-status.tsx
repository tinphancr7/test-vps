import ActionsCell from '@/components/actions-cell';
import Container from '@/components/container';
import TableControl from '@/components/table-control';
import { resetModal, setModal } from '@/stores/slices/modal-slice';
import { useCallback, useMemo } from 'react';
import FormOrderDomain from './form-order-domain-status';
import { ActionEnum, SubjectEnum } from '@/constants/enum';
import { useAppDispatch, useAppSelector } from '@/stores';
import moment from 'moment';
import ordersDomainStatusApis from '@/apis/order-domain-status-api';
import { asyncThunkGetPaginationOrdersDomainStatus } from '@/stores/slices/orders-domain-status-slice';
import { Button, ModalFooter } from '@heroui/react';
import showToast from '@/utils/toast';

function TableOrderDomainStatus() {
    const dispatch = useAppDispatch();
    const { orderStatusesList, total, isLoading } = useAppSelector(
        (state) => state.ordersDomainStatus,
    );
    const tableOrderDomainStatus = useAppSelector((state) => state.table['ordersDomainStatus']);
    const { search } = useAppSelector((state) => state.ordersDomainStatus);
    const { permissions } = useAppSelector((state) => state.auth);

    const columns = [
        { _id: 'name', name: 'Tên trạng thái' },
        { _id: 'code', name: 'Mã trạng thái' },
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
                title: 'Cập nhật trạng thái',
                body: <FormOrderDomain orderId={order?._id} isEdit={true} />,
                maxWidth: "max-w-[40%]",
            }),
        );
    };
    
    const handleDeleteOrderStatus = async (status: any) => {
        try {
          const { data } = await ordersDomainStatusApis.delete(status?._id);
    
          if (data?.status === 1) {
            const query: any = {};
                            
            if (search !== undefined) {
                query.search = search;
            }
    
            if (tableOrderDomainStatus) {
                const cPageSize = tableOrderDomainStatus?.pageSize
                    ? // eslint-disable-next-line no-unsafe-optional-chaining
                    [...tableOrderDomainStatus?.pageSize][0]
                    : 10;
    
                query.pageIndex = tableOrderDomainStatus?.pageIndex || 1;
                query.pageSize = cPageSize;
    
                dispatch(asyncThunkGetPaginationOrdersDomainStatus(query));
            }

            showToast('Xóa trạng thái thành công', 'success');
            dispatch(resetModal());
          }
        } catch (error) {
          console.log("error: ", error);
          showToast('Xóa trạng thái thất bại', 'error');
        }
    };

    const onDelete = (status: any) => {
        dispatch(
          setModal({
            isOpen: true,
            placement: "default",
            title: `Xóa nhân sự`,
            body: <p>Bạn chắc chắn muốn xóa trạng thái "{status?.name}"</p>,
            footer: (
              <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
                <Button
                  variant="solid"
                  color="danger"
                  className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                  onPress={() => dispatch(resetModal())}>
                  Hủy
                </Button>
    
                <Button
                  variant="solid"
                  className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                  onPress={() => handleDeleteOrderStatus(status)}>
                  Xác nhận
                </Button>
              </ModalFooter>
            ),
          })
        );
      };

    const renderCell = useCallback(
        (item: any, columnKey: string) => {
            const cellValue = item[columnKey];

            switch (columnKey) {
                case "createdAt":
                    return (
                        <p className="text-bold text-black">
                            {moment(cellValue).format("DD/MM/YYYY HH:mm")}
                        </p>
                    );

                case "actions":
                    return (
                        <ActionsCell
                            onUpdate={() => onUpdate(item)}
                            onDelete={() => onDelete(item)}
                            disableUpdate={isAccessRoleUpdate ? false : true}
                            disableDelete={isAccessRoleDelete ? false : true}
                        />
                    );

                default:
                    return cellValue;
            }
        },
        [isAccessRoleUpdate, isAccessRoleDelete, tableOrderDomainStatus],
    );

    return (
        <Container>
            <TableControl
                tableId={'ordersDomainStatus'}
                columns={columns}
                data={orderStatusesList}
                total={total}
                isLoading={isLoading}
                renderCell={renderCell}
            />
        </Container>
    );
}

export default TableOrderDomainStatus;
