import type { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

export default function StoreProvider({ children }: Props) {
  return <>{children}</>;
}
