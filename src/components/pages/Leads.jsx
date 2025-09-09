import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import DataTable from '@/components/molecules/DataTable';
import Modal from '@/components/molecules/Modal';
import LeadForm from '@/components/organisms/LeadForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { leadService } from '@/services/api/leadService';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getAll();
      setLeads(data);
    } catch (err) {
      setError('Failed to load leads');
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    if (!searchQuery.trim()) {
      setFilteredLeads(leads);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = leads.filter(lead => {
      const firstName = lead.first_name_c?.toLowerCase() || '';
      const lastName = lead.last_name_c?.toLowerCase() || '';
      const email = lead.email_c?.toLowerCase() || '';
      const company = lead.company_c?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      return fullName.includes(query) || 
             firstName.includes(query) ||
             lastName.includes(query) ||
             email.includes(query) ||
             company.includes(query);
    });
    
    setFilteredLeads(filtered);
  };

  const handleCreate = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleDelete = async (lead) => {
    if (!confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    setDeleting(lead.Id);
    try {
      const success = await leadService.delete(lead.Id);
      if (success) {
        toast.success('Lead deleted successfully');
        setLeads(prev => prev.filter(l => l.Id !== lead.Id));
      } else {
        toast.error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async (leadData) => {
    try {
      let result;
      if (editingLead) {
        result = await leadService.update(editingLead.Id, leadData);
        if (result) {
          toast.success('Lead updated successfully');
          setLeads(prev => prev.map(lead => 
            lead.Id === editingLead.Id ? { ...lead, ...result } : lead
          ));
        }
      } else {
        result = await leadService.create(leadData);
        if (result) {
          toast.success('Lead created successfully');
          await loadData();
        }
      }
      
      if (result) {
        setShowModal(false);
        setEditingLead(null);
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Failed to save lead');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (lead) => (
        <div>
          <div className="font-medium text-gray-900">
            {`${lead.first_name_c || ''} ${lead.last_name_c || ''}`.trim() || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">{lead.email_c}</div>
        </div>
      ),
    },
    {
      key: 'company_c',
      label: 'Company',
      render: (lead) => lead.company_c || 'N/A',
    },
    {
      key: 'position_c',
      label: 'Position',
      render: (lead) => lead.position_c || 'N/A',
    },
    {
      key: 'phone_c',
      label: 'Phone',
      render: (lead) => lead.phone_c || 'N/A',
    },
    {
      key: 'CreatedOn',
      label: 'Created',
      render: (lead) => {
        if (!lead.CreatedOn) return 'N/A';
        return new Date(lead.CreatedOn).toLocaleDateString();
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (lead) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(lead)}
            className="p-2"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(lead)}
            loading={deleting === lead.Id}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:pl-64">
        <div className="p-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 lg:pl-64">
        <div className="p-8">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64">
      <div className="p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
              <p className="text-gray-600 mt-1">Manage your sales leads</p>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <ApperIcon name="Plus" size={20} />
              Add New Lead
            </Button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search leads by name, email, or company..."
              className="max-w-md"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm">
            {filteredLeads.length === 0 && !loading ? (
              <div className="p-8">
                <Empty
                  title="No leads found"
                  description={searchQuery ? 
                    "No leads match your search criteria" : 
                    "Start by adding your first lead"
                  }
                  action={
                    <Button onClick={handleCreate}>
                      <ApperIcon name="Plus" size={20} className="mr-2" />
                      Add New Lead
                    </Button>
                  }
                />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredLeads}
                loading={loading}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLead(null);
        }}
        maxWidth="2xl"
      >
        <LeadForm
          lead={editingLead}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setEditingLead(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Leads;