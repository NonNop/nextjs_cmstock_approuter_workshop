"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Props = {};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  if (path != "/stock") {
    router.push("/stock");
    return null;
  }

  return <div>{children}</div>;
}
