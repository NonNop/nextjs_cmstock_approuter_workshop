// export const dynamic = 'auto'
// export const dynamicParams = true
// export const revalidate = false
// export const fetchCache = 'auto'
// export const runtime = 'nodejs'
// export const preferredRegion = 'auto'

import { ACCESS_TOKEN_KEY } from "@/utils/constant";
import httpClient from "@/src/utils/httpClient";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET
export async function GET(
  request: NextRequest,
  context: {
    params: {
      route: string;
    };
  }
): Promise<any> {
  const route = context.params.route;

  if (route === "signout") {
    return signout(request)
  } else if (route === "session") {
    return getSession(request);
  }
  return NextResponse.json({ route });
}

// POST
export async function POST(
  request: NextRequest,
  context: {
    params: {
      route: string;
    };
  }
): Promise<any> {
  const route = context.params.route;
  const body = await request.json();
  // ทำการดัก path url ว่าใช่ signin ไหม ตัวอย่าง "api/auth/signin"
  if (route === "signin") {
    return signin(body);
  }
}

function signout(requset: NextRequest) {
  const cookieStore = cookies()
  cookieStore.delete(ACCESS_TOKEN_KEY);
  return NextResponse.json({ result: "ok" })
}

async function signin(body: { username: string, password: string }): Promise<any> {
  try {
    const response = await httpClient.post(`/authen/login`, body)
    const { token } = response.data
    cookies().set(ACCESS_TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/"
    });
    return NextResponse.json(response.data)
  } catch {
    return NextResponse.json({ ressult: "nok" })
  }
}

async function getSession(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessTokenKey = cookieStore.get(ACCESS_TOKEN_KEY)
    if (!!accessTokenKey?.value) {
      const response = await httpClient.get(`/authen/profile`, {
        headers: { Authorization: `Bearer ${accessTokenKey?.value}` }
      })
      return NextResponse.json(response.data)
    } else {
      return NextResponse.json({ ressult: "nok" })
    }
  } catch (error) {
    return NextResponse.json({ ressult: "nok" })
  }
}
