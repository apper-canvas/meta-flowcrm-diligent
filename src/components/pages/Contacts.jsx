import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Modal from "@/components/molecules/Modal";
import ContactForm from "@/components/organisms/ContactForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, companies, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [contactsData, companiesData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll(),
      ]);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError("Failed to load contacts");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = contacts.filter(
        (contact) =>
          contact.firstName.toLowerCase().includes(term) ||
          contact.lastName.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          (contact.phone && contact.phone.toLowerCase().includes(term)) ||
          (contact.position && contact.position.toLowerCase().includes(term))
      );
    }

    setFilteredContacts(filtered);
  };

  const handleCreate = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await contactService.delete(contact.Id);
        toast.success("Contact deleted successfully!");
        loadData();
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
    loadData();
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "—";
  };

  const columns = [
    {
      key: "firstName",
      label: "First Name",
      sortable: true,
    },
    {
      key: "lastName",
      label: "Last Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
    },
    {
      key: "companyId",
      label: "Company",
      sortable: false,
      render: (value) => getCompanyName(value),
    },
    {
      key: "position",
      label: "Position",
      sortable: false,
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
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your business contacts and relationships</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search contacts by name, email, phone, or position..."
        className="max-w-md"
      />

      {/* Table */}
      {filteredContacts.length === 0 && !loading ? (
        <Empty
          icon="Users"
          title="No contacts found"
          message={searchTerm ? "No contacts match your search criteria." : "Get started by creating your first contact."}
          actionText="Add Contact"
          onAction={handleCreate}
        />
      ) : (
        <DataTable
          data={filteredContacts}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No contacts found"
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContact ? "Edit Contact" : "Create Contact"}
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </motion.div>
  );
};

export default Contacts;