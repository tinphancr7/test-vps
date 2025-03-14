import Container from '@/components/container';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/stores';
import { asyncThunkGetAllYourTeam } from '@/stores/async-thunks/team-thunk';
import { asyncThunkGetAllBrands } from '@/stores/slices/brand-slice';
import { setModal } from '@/stores/slices/modal-slice';
import { asyncThunkGetPaginationOrdersDomainStatus, setSearch } from '@/stores/slices/orders-domain-status-slice';
import { setTablePageIndex } from '@/stores/slices/table-slice';
import { Button, Input } from '@heroui/react';
import { useEffect } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa6';
import FormOrderDomainStatus from './form-order-domain-status';

function FilterOrderDomainStatus() {
	const dispatch = useAppDispatch();
	const tableOrderDomainStatus = useAppSelector(
		(state) => state.table['ordersDomainStatus'],
	);
	const { search } = useAppSelector(
		(state) => state.ordersDomainStatus,
	);

	const searchMatch = useDebounce(search, 500);

	useEffect(() => {
		const query: any = {};

		if (searchMatch !== undefined) {
			query.search = searchMatch;
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

		return () => { };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableOrderDomainStatus, searchMatch]);

	useEffect(() => {
		dispatch(asyncThunkGetAllYourTeam());
		dispatch(asyncThunkGetAllBrands());

		return () => { };
	}, []);

	const onClear = () => {
		dispatch(setSearch(''));
		dispatch(
			setTablePageIndex({
				tableId: 'ordersDomainStatus',
				pageIndex: 1,
			}),
		);
	};

	const handleOpenModalOrderStatus = async () => {
		dispatch(
			setModal({
				isOpen: true,
				placement: 'right',
				title: 'Thêm trạng thái mới',
				body: <FormOrderDomainStatus orderId='' isEdit={false} />,
			})
		);
	};

	return (
		<Container className="flex justify-between items-center">
			<Button
				variant="solid"
				color="primary"
				radius="sm"
				className="h-8 font-semibold"
				startContent={<FaPlus />}
				onPress={handleOpenModalOrderStatus}
			>
				Thêm mới
			</Button>

			<div className="flex-1 flex items-center justify-end gap-3">
				{/* Filter By Name or Username */}
				<Input
					isClearable
					variant="bordered"
					radius="sm"
					className="max-w-xs"
					classNames={{
						inputWrapper:
							'bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary',
					}}
					placeholder="Tìm kiếm"
					startContent={<BiSearch className="text-black" />}
					value={search}
					onClear={onClear}
					onValueChange={(value) => dispatch(setSearch(value))}
				/>
			</div>
		</Container>
	);
}

export default FilterOrderDomainStatus;
