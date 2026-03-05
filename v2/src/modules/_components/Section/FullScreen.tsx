"use client";

import React, { ReactNode } from "react";
import type { BgKey } from "../../_interfaces";
import { gradientBgPurplePink, gradientBgDark, gradientBgPinkRed } from "../../_lib/colors";
import { useDarkModeStore } from "../../_stores/darkModeSlice";

type Props = {
  bg: BgKey;
  children: ReactNode;
};

export default function SectionFullScreen({ bg, children }: Props) {
  const darkMode = useDarkModeStore((s) => s.isEnabled);

  let componentClass = "flex min-h-screen items-center justify-center ";

  if (bg === "dark" || darkMode) {
    componentClass += gradientBgDark;
  } else if (bg === "purplePink") {
    componentClass += gradientBgPurplePink;
  } else if (bg === "pinkRed") {
    componentClass += gradientBgPinkRed;
  }

  return <div className={componentClass}>{children}</div>;
}
