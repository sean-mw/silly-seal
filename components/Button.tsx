import { cn } from "@/lib/utils";

type ButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

function Button({ onClick, children, className }: ButtonProps) {
  return (
    <button
      className={cn("bg-black text-white rounded w-20 h-10", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
