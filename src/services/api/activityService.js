import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await this.delay();
    return [...this.activities];
  }

  async getById(Id) {
    await this.delay();
    return this.activities.find(activity => activity.Id === Id);
  }

  async create(activityData) {
    await this.delay();
    const newActivity = {
      ...activityData,
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  async delete(Id) {
    await this.delay();
    const index = this.activities.findIndex(activity => activity.Id === Id);
    if (index !== -1) {
      const deletedActivity = this.activities[index];
      this.activities.splice(index, 1);
      return deletedActivity;
    }
    throw new Error("Activity not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const activityService = new ActivityService();