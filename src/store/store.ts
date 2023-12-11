import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux';
import userReducer from "@/store/slices/userSlice"

const reducer = { userReducer }

export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === "development"
})

// export type of root state from reducer
export type RootState = ReturnType<typeof store.getState>  // เป็นการกำหนด type ให้เหมือนกันที่ตั้งใน store เช่น const count = useSelector((state: any) => state.userReducer); || ในไฟล์ nameSlice export const userSelector = (state: RootState) => state.userReducer
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()