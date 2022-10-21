import cn from "classnames";
import Spinner from "./Spinner";

export type ButtonProps = {
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const buttonClassNames = cn(
  "inline-block",
  "px-6",
  "py-2.5",
  "bg-gray-800",
  "text-white",
  "font-medium",
  "text-xs",
  "leading-tight",
  "uppercase",
  "rounded",
  "shadow-md",
  "hover:bg-gray-700",
  "hover:shadow-lg",
  "focus:bg-gray-700",
  "focus:shadow-lg",
  "focus:outline-none",
  "focus:ring-0",
  "active:bg-gray-800",
  "active:shadow-lg",
  "transition",
  "duration-150",
  "ease-in-out",
  "disabled:bg-gray-700"
);

const Button = ({
  children,
  disabled,
  loading,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonClassNames, className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
