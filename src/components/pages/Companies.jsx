import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Modal from "@/components/molecules/Modal";
import CompanyForm from "@/components/organisms/CompanyForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [companiesData, contactsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll(),
      ]);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load companies");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(term) ||
          company.industry.toLowerCase().includes(term) ||
          (company.website && company.website.toLowerCase().includes(term)) ||
          (company.city && company.city.toLowerCase().includes(term)) ||
          (company.country && company.country.toLowerCase().includes(term))
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await companyService.delete(company.Id);
        toast.success("Company deleted successfully!");
        loadData();
      } catch (error) {
        console.error("Error deleting company:", error);
        toast.error("Failed to delete company");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
    loadData();
  };

  const getContactCount = (companyId) => {
    return contacts.filter(contact => contact.companyId === companyId).length;
  };

  const columns = [
    {
      key: "name",
      label: "Company Name",
      sortable: true,
    },
    {
      key: "industry",
      label: "Industry",
      sortable: true,
    },
    {
      key: "website",
      label: "Website",
      sortable: false,
      render: (value) => value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 underline"
        >
          {value.replace(/^https?:\/\//, "")}
        </a>
      ) : "—",
    },
    {
      key: "city",
      label: "Location",
      sortable: true,
      render: (value, row) => {
        const location = [row.city, row.country].filter(Boolean).join(", ");
        return location || "—";
      },
    },
    {
      key: "Id",
      label: "Contacts",
      sortable: false,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {getContactCount(value)}
        </span>
      ),
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
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">Manage your business accounts and organizations</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search companies by name, industry, or location..."
        className="max-w-md"
      />

      {/* Table */}
      {filteredCompanies.length === 0 && !loading ? (
        <Empty
          icon="Building2"
          title="No companies found"
          message={searchTerm ? "No companies match your search criteria." : "Get started by creating your first company."}
          actionText="Add Company"
          onAction={handleCreate}
        />
      ) : (
        <DataTable
          data={filteredCompanies}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No companies found"
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCompany ? "Edit Company" : "Create Company"}
        size="lg"
      >
        <CompanyForm
          company={selectedCompany}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </motion.div>
  );
};

export default Companies;