import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden p-6 z-1 bg-gradient-to-br from-gray-50 via-white to-brand-50/30">
      <div className="flex flex-1 flex-col items-center justify-center w-full lg:flex-row">
        {children}
      </div>
    </div>
  );
}
