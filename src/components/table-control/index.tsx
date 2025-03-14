// import useSetMaxHeight from "@/hooks/use-set-max-height";
import { ColumnField } from "@/interfaces/column-field";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
  Spinner,
  Table as TableNextUI,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Select,
  SelectItem,
  Pagination,
} from "@heroui/react";
import { useEffect, useMemo } from "react";
import {
  setTablePageIndex,
  setTablePageSize,
  setTableSelectedKeys,
  initializeTableState,
  setSortDescriptor,
} from "@/stores/slices/table-slice";
import { TableProps } from "@/interfaces/table-props";

function TableControl({
  tableId = "",
  data = [],
  total = 0,
  columns = [],
  renderCell,
  isLoading = false,
  selectionMode = "none", //multiple or single
}: TableProps) {
  const dispatch = useAppDispatch();
  const tableState = useAppSelector((state) => state.table[tableId]);

  useEffect(() => {
    dispatch(initializeTableState({ tableId }));
  }, [tableId, dispatch]);

  const handlePageChange = (pageIndex: string | number) => {
    dispatch(setTablePageIndex({ tableId, pageIndex }));
  };

  const handlePageSizeChange = (pageSize: any) => {
    dispatch(setTablePageSize({ tableId, pageSize }));
  };

  const handleSelectionChange = (selectedKeys: any) => {
    let value = selectedKeys;
    
    if (selectedKeys && [...selectedKeys].join("") === "all") {
      value = data?.map((it) => it?._id);
    }

    dispatch(setTableSelectedKeys({ tableId, selectedKeys: new Set(value) }));
  };

  const handleSortChange = (sortDescriptor: any) => {
    dispatch(setSortDescriptor({ tableId, sortDescriptor }));
  };

  const bottomContent = useMemo(() => {
    if (!total) return;

    const totalPages =
      !tableState?.pageSize || !total
        ? 0
        : Math.ceil(
          // eslint-disable-next-line no-unsafe-optional-chaining
          total / Number([...tableState?.pageSize][0])
        );

    const options = [
      { label: "10", value: "10" },
      { label: "20", value: "20" },
      { label: "30", value: "30" },
      { label: "50", value: "50" },
      { label: "100", value: "100" },
      { label: "200", value: "200" },
    ];

    return (
      <div className="table__bottom-content py-2 px-2 flex justify-between items-center">
        <div className="flex gap-6">
          <Select
            label=""
            variant="bordered"
            classNames={{
              label: "group-data-[filled=true]:-translate-y-5",
              base: "w-24",
              value: "text-dark",
              trigger:
                "min-h-7 h-9 border border-gray-300 shadow-none bg-transparent data-[hover=true]:border-primary data-[open=true]:border-primary data-[focus=true]:border-primary",
              selectorIcon: "text-white",
            }}
            listboxProps={{
              itemClasses: {
                base: [
                  "rounded-md",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "data-[hover=true]:bg-default-100",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
            popoverProps={{
              classNames: {
                base: "before:bg-default-200",
                content: "w-24",
              },
            }}
            disallowEmptySelection
            isMultiline={true}
            selectionMode="single"
            items={options || []}
            selectedKeys={tableState?.pageSize as any}
            onSelectionChange={handlePageSizeChange}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        </div>

        <Pagination
          showControls
          color="primary"
          page={Number(tableState?.pageIndex || 1)}
          total={totalPages || 1}
          variant="light"
          onChange={handlePageChange}
          classNames={{
            item: "font-medium [&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
            prev: "[&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
            next: "[&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
          }}
        />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState, total]);

  // Handler that is called when a user performs an action on the cell.
  // (key: react.Key) => void
  const onCellAction = () => { };

  const classNamesColumns = (col: ColumnField) => {
    let classes = "";

    if (col._id === "actions") {
      classes = "w-36 text-center";
    }

    if (col?.className) {
      classes = `w-36 text-center ${col?.className}`;
    }

    return classes;
  };

  return (
    <TableNextUI
      color="primary"
      aria-label="Example table with custom cells"
      fullWidth
      classNames={{
        wrapper: `max-h-[61vh] scroll-main scroll-main-x min-h-[200px] bg-transparent shadow-container rounded-md p-0`,
        table: "overflow-auto",
        tbody: "divide-y-1",
        th: "first:rounded-bl-none last:rounded-br-none uppercase text-center bg-primary text-light text-base font-bold",
        td: "text-base text-dark py-2 text-center group-aria-[selected=false]:group-data-[hover=true]:before:bg-gray-300/60",
      }}
      isHeaderSticky={true}
      bottomContentPlacement="outside"
      bottomContent={bottomContent}
      sortDescriptor={tableState?.sortDescriptor}
      onSortChange={handleSortChange}
      selectionMode={selectionMode}
      selectedKeys={tableState?.selectedKeys || new Set([])}
      onSelectionChange={handleSelectionChange}
      onCellAction={onCellAction}
    >
      <TableHeader columns={columns}>
        {(column: ColumnField) => (
          <TableColumn
            key={column._id}
            className={`${classNamesColumns(
              column
            )} data-[sortable=true]:hover:text-danger`}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent={!isLoading ? "Không có dữ liệu" : ""}
        isLoading={isLoading}
        loadingContent={<Spinner size="lg" color="primary" />}
      >
        {data?.map((item: any, index: number) => (
          <TableRow key={item._id}>
            {(columnKey: any) => (
              <TableCell key={columnKey}>
                {renderCell(item, columnKey, index)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </TableNextUI>
  );
}

export default TableControl;
