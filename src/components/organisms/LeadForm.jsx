import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { toast } from 'react-toastify';

const LeadForm = ({ lead, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    phone_c: '',
    company_c: '',
    position_c: '',
    Tags: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        first_name_c: lead.first_name_c || '',
        last_name_c: lead.last_name_c || '',
        email_c: lead.email_c || '',
        phone_c: lead.phone_c || '',
        company_c: lead.company_c || '',
        position_c: lead.position_c || '',
        Tags: lead.Tags || ''
      });
    }
  }, [lead]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = 'First name is required';
    }

    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = 'Last name is required';
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {lead ? 'Edit Lead' : 'Add New Lead'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.first_name_c}
            onChange={(e) => handleChange('first_name_c', e.target.value)}
            error={errors.first_name_c}
            placeholder="Enter first name"
            className="w-full"
          />
          
          <Input
            label="Last Name *"
            value={formData.last_name_c}
            onChange={(e) => handleChange('last_name_c', e.target.value)}
            error={errors.last_name_c}
            placeholder="Enter last name"
            className="w-full"
          />
        </div>

        <Input
          label="Email *"
          type="email"
          value={formData.email_c}
          onChange={(e) => handleChange('email_c', e.target.value)}
          error={errors.email_c}
          placeholder="Enter email address"
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={formData.phone_c}
            onChange={(e) => handleChange('phone_c', e.target.value)}
            error={errors.phone_c}
            placeholder="Enter phone number"
            className="w-full"
          />
          
          <Input
            label="Company"
            value={formData.company_c}
            onChange={(e) => handleChange('company_c', e.target.value)}
            error={errors.company_c}
            placeholder="Enter company name"
            className="w-full"
          />
        </div>

        <Input
          label="Position"
          value={formData.position_c}
          onChange={(e) => handleChange('position_c', e.target.value)}
          error={errors.position_c}
          placeholder="Enter job position"
          className="w-full"
        />

        <Input
          label="Tags"
          value={formData.Tags}
          onChange={(e) => handleChange('Tags', e.target.value)}
          error={errors.Tags}
          placeholder="Enter tags (comma separated)"
          className="w-full"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="px-4 py-2"
          >
            {loading ? 'Saving...' : (lead ? 'Update Lead' : 'Create Lead')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;