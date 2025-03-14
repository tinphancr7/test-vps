import { ModalState } from "@/interfaces/modal-state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ModalState = {
	isOpen: false,
	title: "",
	body: "",
	maxWidth: "",
	isLoading: false,
	isDismissable: true,
	header: "",
	hideCloseButton: false,
	footer: "",
	placement: "default",
};

const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		setModal: (state: any, action: PayloadAction<Partial<ModalState>>) => {
			const updates = action.payload;
			Object.keys(updates).forEach((key) => {
				state[key as keyof ModalState] =
					updates[key as keyof ModalState];
			});
		},

		resetModal: (state) => {
			Object.assign(state, initialState);
		},
	},
});

export const { setModal, resetModal } = modalSlice.actions;

export default modalSlice.reducer;
