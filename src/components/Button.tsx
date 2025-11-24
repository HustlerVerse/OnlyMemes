import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ children, onClick, variant = "primary" }: Props) {
  const base = "px-6 py-3 rounded-xl shadow-soft hover:scale-105 transition";
  const style =
    variant === "primary"
      ? "bg-primary text-background"
      : "bg-surface text-text";
  return (
    <motion.button onClick={onClick} className={`${base} ${style}`}>
      {children}
    </motion.button>
  );
}
