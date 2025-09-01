import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Database",
  title = "No data available", 
  message = "Get started by creating your first record.",
  actionText = "Create New",
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name={icon} size={40} className="text-primary-600" />
      </motion.div>

      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

        {showAction && onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-6 py-3"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionText}
          </Button>
        )}
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-3 gap-4 max-w-xs opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5 }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-2 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Empty;