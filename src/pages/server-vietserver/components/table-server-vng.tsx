import invoiceApi from '@/apis/invoice.api';
import serverVietServerApis from '@/apis/server-vietserver-api';
import ActionsCell from '@/components/actions-cell';
import Container from '@/components/container';
import TableControl from '@/components/table-control';
import { useAppDispatch, useAppSelector } from '@/stores';
import { asyncThunkPaginationServerVietServer } from '@/stores/async-thunks/server-vietserver-thunk';
import { formatPrice } from '@/utils/format-price';
import showToast from '@/utils/toast';
import { convertVnToUsd } from '@/utils/vn-to-usd';
import { Button, Spinner, Tooltip } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { FaCheck, FaFileInvoiceDollar, FaRegCopy } from 'react-icons/fa6';
import { RiCloseLine } from 'react-icons/ri';

function TableServerVng() {
    const dispatch = useAppDispatch();
    const { serverList, total, isLoading } = useAppSelector((state) => state.serverVietServer);
    const tableServerVng = useAppSelector((state) => state.table['server_vietserver']);
    const [cPw, setCPw] = useState<any>({});

    const columns = [
        { _id: 'config', name: 'Service' },
        { _id: 'main', name: 'Main' },
        { _id: 'cpu', name: 'Cpu' },
        { _id: 'team', name: 'Team' },
        { _id: 'additionalRam', name: 'Ram' },
        { _id: 'ssd', name: 'SSD' },
        { _id: 'hdd', name: 'HDD' },
        { _id: 'bandwidth', name: 'Băng thông' },
        { _id: 'ip', name: 'ip' },
        { _id: 'username', name: 'username' },
        { _id: 'password', name: 'Password' },
        { _id: 'backup', name: 'Backup' },
        { _id: 'premiumSupport', name: 'Premium - SP' },
        { _id: 'price', name: 'Price' },
        { _id: 'actions', name: 'Hành động' },
    ];

    useEffect(() => {
        const query: any = {};

        if (tableServerVng) {
            const cPageSize = tableServerVng?.pageSize
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                  [...tableServerVng?.pageSize][0]
                : 10;

            query.pageIndex = tableServerVng?.pageIndex || 1;
            query.pageSize = cPageSize;

            dispatch(asyncThunkPaginationServerVietServer(query));
        }

        return () => {};
    }, [dispatch, tableServerVng]);

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
    };

    const handleCopyPw = useCallback(
        async (id: string) => {
            if (cPw && cPw?._id === id) {
                navigator.clipboard.writeText(cPw?.password);

                return showToast('Đã sao chép mật khẩu', 'success');
            }

            try {
                const { data } = await serverVietServerApis.getPwServer(id as string);

                if (data?.status === 1) {
                    if (!data?.data) {
                        showToast('Chưa đặt mật khẩu cho server', 'info');
                    } else {
                        showToast('Đã sao chép mật khẩu', 'success');
                        setCPw({
                            _id: id,
                            password: data?.data,
                        });

                        navigator.clipboard.writeText(data?.data);
                    }
                }
            } catch (error: any) {
                console.log('error: ', error);
                if (error?.response?.data?.status === 37) {
                    showToast('Bạn chỉ có thể lấy mật khẩu một lần!', 'error');
                    return;
                } else if (error?.response?.data?.status === 47) {
                    showToast('VPS này đang có người sử dụng, thử lại sau 1 tiếng!', 'error');
                    return;
                }
                showToast('Sao chép mật khẩu thất bại', 'error');
            }
        },
        [cPw],
    );

    const onCreateInvoice = async (item: any) => {
        try {
            const { data } = await invoiceApi.createInvoiceServer(item?._id);

            if (data?.status === 1) {
                showToast('Tạo hóa đơn thành công!', 'success');
            }
        } catch (error: any) {
            console.log('error: ', error);

            if (error?.response?.data?.status === 409) {
                showToast('Hóa đơn đã được tạo!', 'error');
            } else {
                showToast('Tạo hóa đơn thất bại!', 'error');
            }
        }
    };

    const renderCell = useCallback(
        (item: any, columnKey: string) => {
            const cellValue = item[columnKey];

            const addNewActions = [
                {
                    order: 1,
                    label: 'Tạo hóa đơn',
                    icon: FaFileInvoiceDollar,
                    bgColor: 'bg-warning',
                    isDisabled: false,
                    onPress: () => {
                        onCreateInvoice(item);
                    },
                },
            ];

            switch (columnKey) {
                case 'config':
                    return <p className="font-semibold tracking-wider">{cellValue}</p>;
                case 'main':
                    return (
                        <p className="font-semibold tracking-wider">
                            {item['configure']?.main ?? '(Trống)'}
                        </p>
                    );
                case 'team':
                    return (
                        <p className="font-semibold tracking-wider">
                            {item['team']?.name ?? '(Trống)'}
                        </p>
                    );
                case 'cpu':
                    return (
                        <p className="font-semibold tracking-wider">
                            {item['configure']?.cpu ?? '(Trống)'}
                        </p>
                    );
                case 'additionalRam':
                    return (
                        <p className="font-semibold tracking-wider">
                            {item['additionalRam']
                                ? `${item['additionalRam'].quantity ?? 1} * ${
                                      item['additionalRam']?.ramType
                                  }`
                                : '(Trống)'}
                        </p>
                    );
                case 'ssd':
                    return (
                        <p className="font-semibold tracking-wider">
                            {item['configure']?.ssd ?? '(Trống)'}
                        </p>
                    );
                case 'hdd':
                    return (
                        <p className="font-semibold tracking-wider">
                            {item['configure']?.hdd ?? '(Trống)'}
                        </p>
                    );
                case 'bandwidth':
                    return (
                        <p className="font-semibold tracking-wider">
                            {item['configure']?.bandwidth ?? '(Trống)'}
                        </p>
                    );

                case 'price':
                    return (
                        <p className="font-medium tracking-wider min-w-max">
                            {formatPrice(convertVnToUsd(cellValue * 1.1, 'VNG')) || ''} $
                        </p>
                    );

                case 'dataCenter':
                    return <p className="font-medium tracking-wider">{cellValue}</p>;

                case 'backup':
                    return <p className="text-center tracking-wide">{cellValue || 'Không'}</p>;

                case 'premiumSupport':
                    return (
                        <div className="flex justify-center items-center">
                            {cellValue ? (
                                <FaCheck className="w-5 h-5 text-success" />
                            ) : (
                                <RiCloseLine className="w-5 h-5 text-danger" />
                            )}
                        </div>
                    );

                case 'ip':
                    if (!cellValue) {
                        return <Spinner size="sm" aria-label="Loading..." />;
                    }

                    return (
                        <Tooltip
                            radius="sm"
                            content={
                                <div className="flex items-center gap-1 text-xs">
                                    <FaRegCopy />
                                    Sao chép
                                </div>
                            }
                        >
                            <Button
                                variant="flat"
                                color="primary"
                                className="h-8 px-1 rounded-md text-dark data-[hover=true]:outline-primary data-[hover=true]:outline-1 tracking-wider"
                                onPress={() => handleCopy(cellValue)}
                            >
                                {cellValue}
                            </Button>
                        </Tooltip>
                    );

                case 'password':
                    return (
                        <Tooltip
                            showArrow
                            color="primary"
                            content={
                                <div className="flex flex-col">
                                    <b className="text-center">Sao chép</b>
                                    <span>************</span>
                                </div>
                            }
                        >
                            <Button
                                className="col-span-2 bg-transparent data-[hover=true]:bg-primary/50 rounded-sm min-h-max py-1 h-max w-max justify-start font-medium tracking-wide"
                                onPress={() => handleCopyPw(item['_id'])}
                            >
                                ************
                            </Button>
                        </Tooltip>
                    );

                case 'actions':
                    return (
                        <ActionsCell
                            disableDelete={true}
                            disableUpdate={true}
                            actionsAdd={addNewActions}
                        />
                    );

                default:
                    if (!cellValue && cellValue !== 0) {
                        return <Spinner size="sm" aria-label="Loading..." />;
                    }

                    return <p className="text-center tracking-wide">{cellValue}</p>;
            }
        },
        [handleCopyPw],
    );

    return (
        <Container>
            <TableControl
                tableId={'server_vietserver'}
                columns={columns}
                data={serverList}
                total={total}
                isLoading={isLoading}
                renderCell={renderCell}
                selectionMode="multiple"
            />
        </Container>
    );
}

export default TableServerVng;
