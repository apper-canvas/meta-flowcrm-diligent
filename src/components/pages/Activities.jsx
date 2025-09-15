import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { activityService } from '@/services/api/activityService';
import DataTable from '@/components/molecules/DataTable';
import Modal from '@/components/molecules/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    type_c: '',
    description_c: '',
    entity_type_c: '',
    entity_id_c: ''
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getAll();
      setActivities(data || []);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('Failed to load activities. Please try again.');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredActivities = activities.filter(activity =>
    Object.values(activity).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCreate = () => {
    setEditingActivity(null);
    setFormData({
      Name: '',
      Tags: '',
      type_c: '',
      description_c: '',
      entity_type_c: '',
      entity_id_c: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      Name: activity.Name || '',
      Tags: activity.Tags || '',
      type_c: activity.type_c || '',
      description_c: activity.description_c || '',
      entity_type_c: activity.entity_type_c || '',
      entity_id_c: activity.entity_id_c || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name?.trim()) {
      toast.error('Activity name is required');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingActivity) {
        await activityService.update(editingActivity.Id, formData);
        toast.success('Activity updated successfully');
      } else {
        await activityService.create(formData);
        toast.success('Activity created successfully');
      }
      
      setIsModalOpen(false);
      await loadActivities();
    } catch (err) {
      console.error('Error saving activity:', err);
      toast.error(editingActivity ? 'Failed to update activity' : 'Failed to create activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityService.delete(id);
      toast.success('Activity deleted successfully');
      await loadActivities();
    } catch (err) {
      console.error('Error deleting activity:', err);
      toast.error('Failed to delete activity');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const columns = [
    {
      key: 'Name',
      title: 'Name',
      render: (value, row) => (
        <div className="font-medium text-gray-900">
          {value || 'Untitled Activity'}
        </div>
      )
    },
    {
      key: 'type_c',
      title: 'Type',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value || 'Unknown'}
        </span>
      )
    },
    {
      key: 'description_c',
      title: 'Description',
      render: (value) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {value || 'No description'}
        </div>
      )
    },
    {
      key: 'entity_type_c',
      title: 'Entity Type',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value || 'N/A'}
        </span>
      )
    },
    {
      key: 'CreatedOn',
      title: 'Created',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleDateString() : 'Unknown'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.Id)}
            className="text-red-600 hover:text-red-800"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      )
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Manage and track all activities</p>
        </div>
        <Button onClick={handleCreate}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Activity
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search activities..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredActivities.length === 0 && !loading ? (
        <Empty 
          title="No activities found"
          description="Get started by creating your first activity"
          action={
            <Button onClick={handleCreate}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Activity
            </Button>
          }
        />
      ) : (
        <DataTable
          data={filteredActivities}
          columns={columns}
          loading={loading}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingActivity ? 'Edit Activity' : 'Create Activity'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              type="text"
              value={formData.Name}
              onChange={(e) => handleInputChange('Name', e.target.value)}
              placeholder="Enter activity name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Select
              value={formData.type_c}
              onChange={(e) => handleInputChange('type_c', e.target.value)}
              options={[
                { value: '', label: 'Select type' },
                { value: 'call', label: 'Call' },
                { value: 'email', label: 'Email' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'task', label: 'Task' },
                { value: 'note', label: 'Note' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description_c}
              onChange={(e) => handleInputChange('description_c', e.target.value)}
              placeholder="Enter activity description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <Select
              value={formData.entity_type_c}
              onChange={(e) => handleInputChange('entity_type_c', e.target.value)}
              options={[
                { value: '', label: 'Select entity type' },
                { value: 'contact', label: 'Contact' },
                { value: 'company', label: 'Company' },
                { value: 'deal', label: 'Deal' },
                { value: 'lead', label: 'Lead' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity ID
            </label>
            <Input
              type="text"
              value={formData.entity_id_c}
              onChange={(e) => handleInputChange('entity_id_c', e.target.value)}
              placeholder="Enter entity ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <Input
              type="text"
              value={formData.Tags}
              onChange={(e) => handleInputChange('Tags', e.target.value)}
              placeholder="Enter tags (comma-separated)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Save" size={16} className="mr-2" />
              )}
              {editingActivity ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Activities;