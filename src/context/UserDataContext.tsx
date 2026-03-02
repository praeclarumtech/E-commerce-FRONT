import { createContext, useContext } from "react";

import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../modules/profile/api";
import { ProfileResponseData } from "../modules/profile/type";

type UserType = {
  user: ProfileResponseData['data'] | null,
  refetch: () => void
};

const User = createContext<UserType>({} as UserType);

export const useUser = () => {
  const context = useContext(User);
  if (!context) {
    throw new Error("useUser must be used within a SidebarProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const { data: user, refetch } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => getProfile(),
  })

  return (
    <User.Provider
      value={{
        user: user?.data?.data || null,
        refetch
      }}
    >
      {children}
    </User.Provider>
  );
};