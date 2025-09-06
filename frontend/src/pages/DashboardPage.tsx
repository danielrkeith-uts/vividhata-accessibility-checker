import React from "react";
import { useAuth } from "../context/AuthContext";
import { OverviewCard } from "../components/dashboard/OverviewCard";
import { GaugeChart } from "../components/dashboard/GaugeChart";
import { BreakdownTable } from "../components/dashboard/BreakdownTable";
import { TaskList } from "../components/dashboard/TaskList";
import { UserDropDown } from "../components/common/UserDropDown";
import { PriorityChart } from "../components/dashboard/PriorityChart";
import {
  overviewData,
  requirementsData,
  tasksData,
  priorityData,
  categoryData,
} from "./DashData";
import "./DashboardPage.css";
import { Button } from "../components/common/Button";
import { useLocation } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const websiteUrl = searchParams.get("url") || "https://www.example.com";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-user-info">
            <UserDropDown
              firstName={user?.firstName}
              lastName={user?.lastName}
              role="Web Developer"
            />
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-row">
          <div className="dashboard-url-bar">
            <span className="dashboard-url-value">{websiteUrl}</span>
          </div>
          <div className="dashboard-rescan-button-container" >
            <Button onClick={() => console.log("Rescan clicked")} variant="secondary">
              Rescan
            </Button>
            <Button onClick={() => console.log("Export to PDF clicked")} variant='outline'>
              Export to PDF
            </Button>
          </div>
        </div>

        {/* Wrap OverviewCards, PriorityChart and GaugeChart */}
        <div className="dashboard-overview-row">
          <OverviewCard
            accessibilityXAxis={overviewData.xAxis}
            accessibilityYAxis={overviewData.yAxis}
            improvement={overviewData.improvement}
          />
          <PriorityChart priorityData={priorityData} />
          <GaugeChart
            score={80}
            totalRequirements={143}
            compliantCount={103}
            atRiskCount={24}
            nonCompliantCount={16}
            categoryData={categoryData}
          />
        </div>
        {/* Breakdown and Tasks Row */}
        <div className="dashboard-breakdown-tasks-row">
          <div className="breakdown-section">
            <BreakdownTable requirements={requirementsData} />
          </div>
          <div className="tasks-section">
            <TaskList tasks={tasksData} />
          </div>
        </div>
      </main>
    </div>
  );
};
