import React from "react";

export default function AuthHeading({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">
                {children}
            </h1>
        </div>
    );
}
