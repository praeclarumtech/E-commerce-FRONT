import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import api from "../shared/api";

type UserType = {
  user: any,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  role: string,
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
    queryFn: () => api.get("/users/profile")
  })

  return (
    <User.Provider
      value={{
        user: user?.data?.data?.data || null,
        firstName: user?.data?.data?.data || null,
        lastName: user?.data?.data?.data || null,
        email: user?.data?.data?.data || null,
        phone: user?.data?.data?.data || null,
        role: user?.data?.data?.data || null,
        refetch
      }}
    >
      {children}
    </User.Provider>
  );
};
// const { } = useUser()