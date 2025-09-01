import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await this.delay();
    return [...this.contacts];
  }

  async getById(Id) {
    await this.delay();
    return this.contacts.find(contact => contact.Id === Id);
  }

  async create(contactData) {
    await this.delay();
    const newContact = {
      ...contactData,
      Id: Math.max(...this.contacts.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.contacts.push(newContact);
    return newContact;
  }

  async update(Id, contactData) {
    await this.delay();
    const index = this.contacts.findIndex(contact => contact.Id === Id);
    if (index !== -1) {
      this.contacts[index] = {
        ...this.contacts[index],
        ...contactData,
        updatedAt: new Date().toISOString(),
      };
      return this.contacts[index];
    }
    throw new Error("Contact not found");
  }

  async delete(Id) {
    await this.delay();
    const index = this.contacts.findIndex(contact => contact.Id === Id);
    if (index !== -1) {
      const deletedContact = this.contacts[index];
      this.contacts.splice(index, 1);
      return deletedContact;
    }
    throw new Error("Contact not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const contactService = new ContactService();