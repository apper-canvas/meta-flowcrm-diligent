import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  hover = false,
  gradient = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg border border-gray-200 transition-all duration-200";
  
  return (
    <motion.div
      ref={ref}
      className={cn(
        baseStyles,
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        "card-shadow",
        className
      )}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";

export default Card;