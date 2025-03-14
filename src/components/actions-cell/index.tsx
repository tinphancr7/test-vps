import {ActionItem} from "@/interfaces/action-item";
import {ActionsCellProps} from "@/interfaces/actions-cell-props";
import {Button, Tooltip} from "@heroui/react";
import {useMemo} from "react";
import {FaRegTrashCan} from "react-icons/fa6";
import {LiaEditSolid} from "react-icons/lia";

function ActionsCell({
	disableUpdate = false,
	disableDelete = false,
	onUpdate = () => {},
	onDelete = () => {},
	actionsAdd,
}: ActionsCellProps) {
	const actions: Array<ActionItem> = useMemo(() => {
		const defaultActions = [
			{
				order: 2,
				label: "Chỉnh sửa",
				icon: LiaEditSolid,
				bgColor: "bg-primaryDf",
				isDisabled: disableUpdate,
				onPress: onUpdate,
			},
			{
				order: 3,
				label: "Xóa",
				icon: FaRegTrashCan,
				bgColor: "bg-danger",
				isDisabled: disableDelete,
				onPress: onDelete,
			},
		];

		if (actionsAdd) {
			return [...defaultActions, ...actionsAdd]?.sort(
				(a, b) => a.order - b.order
			);
		}

		return defaultActions?.sort((a, b) => a.order - b.order);
	}, [actionsAdd, disableDelete, disableUpdate, onDelete, onUpdate]);

	return (
		<div className="flex gap-2 justify-center items-center min-h-max">
			{actions?.map((action: ActionItem, index: number) => {
				const {icon: Icon, onPress, isDisabled, label, bgColor} = action;

				if (!isDisabled)
					return (
						<Tooltip
							key={index}
							content={label}
							className={`capitalize ${bgColor} text-light`}
						>
							<Button
								variant="solid"
								radius="full"
								className={`${bgColor} min-w-0 w-max p-[6px] h-max min-h-max`}
								onPress={onPress}
							>
								<Icon className="min-w-max text-base w-4 h-4 text-light" />
							</Button>
						</Tooltip>
					);
			})}
		</div>
	);
}

export default ActionsCell;
