import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { OverviewCards } from '../components/dashboard/OverviewCards';
import { GaugeChart } from '../components/dashboard/GaugeChart';
import { BreakdownTable } from '../components/dashboard/BreakdownTable';
import { TaskList } from '../components/dashboard/TaskList';
import { PriorityChart } from '../components/dashboard/PriorityChart';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Sample data - this will come from backend
  const overviewData = {
    accessibilityTrend: [65, 68, 72, 70, 75, 78, 72, 76, 80, 82, 79, 85, 88, 90, 87, 89, 92, 88, 91, 94, 96, 93, 95, 97, 98, 96, 97, 99, 98, 100],
    ranking: "You're in the top 20% of sites scanned this month",
    improvement: 73,
    majorIssues: 5,
    targetCompliance: 90,
    topIssues: ["HTML valid and semantic", "Language of page defined"]
  };

  const gaugeData = {
    score: 72,
    totalRequirements: 95,
    compliantCount: 26,
    atRiskCount: 35,
    nonCompliantCount: 35
  };

  const requirementsData = [
    {
      id: '1',
      description: 'All non-text content has meaningful alt text',
      category: 'Perceivable',
      status: 'Compliant' as const,
      severity: 100
    },
    {
      id: '2',
      description: 'No keyboard traps',
      category: 'Operable',
      status: 'At Risk' as const,
      severity: 35
    },
    {
      id: '3',
      description: 'Language of page is defined',
      category: 'Understandable',
      status: 'Non Compliant' as const,
      severity: 68
    },
    {
      id: '4',
      description: 'HTML is valid and semantic',
      category: 'Robust',
      status: 'Compliant' as const,
      severity: 100
    },
    {
      id: '5',
      description: 'Elements have proper ARIA roles and states',
      category: 'Robust',
      status: 'At Risk' as const,
      severity: 50
    }
  ];

  const tasksData = [
    {
      id: '1',
      description: 'Add meaningful alt text to all non-text content',
      category: 'Perceivable',
      status: 'Completed' as const,
      priority: 'High' as const,
      completed: true
    },
    {
      id: '2',
      description: 'Breadcrumb navigation available',
      category: 'Operable',
      status: 'To Do' as const,
      priority: 'Medium' as const,
      completed: false
    },
    {
      id: '3',
      description: 'Touch targets large enough (44x44px)',
      category: 'Operable',
      status: 'To Do' as const,
      priority: 'High' as const,
      completed: false
    },
    {
      id: '4',
      description: 'Appropriate input fields used',
      category: 'Robust',
      status: 'In Progress' as const,
      priority: 'Medium' as const,
      completed: false
    },
    {
      id: '5',
      description: 'Acronyms and jargon explained or avoided',
      category: 'Understandable',
      status: 'Completed' as const,
      priority: 'Low' as const,
      completed: true
    }
  ];

  const priorityData = [
    { level: 'AAA', value: 74.75, color: '#60a5fa' },
    { level: 'A', value: 65.68, color: '#8b5cf6' },
    { level: 'AA', value: 68.63, color: '#f97316' }
  ];

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
        {/* Overview Cards */}
        <OverviewCards {...overviewData} />

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column - Gauge Chart */}
          <div className="dashboard-left">
            <GaugeChart {...gaugeData} />
          </div>

          {/* Right Column - Breakdown Table */}
          <div className="dashboard-right">
            <BreakdownTable requirements={requirementsData} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="dashboard-bottom">
          {/* Task List */}
          <div className="dashboard-bottom-left">
            <TaskList tasks={tasksData} />
          </div>

          {/* Priority Chart */}
          <div className="dashboard-bottom-right">
            <PriorityChart data={priorityData} />
          </div>
        </div>
      </main>
    </div>
  );
};
