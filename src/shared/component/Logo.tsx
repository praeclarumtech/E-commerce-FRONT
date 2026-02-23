import { Link } from "react-router-dom";
import { LOGO_URL, APP_NAME } from "../constant/branding";

type LogoProps = {
  /** "sidebar" = with text when space allows, "compact" = icon + short text for header */
  variant?: "sidebar" | "compact" | "icon";
  /** Optional class for the wrapper */
  className?: string;
  /** Link to (default: "/"). Set to empty string or undefined to render non-link. */
  to?: string;
  /** Image className (e.g. size) */
  imgClassName?: string;
};

/**
 * Reusable logo. Replace public/logo.svg to change the logo site-wide.
 */
function Logo({ variant = "sidebar", className = "", to = "/", imgClassName = "" }: LogoProps) {
  const img = (
    <img
      src={LOGO_URL}
      alt={APP_NAME}
      className={`shrink-0 object-contain ${variant === "icon" ? "h-8 w-8" : "h-9 w-9"} ${imgClassName}`}
      width={variant === "icon" ? 32 : 36}
      height={variant === "icon" ? 32 : 36}
    />
  );

  const text = variant !== "icon" && (
    <span className="font-semibold text-gray-900 truncate">
      {variant === "compact" ? "E-Com" : APP_NAME}
    </span>
  );

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {img}
      {text}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-brand-500/20 rounded-lg">
        {content}
      </Link>
    );
  }
  return content;
}

export default Logo;
