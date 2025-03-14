import { ActionItem } from "./action-item";

export interface ActionsCellProps {
	disableUpdate?: boolean;
	disableDelete?: boolean;
	onUpdate?: () => void;
	onDelete?: () => void;
    actionsAdd?: Array<ActionItem>
}