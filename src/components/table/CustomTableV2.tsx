"use client";
import React from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Spinner,
} from "@heroui/react";

const CustomTableV2 = ({
	isLoading,
	items,
	columns,
	renderCell,
	bottomContent,
	topContent,
	selectedKeys,
	setSelectedKeys,
}) => {
	const classNames = React.useMemo(
		() => ({
			wrapper: ["max-h-[382px]", "max-w-3xl"],
			th: [
				"bg-gray-100 ",
				"whitespace-nowrap",
				"text-default-500",
				"border-b",
				"border-divider",
				"text-sm",
			],
			td: [
				// changing the rows border radius
				// first
				"border-b",
				"border-divider",
				"group-data-[first=true]/tr:first:before:rounded-none",
				"group-data-[first=true]/tr:last:before:rounded-none",
				// middle
				"group-data-[middle=true]/tr:before:rounded-none",
				// last
				"group-data-[last=true]/tr:first:before:rounded-none",
				"group-data-[last=true]/tr:last:before:rounded-none",
			],
			loadingWrapper: ["mt-[150px]"],
		}),
		[]
	);

	return (
		<Table
			isCompact
			removeWrapper
			aria-label="Example table with custom cells, pagination and sorting"
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			// classNames={classNames}

			classNames={{
				wrapper: `max-h-[66vh] scroll-main min-h-[200px] bg-transparent shadow-container rounded-md p-0`,
				table: "overflow-auto",
				tbody: "divide-y-1",
				th: "first:rounded-bl-none last:rounded-br-none uppercase text-center bg-primary text-light text-base font-bold",
				td: "text-base border-b text-dark py-2 text-center group-aria-[selected=false]:group-data-[hover=true]:before:bg-gray-300/60",
			}}
			selectedKeys={selectedKeys}
			// selectionMode="multiple"
			topContent={topContent}
			topContentPlacement="outside"
			onSelectionChange={(keys) => {
				if (typeof keys === "string" && keys === "all") {
					setSelectedKeys(new Set(items.map((item) => item._id)));
				} else {
					setSelectedKeys(new Set(keys));
				}
			}}
			onCellAction={() => {}}
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn
						key={column.uid}
						align={column.uid === "actions" ? "center" : "start"}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				isLoading={isLoading}
				emptyContent={"No data"}
				items={items || []}
				loadingContent={
					<div className="">
						<Spinner label="Loading..." />
					</div>
				}
				// loadingState={loadingState}
			>
				{(item) => (
					<TableRow key={item?._id}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
export default CustomTableV2;
