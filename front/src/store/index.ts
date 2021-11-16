import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { themeReducer } from "./module/theme/theme.reducer";
import { authenticationReducer } from "./module/authentication/authentication.reducer";
import { swaggerReducer } from "./module/swagger/swagger.reducer";

const store = configureStore({
	reducer: {
		theme: themeReducer,
		authentication: authenticationReducer,
		swagger: swaggerReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;
