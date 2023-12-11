import httpClient from "../utils/httpClient";

type signProps = {
    username: string;
    password: string;
}

export const signUp = async (user: signProps): Promise<any> => {
    // ตัวอย่างการใช้ axios ตรงๆ
    // const response = await axios.post<any>(process.env.NEXT_PUBLIC_BASE_URL_API+"/authen/register", user)
    const response = await httpClient.post<any>("/authen/register", user)
    return response.data
}