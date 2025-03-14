import Container from "@/components/container";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkPaginationUsers } from "@/stores/async-thunks/user-thunk";
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import FormUser from "./form-user";
import { setModal } from "@/stores/slices/modal-slice";
import { FaPlus } from "react-icons/fa6";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { BiSearch } from "react-icons/bi";
import { setTablePageIndex } from "@/stores/slices/table-slice";
import { useDebounce } from "@/hooks/useDebounce";

function FilterUsers() {
	const dispatch = useAppDispatch();
	const tableUsers = useAppSelector((state) => state.table["users"]);
    const { teams } = useAppSelector(state => state.teams);
	
    const [teamSelected, setTeamSelected] = useState<any>(null);
    const [searchUsers, setSearchUsers] = useState<any>("");

	const searchMatch = useDebounce(searchUsers, 500);

	useEffect(() => {
		const query: any = {};

		if (searchMatch !== undefined) {
			query.search = searchMatch;
		}

		if (teamSelected) {
			query.team = teamSelected;
		}

		if (tableUsers) {
			const cPageSize = tableUsers?.pageSize
				// eslint-disable-next-line no-unsafe-optional-chaining
				? [...tableUsers?.pageSize][0]
				: 10;
	
			query.pageIndex = tableUsers?.pageIndex || 1;
			query.pageSize = cPageSize;
	
			dispatch(asyncThunkPaginationUsers(query));
		}

		return () => {};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableUsers, teamSelected, searchMatch]);

	useEffect(() => {
		dispatch(asyncThunkGetAllYourTeam());

        return () => {}
    }, []);

	const handleOpenModalUser = () => {
        dispatch(
			setModal({
				isOpen: true,
				placement: 'right',
				title: 'Thêm nhân sự mới',
				body: <FormUser isEdit={false} />,
			})
		);
    };

	const onClear = () => {
		setSearchUsers("");
		dispatch(
			setTablePageIndex({ 
				tableId: "users",
				pageIndex: 1
			})
		)
	};

	return (
		<Container className="flex justify-between items-center">
			<Button
				variant="solid"
				color="primary"
				radius="sm"
				className="h-8 font-semibold"
				startContent={<FaPlus />}
				onPress={handleOpenModalUser}
			>
				Thêm mới
			</Button>

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
						onSelectionChange={setTeamSelected}
					>
						{(item) => (
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
							"bg-white text-black border data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary",
					}}
					placeholder="Tìm kiếm"
					startContent={<BiSearch className="text-black" />}
					value={searchUsers}
					onClear={onClear}
					onValueChange={setSearchUsers}
				/>
			</div>
		</Container>
	);
}

export default FilterUsers;
