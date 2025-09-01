import { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = ({ className = "" }) => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className={`text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${className}`}
    >
      <ApperIcon name="LogOut" size={16} className="mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;