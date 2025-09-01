import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import ActivityFeed from "@/components/organisms/ActivityFeed";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back to FlowCRM</h1>
          <p className="text-primary-100 text-lg">
            Track your sales pipeline and grow your business with intelligent insights
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DashboardStats />
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ActivityFeed limit={8} />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;