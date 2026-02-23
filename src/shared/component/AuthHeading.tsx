import React from "react";

export default function AuthHeading({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 sm:mb-8 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {children}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
