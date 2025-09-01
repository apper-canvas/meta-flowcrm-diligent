import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { activityService } from "@/services/api/activityService";

const ActivityFeed = ({ limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await activityService.getAll();
const sortedActivities = data
        .sort((a, b) => new Date(b.CreatedOn || b.createdAt) - new Date(a.CreatedOn || a.createdAt))
        .slice(0, limit);
      setActivities(sortedActivities);
    } catch (err) {
      setError("Failed to load activities");
      console.error("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "contact_created": return "UserPlus";
      case "contact_updated": return "UserCheck";
      case "company_created": return "Building2";
      case "company_updated": return "Building";
      case "deal_created": return "TrendingUp";
      case "deal_updated": return "RefreshCw";
      case "deal_stage_changed": return "ArrowRight";
      case "deal_won": return "Trophy";
      case "deal_lost": return "X";
      default: return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "contact_created":
      case "company_created":
      case "deal_created":
        return "success";
      case "deal_won":
        return "success";
      case "deal_lost":
        return "danger";
      case "deal_stage_changed":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Loading type="default" />;
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <ApperIcon name="AlertTriangle" size={24} className="mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Empty
        icon="Activity"
        title="No recent activities"
        message="Activities will appear here as you work with contacts, companies, and deals."
        showAction={false}
      />
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
key={activity.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                getActivityColor(activity.type_c || activity.type) === "success" ? "bg-success-100" :
                getActivityColor(activity.type_c || activity.type) === "danger" ? "bg-red-100" :
                getActivityColor(activity.type_c || activity.type) === "primary" ? "bg-primary-100" :
                "bg-gray-100"
              }`}>
                <ApperIcon
                  name={getActivityIcon(activity.type_c || activity.type)}
                  size={16}
                  className={
                    getActivityColor(activity.type_c || activity.type) === "success" ? "text-success-600" :
                    getActivityColor(activity.type_c || activity.type) === "danger" ? "text-red-600" :
                    getActivityColor(activity.type_c || activity.type) === "primary" ? "text-primary-600" :
                    "text-gray-600"
                  }
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">{activity.description_c || activity.description}</p>
                <Badge variant={getActivityColor(activity.type_c || activity.type)} size="sm">
                  {activity.entity_type_c || activity.entityType}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(activity.CreatedOn || activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;