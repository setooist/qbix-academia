
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        background: "var(--primary-color)",
        borderRadius: "var(--radius)",
        fontFamily: "var(--font-family)",
      }}
    >
      {children}
    </button>
  );
}