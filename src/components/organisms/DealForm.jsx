import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const DealForm = ({ deal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "Lead",
    contactId: "",
    companyId: "",
    expectedCloseDate: "",
    probability: "25",
  });
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const stages = [
    { value: "Lead", label: "Lead", probability: 25 },
    { value: "Qualified", label: "Qualified", probability: 50 },
    { value: "Proposal", label: "Proposal", probability: 75 },
    { value: "Negotiation", label: "Negotiation", probability: 90 },
    { value: "Closed Won", label: "Closed Won", probability: 100 },
    { value: "Closed Lost", label: "Closed Lost", probability: 0 },
  ];

  useEffect(() => {
    loadData();
    if (deal) {
      setFormData({
        title: deal.title || "",
        value: deal.value || "",
        stage: deal.stage || "Lead",
        contactId: deal.contactId || "",
        companyId: deal.companyId || "",
        expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : "",
        probability: deal.probability || "25",
      });
    }
  }, [deal]);

  const loadData = async () => {
    try {
      const [contactsData, companiesData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll(),
      ]);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load form data");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (!formData.companyId) {
      newErrors.companyId = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : null,
      };

      if (deal) {
        await dealService.update(deal.Id, submitData);
        toast.success("Deal updated successfully!");
      } else {
        await dealService.create(submitData);
        toast.success("Deal created successfully!");
      }
      onSave();
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error("Failed to save deal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-update probability when stage changes
    if (name === "stage") {
      const selectedStage = stages.find(s => s.value === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        probability: selectedStage ? selectedStage.probability.toString() : prev.probability
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const getContactsForCompany = () => {
    if (!formData.companyId) return contacts;
    return contacts.filter(contact => contact.companyId === formData.companyId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        name="title"
        label="Deal Title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="e.g. Q4 Software License Deal"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="value"
          label="Deal Value"
          type="number"
          step="0.01"
          min="0"
          value={formData.value}
          onChange={handleChange}
          error={errors.value}
          required
          placeholder="0.00"
        />

        <Select
          name="stage"
          label="Stage"
          value={formData.stage}
          onChange={handleChange}
          required
        >
          {stages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          name="companyId"
          label="Company"
          value={formData.companyId}
          onChange={handleChange}
          error={errors.companyId}
          placeholder="Select a company"
          required
        >
          {companies.map((company) => (
            <option key={company.Id} value={company.Id}>
              {company.name}
            </option>
          ))}
        </Select>

        <Select
          name="contactId"
          label="Contact"
          value={formData.contactId}
          onChange={handleChange}
          error={errors.contactId}
          placeholder="Select a contact"
          required
        >
          {getContactsForCompany().map((contact) => (
            <option key={contact.Id} value={contact.Id}>
              {contact.firstName} {contact.lastName}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="expectedCloseDate"
          label="Expected Close Date"
          type="date"
          value={formData.expectedCloseDate}
          onChange={handleChange}
          error={errors.expectedCloseDate}
        />

        <Input
          name="probability"
          label="Probability (%)"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={handleChange}
          error={errors.probability}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
        >
          {deal ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;