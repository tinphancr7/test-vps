import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Pagination,
	Spinner,
} from "@heroui/react";
import {useCallback, useMemo} from "react";
import Container from "../container";

const CustomTable = ({
	columns,
	data,
	renderCell,
	selectedKeys,
	setSelectedKeys,
	meta,
	page,
	onChangePage,
	setPage,
	rowsPerPage,
	setRowsPerPage,
	isLoading,
	title,
}: any) => {
	const onRowsPerPageChange = useCallback((e: any) => {
		setRowsPerPage(Number(e.target.value));
		setPage(1);
	}, []);

	const widthColumn = useMemo(() => {
		const width = columns.length;
		return `w-1/${width}`;
	}, [columns]);
	const bottomContent = useMemo(() => {
		return meta?.totalPages > 0 ? (
			<div className="py-2 px-2 flex justify-between items-center">
				<span className="w-[30%] text-small text-default-400">
					{selectedKeys === "all"
						? "All items selected"
						: `${selectedKeys.size} of ${rowsPerPage} selected`}
				</span>
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={Number(page) || 1}
					total={Number(meta?.totalPages) || 1}
					onChange={(value: number) => onChangePage(value)}
				/>
			</div>
		) : null;
	}, [meta?.totalPages, selectedKeys, rowsPerPage, page, onChangePage]);

	return (
		<Container>
			<Table
				key={"table"}
				isHeaderSticky
				classNames={{
					wrapper: `max-h-[66vh] scroll-main min-h-[200px] bg-transparent shadow-container rounded-md p-0`,
					table: "overflow-auto",
					tbody: "divide-y-1",
					th: "first:rounded-bl-none last:rounded-br-none uppercase text-center bg-primary text-light text-base font-bold",
					td: "text-base text-dark py-2 text-center group-aria-[selected=false]:group-data-[hover=true]:before:bg-gray-300/60",
				}}
				bottomContentPlacement="outside"
				topContent={
					<div className="flex justify-between items-center p-2 -mb-2 ">
						<h2 className="text-xl font-bold text-black capitalize">{title}</h2>
						<div className="hidden sm:flex w-[30%] justify-end gap-2">
							<select
								className="bg-transparent outline-none text-default-400 text-small border w-[100px] h-[38px] rounded-md px-2"
								onChange={onRowsPerPageChange}
								value={rowsPerPage}
							>
								{["5", "10", "15", "20", "50"].map((item) => (
									<option key={item} value={item}>
										{item}
									</option>
								))}
							</select>
						</div>
					</div>
				}
				bottomContent={bottomContent}
				aria-label="Example table with custom cells"
				selectionMode="none"
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
				onCellAction={() => {}}
			>
				<TableHeader columns={columns}>
					{(column: any) => (
						<TableColumn
							key={column?.key}
							align={"start"}
							className={`text-sm font-bold  ${widthColumn}`}
						>
							{column?.label}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					isLoading={isLoading}
					loadingContent={<Spinner label="Loading..." />}
					items={data}
					emptyContent={"Không có dữ liệu"}
				>
					{(item: any) => (
						<TableRow key={item?._id}>
							{(columnKey) => (
								<TableCell>{renderCell(item, columnKey)}</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Container>
	);
};

export default CustomTable;
