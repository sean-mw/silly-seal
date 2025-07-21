import { cn } from "@/lib/utils";

type ButtonProps = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

function Button({ onClick, children, className, disabled }: ButtonProps) {
  return (
    <button
      className={cn(
        "bg-black text-white rounded w-20 h-10 disabled:opacity-50 flex items-center justify-center",
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
