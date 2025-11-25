"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { StoreProvider } from "./StoreProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
    </SessionProvider>
  );
}

