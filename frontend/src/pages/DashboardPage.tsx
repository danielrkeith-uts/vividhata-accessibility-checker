import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { OverviewCard } from '../components/dashboard/OverviewCard';
import { GaugeChart } from '../components/dashboard/GaugeChart';
import { BreakdownTable } from '../components/dashboard/BreakdownTable';
import { TaskList } from '../components/dashboard/TaskList';
import { PriorityChart } from '../components/dashboard/PriorityChart';
import { overviewData, gaugeData, requirementsData, tasksData, priorityData, categoryData } from './DashData';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-user-info">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-role">Web Developer</span>
              </div>
              <button className="user-dropdown">▼</button>
            </div>
            <Button variant="outline" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
  {/* Wrap OverviewCards, PriorityChart and GaugeChart */}
  <div className="dashboard-overview-row">
  <OverviewCard 
            accessibilityXAxis={overviewData.xAxis} 
            accessibilityYAxis={overviewData.yAxis} 
            improvement={overviewData.improvement}
          />    <PriorityChart priorityData={priorityData} />
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
