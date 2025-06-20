type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
};

function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      className="bg-black text-white w-20 py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
