import Container from "@/components/container";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkPaginationFingerPrints } from "@/stores/async-thunks/fingerprint-thunk";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";

import { asyncThunkGetAllUsers } from "@/stores/async-thunks/user-thunk";

function FilterFingerPrints() {
  const dispatch = useAppDispatch();
  const tablefingerPrints = useAppSelector(
    (state) => state.table["fingerprints"]
  );
  const { users } = useAppSelector((state) => state.users);

  const [userSelected, setUserSelecteds] = useState<any>(null);

  useEffect(() => {
    const query: any = {};

    if (userSelected) {
      query.user = userSelected;
    }

    if (tablefingerPrints) {
      const cPageSize = tablefingerPrints?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tablefingerPrints?.pageSize][0]
        : 10;

      query.pageIndex = tablefingerPrints?.pageIndex || 1;
      query.pageSize = cPageSize;

      dispatch(asyncThunkPaginationFingerPrints(query));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tablefingerPrints, userSelected]);

  useEffect(() => {
    dispatch(asyncThunkGetAllUsers());

    return () => {};
  }, []);

  return (
    <Container className="flex justify-between items-center">
      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="max-w-52">
          <Autocomplete
            defaultItems={users}
            placeholder="Người dùng..."
            radius="sm"
            variant="bordered"
            inputProps={initPropsAutoComplete}
            classNames={classNamesAutoComplete}
            selectedKey={userSelected}
            onSelectionChange={setUserSelecteds}>
            {(item) => (
              <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </div>
    </Container>
  );
}

export default FilterFingerPrints;
