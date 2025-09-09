import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  delay = 0 
}) => {
const colorClasses = {
    primary: {
      bg: "bg-gradient-to-br from-primary-500 to-primary-600",
      icon: "text-primary-600",
      iconBg: "bg-primary-100",
    },
    success: {
      bg: "bg-gradient-to-br from-success-500 to-success-600",
      icon: "text-success-600",
      iconBg: "bg-success-100",
    },
    warning: {
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      icon: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    danger: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      icon: "text-red-600",
      iconBg: "bg-red-100",
    },
  };

  // Ensure we have a valid color with fallback to primary
  const validColor = color && colorClasses[color] ? color : 'primary';

  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";
  const trendColor = trend === "up" ? "text-success-600" : trend === "down" ? "text-red-600" : "text-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <motion.p 
              className="text-2xl font-bold gradient-text"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
            {trend && trendValue && (
              <div className={`flex items-center mt-3 text-sm ${trendColor}`}>
                <ApperIcon name={trendIcon} size={16} className="mr-1" />
                <span className="font-medium">{trendValue}</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <motion.div
className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[validColor].iconBg}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
<ApperIcon name={icon} size={24} className={colorClasses[validColor].icon} />
          </motion.div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
<div className={`w-full h-full rounded-full ${colorClasses[validColor].bg} transform translate-x-16 -translate-y-16`} />
        </div>
      </Card>
    </motion.div>
  );
};

export default StatsCard;