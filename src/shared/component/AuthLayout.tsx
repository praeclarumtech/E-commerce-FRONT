import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row">
        {children}
      </div>
    </div>
  );
}
