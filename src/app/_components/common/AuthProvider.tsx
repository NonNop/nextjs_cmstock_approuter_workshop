"use client";
import { getSession, userSelector } from "@/src/store/slices/userSlice";
import { store } from "@/src/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";

type Props = {};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    store.dispatch(getSession());
  }, []);

  const path = usePathname();
  const router = useRouter();
  const userReducer = useSelector(userSelector);

  // is fetching session
  if (userReducer.isAuthenticating) {
    return <Loading />;
  }
  // ถ้า user ไม่ได้ทำการ login หรือ register ให้เปลี่ยนไปหน้า login component
  if (path !== "/login" && path !== "/register") {
    if (!userReducer.isAuthenticated) {
      router.push(`/login`);
      return <Loading />;
    } else if (path == "/") {
      router.push(`/stock`); // ตั้งค่า default ให้เป็นหน้าแรกหลัง login เวลาเรียกไปหน้า root path ==> "/"
      return <Loading />;
    }
  } else {
    if (userReducer.isAuthenticated) {
      router.push(`/stock`); // ตั้งค่า default ให้เป็นหน้าแรกหลัง login
      return <Loading />;
    }
  }
  return <div>{children}</div>;
}
