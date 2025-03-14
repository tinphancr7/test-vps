import { ReactElement } from "react";

type Placement = "default" | "right";

export interface ModalState {
	isOpen: boolean;
	title: string | ReactElement;
	body: string | ReactElement;
	maxWidth: string;
	isLoading: boolean;
	isDismissable: boolean;
	hideCloseButton: boolean;
	header: string | ReactElement;
	footer: string | ReactElement;
	placement: Placement;
}
