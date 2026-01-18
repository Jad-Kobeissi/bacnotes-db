import { motion } from "motion/react";
export default function Loading({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ scale: [0.9, 1.1, 0.9] }}
      transition={{ repeat: Infinity, repeatType: "loop" }}
      className={`${className}`}
    >
      Loading...
    </motion.div>
  );
}
