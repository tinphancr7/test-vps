import usePushQueryString from "@/hooks/usePushQueryString";
import useQueryString from "@/hooks/useQueryString";
import { ColumnField } from "@/interfaces/column-field";
import paths from "@/routes/paths";
import { cleanObjectByQuery, getPageIndex } from "@/utils/handle-param-pagination";
import {
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { useAppDispatch } from "@/stores";
import { setDomainName } from "@/stores/slices/cloud-flare-ssl.slice";

interface Props {
  columns: any;
  data: any;
  isLoading: boolean;
  renderCell: any;
  total: number;
}

const TableNextUI_V2 = ({ columns, data, isLoading, renderCell, total = 1 }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pageIndex, pageSize, search } = useQueryString();
  console.log("pageSize: ", pageSize);
  const pushQueryString = usePushQueryString();

  const handleOnchange = useCallback(
    (page: number) => {
      pushQueryString(cleanObjectByQuery({ pageIndex: page.toString(), search, pageSize }));
    },
    [pushQueryString],
  );
  const handleOnchangePageSize = useCallback(
    (pageSize: number) => {
      pushQueryString(cleanObjectByQuery({ pageIndex, search, pageSize: pageSize.toString() }));
    },
    [pushQueryString],
  );

  const bottomContent = useMemo(() => {
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
            defaultSelectedKeys={[`${pageSize ?? 10}`]}
            onSelectionChange={(pageSize) => handleOnchangePageSize([...pageSize][0] as any)}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        </div>

        <Pagination
          showControls
          color="primary"
          page={parseInt(getPageIndex(pageIndex))}
          total={total}
          variant="light"
          onChange={(data) => handleOnchange(data)}
          classNames={{
            item: "font-medium [&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
            prev: "[&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
            next: "[&[data-hover=true]:not([data-active=true])]:bg-default-300/40",
          }}
        />
      </div>
    );
  }, [total]);

  return (
    <Table
      color="primary"
      aria-label="Example table with custom cells"
      fullWidth
      classNames={{
        wrapper: `max-h-[61vh] scroll-main scroll-main-x min-h-[200px] bg-transparent shadow-container rounded-md p-0`,
        table: "overflow-auto",
        tbody: "divide-y-1",
        th: "first:rounded-bl-none last:rounded-br-none uppercase text-left bg-primary text-light text-base font-bold",
        td: "text-base text-dark py-2 text-left group-aria-[selected=false]:group-data-[hover=true]:before:bg-gray-300/60",
      }}
      isHeaderSticky={true}
      bottomContentPlacement="outside"
      bottomContent={bottomContent}
    >
      <TableHeader columns={columns}>
        {(column: ColumnField) => (
          <TableColumn
            key={column._id}
            className={column?.className || ""}
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
        {(item: any) => (
          <TableRow
            className="hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              dispatch(setDomainName(item?.name));
              navigate(paths.cloudflare_ssl + "/" + item?.id);
            }}
            key={item._id}
          >
            {(columnKey: any) => (
              <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableNextUI_V2;
