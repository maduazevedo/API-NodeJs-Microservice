interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md transition-colors cursor-pointer duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
