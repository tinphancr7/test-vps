import {configureStore} from "@reduxjs/toolkit";
import {
	TypedUseSelectorHook,
	useDispatch,
	useSelector,
	useStore,
} from "react-redux";
import rootReducer from "./reducer";

export const store = configureStore({
	reducer: rootReducer,
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware({
			serializableCheck: false,
		});
	},
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<AppStore>();
