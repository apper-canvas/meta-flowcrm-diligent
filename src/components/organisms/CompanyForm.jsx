import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { companyService } from "@/services/api/companyService";

const CompanyForm = ({ company, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Education",
    "Retail",
    "Real Estate",
    "Consulting",
    "Other"
  ];

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        industry: company.industry || "",
        website: company.website || "",
        phone: company.phone || "",
        address: company.address || "",
        city: company.city || "",
        country: company.country || "",
      });
    }
  }, [company]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = "Website must be a valid URL (include http:// or https://)";
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
      if (company) {
        await companyService.update(company.Id, formData);
        toast.success("Company updated successfully!");
      } else {
        await companyService.create(formData);
        toast.success("Company created successfully!");
      }
      onSave();
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("Failed to save company");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="name"
          label="Company Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Select
          name="industry"
          label="Industry"
          value={formData.industry}
          onChange={handleChange}
          error={errors.industry}
          placeholder="Select an industry"
          required
        >
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="website"
          label="Website"
          value={formData.website}
          onChange={handleChange}
          error={errors.website}
          placeholder="https://example.com"
        />

        <Input
          name="phone"
          label="Phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
      </div>

      <Input
        name="address"
        label="Address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
        />

        <Input
          name="country"
          label="Country"
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
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
          {company ? "Update Company" : "Create Company"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;