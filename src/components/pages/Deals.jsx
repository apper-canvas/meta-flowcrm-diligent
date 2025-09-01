import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Modal from "@/components/molecules/Modal";
import DealForm from "@/components/organisms/DealForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDeals();
  }, [deals, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData, companiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll(),
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError("Failed to load deals");
      console.error("Error loading deals:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterDeals = () => {
    let filtered = deals;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = deals.filter(
        (deal) =>
          deal.title.toLowerCase().includes(term) ||
          deal.stage.toLowerCase().includes(term) ||
          deal.value.toString().includes(term)
      );
    }

    setFilteredDeals(filtered);
  };

  const handleCreate = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleDelete = async (deal) => {
    if (window.confirm(`Are you sure you want to delete the deal "${deal.title}"?`)) {
      try {
        await dealService.delete(deal.Id);
        toast.success("Deal deleted successfully!");
        loadData();
      } catch (error) {
        console.error("Error deleting deal:", error);
        toast.error("Failed to delete deal");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
    loadData();
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : "—";
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "—";
  };

  const getStageBadgeVariant = (stage) => {
    switch (stage) {
      case "Lead": return "default";
      case "Qualified": return "info";
      case "Proposal": return "warning";
      case "Negotiation": return "primary";
      case "Closed Won": return "success";
      case "Closed Lost": return "danger";
      default: return "default";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Deal Title",
      sortable: true,
    },
    {
      key: "value",
      label: "Value",
      sortable: true,
      type: "currency",
    },
    {
      key: "stage",
      label: "Stage",
      sortable: true,
      type: "badge",
      getBadgeVariant: getStageBadgeVariant,
    },
    {
      key: "contactId",
      label: "Contact",
      sortable: false,
      render: (value) => getContactName(value),
    },
    {
      key: "companyId",
      label: "Company",
      sortable: false,
      render: (value) => getCompanyName(value),
    },
    {
      key: "probability",
      label: "Probability",
      sortable: true,
      render: (value) => `${value}%`,
    },
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600">Track your sales pipeline and close more deals</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search deals by title, stage, or value..."
        className="max-w-md"
      />

      {/* Table */}
      {filteredDeals.length === 0 && !loading ? (
        <Empty
          icon="TrendingUp"
          title="No deals found"
          message={searchTerm ? "No deals match your search criteria." : "Get started by creating your first deal."}
          actionText="Add Deal"
          onAction={handleCreate}
        />
      ) : (
        <DataTable
          data={filteredDeals}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No deals found"
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDeal ? "Edit Deal" : "Create Deal"}
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </motion.div>
  );
};

export default Deals;