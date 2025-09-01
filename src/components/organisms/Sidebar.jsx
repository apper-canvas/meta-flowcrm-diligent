import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Companies", href: "/companies", icon: "Building2" },
    { name: "Deals", href: "/deals", icon: "TrendingUp" },
  ];

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      onClick={mobile ? closeMobileMenu : undefined}
      className={({ isActive }) =>
        `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg"
            : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon
            name={item.icon}
            size={20}
            className={`mr-3 transition-colors ${
              isActive ? "text-white" : "text-gray-500 group-hover:text-primary-600"
            }`}
          />
          {item.name}
          {isActive && (
            <motion.div
              className="ml-auto w-2 h-2 bg-white rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  // Desktop Sidebar
const DesktopSidebar = () => {
    const { logout } = useContext(AuthContext);
    
    return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold gradient-text">FlowCRM</h1>
              <p className="text-xs text-gray-500">Customer Management</p>
            </div>
          </div>

          <nav className="px-3 space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

<div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Sales Team</p>
                <p className="text-xs text-gray-500">Premium Plan</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
            onClick={closeMobileMenu}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" size={20} className="text-white" />
                  </div>
                  <div className="ml-2">
                    <h1 className="text-lg font-bold gradient-text">FlowCRM</h1>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="p-2"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-3 space-y-2">
                  {navigationItems.map((item) => (
                    <NavItem key={item.name} item={item} mobile />
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-white shadow-lg"
        >
          <ApperIcon name="Menu" size={20} />
        </Button>
      </div>

      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;