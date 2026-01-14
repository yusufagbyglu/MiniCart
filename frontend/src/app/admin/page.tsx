"use client";

import { EcommerceMetrics } from "@/components/admin/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "@/components/admin/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/admin/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/admin/ecommerce/StatisticsChart";
import RecentOrders from "@/components/admin/ecommerce/RecentOrders";
import DemographicCard from "@/components/admin/ecommerce/DemographicCard";
import { adminOrderService } from "@/services/admin/order-service";
import { adminProductService } from "@/services/admin/product-service";
import { adminUserService } from "@/services/admin/user-service";

export default function Ecommerce() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const orderStats = await adminOrderService.getOrderStats();
        const productStats = await adminProductService.getProductStats();
        const users = await adminUserService.getUsers(); // For now just use total count from users list

        setStats({
          totalOrders: orderStats.total_orders,
          totalRevenue: orderStats.total_revenue,
          totalProducts: productStats.total_products,
          totalCustomers: users.total || 0, // Assuming users response has total
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics
          totalOrders={stats.totalOrders}
          totalCustomers={stats.totalCustomers}
          totalRevenue={stats.totalRevenue}
          totalProducts={stats.totalProducts}
        />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}

