import { InputHTMLAttributes } from "react";

import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  step?: number;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input = ({
  step,
  success = false,
  error = false,
  hint,
  ...rest
}: InputProps) => {

  const inputClasses = clsx(
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3",
    rest.className,
    {
      "text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed": rest.disabled,
      "border-error-500 focus:border-error-300 focus:ring-error-500/20": !rest.disabled && error,
      "border-success-500 focus:border-success-300 focus:ring-success-500/20": !rest.disabled && success,
      "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20": !rest.disabled && !error && !success,
    }
  );

  return (
    <div className="relative">
      <input
        {...rest}
        step={step}
        className={inputClasses}
      />
      {hint && (
        <p
          className={clsx("mt-1.5 text-xs", {
            "text-error-500": error,
            "text-success-500": success,
            "text-gray-500": !error && !success,
          })}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
