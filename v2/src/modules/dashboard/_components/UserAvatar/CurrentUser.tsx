import React, { ReactNode } from "react";
import { useMainStore } from "../../../_stores/mainSlice";
import UserAvatar from ".";

type Props = {
  className?: string;
  children?: ReactNode;
};

export default function UserAvatarCurrentUser({ className = "", children }: Props) {
  const userEmail = useMainStore((s) => s.userEmail);

  return (
    <UserAvatar username={userEmail ?? ""} className={className}>
      {children}
    </UserAvatar>
  );
}
