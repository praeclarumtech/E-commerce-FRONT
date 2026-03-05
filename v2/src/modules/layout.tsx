import type { ReactNode } from "react";
import StoreProvider from "./_stores/StoreProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
