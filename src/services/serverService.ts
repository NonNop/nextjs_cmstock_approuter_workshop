import { GetSession, SignIn, SignUp } from "../app/models/auth.model";
import httpClient from "../utils/httpClient";

type signProps = {
    username: string;
    password: string;
}

export const signUp = async (user: signProps): Promise<SignUp> => {
    // ตัวอย่างการใช้ axios ตรงๆ
    // const response = await axios.post<any>(process.env.NEXT_PUBLIC_BASE_URL_API+"/authen/register", user)
    const response = await httpClient.post<any>("/authen/register", user)
    return response.data
}

export const signIn = async (user: signProps): Promise<SignIn> => {
    const response = await httpClient.post<SignIn>("/auth/signin", user, {
        // ทำการเปลี่ยน baseURL ให้ไปที่ NEXT API = NEXT_PUBLIC_BASE_URL_LOCAL_API 
        // ต้องทำการ route ไปที่ route ที่เราสร้างไว้ตัวอย่างในนี้โฟลเดอร์ "api/auth/[rout]"
        // เพื่อทำการเช็คว่า user login หรือยังในฝั่ง Server Side ด้วย
        // เพื่อถ้าทำการ Login สำเร็จจะมีการเก็บ Cookie หรือ Section เอาไว้ที่ฝั่ง Server
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API
    })
    return response.data
}

export const signOut = async () => {
    const response = await httpClient.get("/auth/signout", {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API
    })
    return response.data
}

export const getSession = async (): Promise<GetSession> => {
    const response = await httpClient.get(`/auth/session`, {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API
    })
    return response.data
}

export const getProducts = async (keyword?: string): Promise<Array<any>> => {
    if (keyword) {
        return (await httpClient.get(`/stock/product/keyword/${keyword}`)).data
    } else {
        return (await httpClient.get(`/stock/product`)).data
    }
}

