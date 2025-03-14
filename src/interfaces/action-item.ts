import { IconType } from "react-icons";

export interface ActionItem {
    order: number;
	label: string | React.ReactElement;
	icon: IconType;
	bgColor: string;
	isDisabled: boolean;
	onPress: () => void;
}