import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ButtonVariant, ButtonSize } from "../enums";

interface MotionButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
}

const getVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case ButtonVariant.PRIMARY:
      return "bg-blue-400 hover:bg-blue-500";
    case ButtonVariant.SECONDARY:
      return "bg-gray-400 hover:bg-gray-500";
    case ButtonVariant.SUCCESS:
      return "bg-green-400 hover:bg-green-500";
    case ButtonVariant.DANGER:
      return "bg-red-400 hover:bg-red-500";
    default:
      return "bg-blue-400 hover:bg-blue-500";
  }
};

const getSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case ButtonSize.SMALL:
      return "px-3 py-1 text-sm";
    case ButtonSize.MEDIUM:
      return "px-4 py-2 text-base";
    case ButtonSize.LARGE:
      return "px-6 py-3 text-lg";
    default:
      return "px-4 py-2 text-base";
  }
};

export default function MotionButton({
  children,
  onClick,
  variant = ButtonVariant.PRIMARY,
  size = ButtonSize.MEDIUM,
  className = "",
  disabled = false,
}: MotionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        text-white rounded-lg font-bold transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
