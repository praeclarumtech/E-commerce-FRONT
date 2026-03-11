import type { ReactNode } from "react";
import { containerMaxW } from "../../_lib/config";

type Props = {
  children: ReactNode;
};

export default function FooterBar({ children }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className={`px-6 py-2 ${containerMaxW}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-slate-400">
          &copy; {year} {children}
        </span>
      </div>
    </footer>
  );
}
