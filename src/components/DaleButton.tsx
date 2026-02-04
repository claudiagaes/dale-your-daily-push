import { motion } from "framer-motion";
import { forwardRef, ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

interface DaleButtonProps {
  variant?: "hero" | "secondary" | "ghost" | "outline";
  size?: "default" | "lg" | "sm";
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const DaleButton = forwardRef<HTMLButtonElement, DaleButtonProps>(
  ({ className, variant = "hero", size = "default", children, onClick, disabled, type = "button" }, ref) => {
    const variants = {
      hero: "btn-hero",
      secondary: "btn-hero-secondary",
      ghost: "btn-ghost",
      outline: "inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-xl border-2 border-primary text-primary bg-transparent transition-all duration-200 hover:bg-primary hover:text-primary-foreground",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      default: "",
      lg: "px-10 py-5 text-xl",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(variants[variant], sizes[size], className)}
      >
        {children}
      </motion.button>
    );
  }
);

DaleButton.displayName = "DaleButton";

export default DaleButton;
