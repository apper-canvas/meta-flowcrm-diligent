import companiesData from "@/services/mockData/companies.json";

class CompanyService {
  constructor() {
    this.companies = [...companiesData];
  }

  async getAll() {
    await this.delay();
    return [...this.companies];
  }

  async getById(Id) {
    await this.delay();
    return this.companies.find(company => company.Id === Id);
  }

  async create(companyData) {
    await this.delay();
    const newCompany = {
      ...companyData,
      Id: Math.max(...this.companies.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async update(Id, companyData) {
    await this.delay();
    const index = this.companies.findIndex(company => company.Id === Id);
    if (index !== -1) {
      this.companies[index] = {
        ...this.companies[index],
        ...companyData,
        updatedAt: new Date().toISOString(),
      };
      return this.companies[index];
    }
    throw new Error("Company not found");
  }

  async delete(Id) {
    await this.delay();
    const index = this.companies.findIndex(company => company.Id === Id);
    if (index !== -1) {
      const deletedCompany = this.companies[index];
      this.companies.splice(index, 1);
      return deletedCompany;
    }
    throw new Error("Company not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const companyService = new CompanyService();