import Container from '@/components/container';
import { classNamesAutoComplete, initPropsAutoComplete } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/stores';
import { asyncThunkGetAllYourTeam } from '@/stores/async-thunks/team-thunk';
import { asyncThunkGetAllBrands } from '@/stores/slices/brand-slice';
import { asyncThunkGetPaginationOrdersDomain } from '@/stores/slices/orders-domain-slice';
import { setTablePageIndex } from '@/stores/slices/table-slice';
import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { useEffect } from 'react';
import { BiSearch } from 'react-icons/bi';
import {
	setTeamSelected,
	setBrandSelected,
	setSearchByCode,
} from '@/stores/slices/orders-domain-slice';

function FilterOrderDomain() {
	const dispatch = useAppDispatch();
	const tableOrderDomain = useAppSelector(
		(state) => state.table['ordersDomain'],
	);
	const { brands } = useAppSelector((state) => state.brand);
	const { teams } = useAppSelector((state) => state.teams);
	const { teamSelected, brandSelected, searchByCode } = useAppSelector(
		(state) => state.ordersDomain,
	);

	const searchMatch = useDebounce(searchByCode, 500);

	useEffect(() => {
		const query: any = {};

		if (searchMatch !== undefined) {
			query.search = searchMatch;
		}

		if (teamSelected) {
			query.team = teamSelected;
		}

		if (brandSelected) {
			query.brand = brandSelected;
		}

		if (tableOrderDomain) {
			const cPageSize = tableOrderDomain?.pageSize
				? // eslint-disable-next-line no-unsafe-optional-chaining
				[...tableOrderDomain?.pageSize][0]
				: 10;

			query.pageIndex = tableOrderDomain?.pageIndex || 1;
			query.pageSize = cPageSize;

			dispatch(asyncThunkGetPaginationOrdersDomain(query));
		}

		return () => { };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableOrderDomain, teamSelected, brandSelected, searchMatch]);

	useEffect(() => {
		dispatch(asyncThunkGetAllYourTeam());
		dispatch(asyncThunkGetAllBrands());

		return () => { };
	}, []);

	const onClear = () => {
		dispatch(setSearchByCode(''));
		dispatch(
			setTablePageIndex({
				tableId: 'ordersDomain',
				pageIndex: 1,
			}),
		);
	};

	return (
		<Container className="flex justify-between items-center">
			<div className="flex-1 flex items-center justify-end gap-3">
				{/* Filter By Team */}
				<div className="max-w-52">
					<Autocomplete
						defaultItems={teams}
						placeholder="Team"
						radius="sm"
						variant="bordered"
						inputProps={initPropsAutoComplete}
						classNames={classNamesAutoComplete}
						selectedKey={teamSelected}
						onSelectionChange={(value) => dispatch(setTeamSelected(value))}
					>
						{(item) => (
							<AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
						)}
					</Autocomplete>
				</div>

				<div className="max-w-52">
					<Autocomplete
						defaultItems={brands}
						placeholder="Thương hiệu"
						radius="sm"
						variant="bordered"
						inputProps={initPropsAutoComplete}
						classNames={classNamesAutoComplete}
						selectedKey={brandSelected}
						onSelectionChange={(value) => dispatch(setBrandSelected(value))}
					>
						{(item: any) => (
							<AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
						)}
					</Autocomplete>
				</div>

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
					value={searchByCode}
					onClear={onClear}
					onValueChange={(value) => dispatch(setSearchByCode(value))}
				/>
			</div>
		</Container>
	);
}

export default FilterOrderDomain;
