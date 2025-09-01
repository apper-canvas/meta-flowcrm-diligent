import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await this.delay();
    return [...this.deals];
  }

  async getById(Id) {
    await this.delay();
    return this.deals.find(deal => deal.Id === Id);
  }

  async create(dealData) {
    await this.delay();
    const newDeal = {
      ...dealData,
      Id: Math.max(...this.deals.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deals.push(newDeal);
    return newDeal;
  }

  async update(Id, dealData) {
    await this.delay();
    const index = this.deals.findIndex(deal => deal.Id === Id);
    if (index !== -1) {
      this.deals[index] = {
        ...this.deals[index],
        ...dealData,
        updatedAt: new Date().toISOString(),
      };
      return this.deals[index];
    }
    throw new Error("Deal not found");
  }

  async delete(Id) {
    await this.delay();
    const index = this.deals.findIndex(deal => deal.Id === Id);
    if (index !== -1) {
      const deletedDeal = this.deals[index];
      this.deals.splice(index, 1);
      return deletedDeal;
    }
    throw new Error("Deal not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const dealService = new DealService();