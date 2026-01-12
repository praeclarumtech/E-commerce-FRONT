import { ButtonHTMLAttributes, ReactNode } from "react";

import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  ...rest
}) => {

  const className = clsx("inline-flex items-center justify-center gap-2 rounded-lg transition",
    {
      "px-4 py-3 text-sm": size === "sm",
      "px-5 py-3.5 text-sm": size === "md",
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300": variant === 'primary',
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50": variant === "outline",
      "cursor-not-allowed opacity-50": rest.disabled
    },
    rest.className)

  return (
    <button
      {...rest}
      className={className}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
