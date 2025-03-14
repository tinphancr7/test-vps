import { useAppDispatch, useAppSelector } from '@/stores';
import { resetModal } from '@/stores/slices/modal-slice';
import { Button, CircularProgress, Input, ModalFooter } from '@heroui/react';
import { useEffect, useState } from 'react';
import showToast from '@/utils/toast';
import ordersDomainStatusApis from '@/apis/order-domain-status-api';
import useForm from '@/hooks/use-form';
import { asyncThunkGetPaginationOrdersDomainStatus } from '@/stores/slices/orders-domain-status-slice';

function FormOrderDomainStatus({ orderId, isEdit }: { orderId: string; isEdit?: boolean }) {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const tableOrderDomain = useAppSelector((state) => state.table['ordersDomainStatus']);
    const { search } = useAppSelector((state) => state.ordersDomainStatus);
    const { form, isEmptyValues, getValue, getState, setValue, validateForm } = useForm({
        name: {
            label: 'Tên trạng thái',
            value: '',
            isRequire: true,
            placeholder: 'Nhập tên trạng thái...',
        },
        code: {
            label: 'Mã trạng thái',
            value: '',
            isRequire: true,
            placeholder: 'Nhập mã trạng thái...',
        },
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const { data } = await ordersDomainStatusApis.getById(orderId);

            if (data?.status === 1) {
                setValue('name', data?.orderStatus?.name);
                setValue('code', data?.orderStatus?.code);
            }
        } catch (error: any) {
            console.log('error: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isEdit && orderId) {
            fetchData();
        }
    }, [orderId]);

    const handleValueChange = (key: string, value: any) => {
        setValue(key, value);
    };

    const onSubmit = async () => {
        if (isEmptyValues) {
            return validateForm();
        }

        try {
            setIsSubmitting(true);

            const payload = {
                name: getValue('name')?.trim(),
                code: getValue('code')?.trim(),
            };
            
            const { data } = isEdit ? await ordersDomainStatusApis.update(orderId, payload) : await ordersDomainStatusApis.create(payload);

            if (data?.status === 1) {
                const query: any = {};
                
                if (search !== undefined) {
                    query.search = search;
                }
        
                if (tableOrderDomain) {
                    const cPageSize = tableOrderDomain?.pageSize
                        ? // eslint-disable-next-line no-unsafe-optional-chaining
                        [...tableOrderDomain?.pageSize][0]
                        : 10;
        
                    query.pageIndex = tableOrderDomain?.pageIndex || 1;
                    query.pageSize = cPageSize;
        
                    dispatch(asyncThunkGetPaginationOrdersDomainStatus(query));
                }

                showToast(`${isEdit ? 'Cập nhật' : 'Thêm'} trạng thái thành công`, 'success');
                dispatch(resetModal());
            }
        } catch (error) {
            console.log('error: ', error);
            showToast(`${isEdit ? 'Cập nhật' : 'Thêm'} trạng thái thất bại`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        <div className="h-64 flex items-center justify-center">
            <CircularProgress size="lg" color="primary" />
        </div>;
    }

    return (
        <div className="h-full flex flex-col items-stretch">
            <div className="grow flex flex-col gap-4">
                {Object.keys(form).map((key, index) => (
                    <Input
                        key={index}
                        radius="sm"
                        color="primary"
                        variant="bordered"
                        labelPlacement="outside"
                        classNames={{
                            inputWrapper:
                                'h-12 data-[hover=true]:border-primary border border-slate-400',
                            label: 'text-dark font-medium',
                        }}
                        type={getState(key).type}
                        label={getState(key).label}
                        placeholder={getState(key).placeholder}
                        value={getState(key).value}
                        onValueChange={(value) => handleValueChange(key, value)}
                        errorMessage={getState(key).errorMessage}
                        isInvalid={!!getState(key).errorMessage}
                        onKeyDown={(event) => event.key === 'Enter' && onSubmit()}
                    />
                ))}
            </div>

            <ModalFooter className="px-2 sticky bottom-0 border-t gap-4 bg-white mt-5">
                <Button
                    variant="solid"
                    color="default"
                    className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                    onPress={() => dispatch(resetModal())}
                >
                    Đóng
                </Button>

                <Button
                    variant="solid"
                    className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                    isLoading={isSubmitting}
                    onPress={onSubmit}
                >
                    Xác nhận
                </Button>
            </ModalFooter>
        </div>
    );
}

export default FormOrderDomainStatus;
