import { motion, TargetAndTransition, VariantLabels } from "framer-motion";
import { ReactNode } from "react";

interface MotionDivProps {
  children: ReactNode;
  initial?: TargetAndTransition | VariantLabels;
  animate?: TargetAndTransition | VariantLabels;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MotionDiv({
  children,
  initial = {},
  animate = {},
  className = "",
  onClick,
}: MotionDivProps) {
  return (
    <motion.div initial={initial} animate={animate} className={className}>
      {children}
    </motion.div>
  );
}
