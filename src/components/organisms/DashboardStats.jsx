import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { leadService } from "@/services/api/leadService";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import StatsCard from "@/components/molecules/StatsCard";
const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDeals: 0,
    totalContacts: 0,
totalCompanies: 0,
    totalLeads: 0,
    winRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
const [deals, contacts, companies, leads] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll(),
        leadService.getAll(),
      ]);
      // Calculate revenue from closed won deals
const closedWonDeals = deals.filter(deal => (deal.stage_c || deal.stage) === "Closed Won");
      const totalRevenue = closedWonDeals.reduce((sum, deal) => sum + (deal.value_c || deal.value || 0), 0);

      // Calculate win rate
      const closedDeals = deals.filter(deal => 
        (deal.stage_c || deal.stage) === "Closed Won" || (deal.stage_c || deal.stage) === "Closed Lost"
      );
      const winRate = closedDeals.length > 0 
        ? Math.round((closedWonDeals.length / closedDeals.length) * 100)
        : 0;

      setStats({
        totalRevenue,
totalDeals: deals.length,
        totalContacts: contacts.length,
        totalLeads: leads.length,
        totalCompanies: companies.length,
        winRate,
      });
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStats} />;
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(stats.totalRevenue),
      icon: "DollarSign",
      color: "success",
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Active Deals",
      value: stats.totalDeals.toString(),
      icon: "TrendingUp",
      color: "primary",
      trend: "up",
      trendValue: "+5%",
    },
{
      title: "Total Leads",
      value: stats.totalLeads,
      icon: "UserPlus",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
      change: "+8.2%",
      trend: "up",
    },
    {
      title: "Total Contacts",
      value: stats.totalContacts.toString(),
      icon: "Users",
      color: "primary",
      trend: "up",
      trendValue: "+8%",
    },
    {
      title: "Win Rate",
      value: `${stats.winRate}%`,
      icon: "Target",
      color: stats.winRate >= 70 ? "success" : stats.winRate >= 40 ? "warning" : "danger",
      trend: stats.winRate >= 50 ? "up" : "down",
      trendValue: `${stats.winRate >= 50 ? "+" : "-"}3%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <StatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          trend={card.trend}
          trendValue={card.trendValue}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default DashboardStats;