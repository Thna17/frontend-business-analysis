"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "@/store";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark", "ocean"]}
      disableTransitionOnChange
    >
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
