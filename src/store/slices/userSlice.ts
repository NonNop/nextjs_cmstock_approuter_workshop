import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as serverService from "@/src/services/serverService";
import httpClient from "@/src/utils/httpClient";
import { AxiosRequestConfig } from "axios";
import { UserData } from "@/src/app/models/user.model";

interface UserState {
    username: string;
    accessToken: string;
    error?: string;
    status: "fetching" | "success" | "failed" | "init";
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    count: 0;
    user?: UserData
}
const initialState: UserState = {
    accessToken: "",
    username: "",
    status: "init",
    isAuthenticated: false,
    isAuthenticating: true,  // เช็คว่ากำลังจะ Authen อยู่หรือป่าว
    count: 0,
}

interface SignAction {
    username: string;
    password: string;
}
export const signUp = createAsyncThunk(
    "user/signup",
    async (credential: SignAction) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const response = await serverService.signUp(credential)
        return response
    })
export const signIn = createAsyncThunk(
    "user/signin",
    async (credential: SignAction) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const response = await serverService.signIn(credential)

        if (response.result != "ok") {
            throw new Error("login failed")
        }

        // set access token เป็นการกำหนด token หลังจาก Login การส่ง request จะส่ง  header token เสมอ 
        httpClient.interceptors.request.use((config?: AxiosRequestConfig | any) => {
            if (config && config.headers) {
                config.headers["Authentication"] = `Bearer ${response.token}`;
            }
            return config
        })
        return response
    })

export const signOut = createAsyncThunk("user/signout", async () => {
    await serverService.signOut()
})

export const getSession = createAsyncThunk("user/fetchSession", async () => {
    const response = await serverService.getSession()
    // set access token
    if (response) {
        httpClient.interceptors.request.use((config?: AxiosRequestConfig | any) => {
            if (config && config.headers && response.user) {
                config.headers["Authentication"] = `Bearer ${response.user?.token}`;
            }
            return config
        })
    }
    return response
})

const userSlice = createSlice({
    name: 'user',
    initialState, // ชื่อ propoties initialState มีเหมือนกันจึงใช้ชื่อเดียวได้เลย หากคนละชื่อกับ initialState ==> initialState: { count: 0 },
    reducers: {
        add: (state) => {
            state.count++;
        }
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(signUp.pending, (state) => {
            state.status = "fetching"
        })
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.count++;
            state.status = "success"
        })
        builder.addCase(signUp.rejected, (state, action) => {
            state.count++;
            state.status = "failed"
        })

        // Login
        builder.addCase(signIn.pending, (state) => {
            state.status = "fetching"
        })
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.count++;
            state.status = "success"
            state.accessToken = action.payload.token
            state.isAuthenticated = true
            state.isAuthenticating = false
            state.username = action.payload.username
        })
        builder.addCase(signIn.rejected, (state, action) => {
            state.count++;
            state.status = "failed"
            state.accessToken = ""
            state.isAuthenticated = false
            state.isAuthenticating = false
        })

        // Logout
        builder.addCase(signOut.fulfilled, (state) => {
            state.accessToken = ""
            state.isAuthenticated = false
            state.isAuthenticating = false
        })

        // getSession
        builder.addCase(getSession.fulfilled, (state, action) => {
            state.isAuthenticating = false
            if (action.payload && action.payload.user && action.payload.user.token) {
                state.accessToken = action.payload.user.token
                state.user = action.payload.user
                state.isAuthenticated = true
            }
        })
    }
})

export default userSlice.reducer
export const { add } = userSlice.actions
export const userSelector = (state: RootState) => state.userReducer