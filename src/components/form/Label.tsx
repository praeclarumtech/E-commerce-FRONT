import { FC, ReactNode } from "react";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
}

const Label: FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
       
      )}
    >
      {children}
    </label>
  );
};

export default Label;
