"use client";

import { PropsWithChildren, useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";

export function StoreProvider({ children }: PropsWithChildren) {
  const store = useMemo(() => makeStore(), []);
  return <Provider store={store}>{children}</Provider>;
}

