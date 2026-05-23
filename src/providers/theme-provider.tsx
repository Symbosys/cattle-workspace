"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Clear any manually saved theme preference to enforce system preference only
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("theme");
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
