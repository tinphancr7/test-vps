import { ColumnField } from "./column-field";

type SelectionMode = "none" | "single" | "multiple";

export interface TableProps {
  tableId: string;
  data: Array<any>;
  total: number;
  columns: Array<ColumnField>;
  renderCell: (item: any, columnKey: string, index: number) => string | React.ReactElement;
  isLoading?: boolean;
  selectionMode?: SelectionMode;
  onCellAction?: (key: React.Key) => void;
}
